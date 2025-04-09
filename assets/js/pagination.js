/**
 * pagination
 * @param {Boolean} isInfinite  - trueなら無限スクロール、falseならロードボタンを使う
 * @param {Function} done       - 読み込み完了後のコールバック関数(オプション)
 * @param {Boolean} isMasonry   - Masonryレイアウト用のフラグ(オプション)
 */
function pagination(isInfinite = false, done, isMasonry = false) {
    // 記事一覧の要素を取得
    const feedElement = document.querySelector('.arcat-post-list');
    if (!feedElement) return; // なければ中断

    let loading = false;

    // 無限スクロールの監視対象となる要素
    // 今回のHTMLには <nav class="pagination"> があるのでそれを監視対象にする
    const target = document.querySelector('.pagination');

    // 「もっと読む」ボタンがあるなら取得（今回はHTMLに無いが、将来追加するかもしれない場合を想定）
    const buttonElement = document.querySelector('.arcat-loadmore');

    // 次ページのURLは <link rel="next"> で管理する想定（Ghostの標準的な方法）
    // 現在のHTMLには <link rel="next"> が無い場合があるので、その場合はボタンを消す
    if (!document.querySelector('link[rel=next]') && buttonElement) {
        buttonElement.remove();
    }

    /**
     * 実際に次ページを読み込む関数
     */
    const loadNextPage = async function () {
        const nextElement = document.querySelector('link[rel=next]');
        if (!nextElement) return; // 次ページがないなら何もしない

        try {
            const res = await fetch(nextElement.href);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 次ページの `.arcat-post-list` 内の子要素を全部取得
            const postElements = doc.querySelectorAll('.arcat-post-list > *');
            const fragment = document.createDocumentFragment();
            const elems = [];

            postElements.forEach(function (post) {
                const clonedItem = document.importNode(post, true);

                // isMasonryがtrueのときは一旦非表示にするなどの処理
                if (isMasonry) {
                    clonedItem.style.visibility = 'hidden';
                }

                fragment.appendChild(clonedItem);
                elems.push(clonedItem);
            });

            // 今のページの .arcat-post-list に次ページの要素を追加
            feedElement.appendChild(fragment);

            // コールバックが指定されていれば呼ぶ（Masonryの再計算など）
            if (done) {
                done(elems, loadNextWithCheck);
            }

            // 新しいページにも <link rel="next"> があれば更新、なければ削除する
            const resNextElement = doc.querySelector('link[rel=next]');
            if (resNextElement && resNextElement.href) {
                nextElement.href = resNextElement.href;
            } else {
                nextElement.remove();
                if (buttonElement) {
                    buttonElement.remove();
                }
            }
        } catch (e) {
            // エラー時は念のため link[rel=next] を削除して停止
            const nextElement = document.querySelector('link[rel=next]');
            if (nextElement) {
                nextElement.remove();
            }
            throw e;
        }
    };

    /**
     * 「ターゲットが見えるかどうかを再チェックして、見えてたら次ページを読込む」関数
     * (主にMasonry再描画後に高さが変わったときなどに使う)
     */
    const loadNextWithCheck = async function () {
        if (
            target &&
            target.getBoundingClientRect().top <= window.innerHeight &&
            document.querySelector('link[rel=next]')
        ) {
            await loadNextPage();
        }
    };

    /**
     * IntersectionObserverのコールバック
     */
    const callback = async function (entries, observer) {
        if (loading) return;
        loading = true;

        // ターゲット要素がビューポート内に入っているか
        if (entries[0].isIntersecting) {
            if (!isMasonry) {
                // ターゲットがまだ見えていて、かつ次ページがあるうちは繰り返しロード
                while (
                    target.getBoundingClientRect().top <= window.innerHeight &&
                    document.querySelector('link[rel=next]')
                ) {
                    await loadNextPage();
                }
            } else {
                // Masonryの場合は1ページ分だけロードして、レイアウト再計算後に再判断
                await loadNextPage();
            }
        }

        loading = false;

        // 次ページが無ければ監視停止
        if (!document.querySelector('link[rel=next]')) {
            observer.disconnect();
        }
    };

    // IntersectionObserverを作成
    const observer = new IntersectionObserver(callback);

    // isInfinite=true なら無限スクロールを有効にする
    // falseなら「もっと読む」ボタンでロード
    if (isInfinite) {
        // ターゲット要素がなければ何もしない
        if (target) {
            observer.observe(target);
        }
    } else {
        // ボタンがある場合のみ
        if (buttonElement) {
            buttonElement.addEventListener('click', loadNextPage);
        }
    }
}