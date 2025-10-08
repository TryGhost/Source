/**
 * pagination
 * @param {Boolean} isInfinite  - trueなら無限スクロール、falseならロードボタンを使う
 * @param {Function} done       - 読み込み完了後のコールバック関数(オプション)
 * @param {Boolean} isMasonry   - Masonryレイアウト用のフラグ(オプション)
 */
function pagination(isInfinite = false, done, isMasonry = false) {
    const feedElement = document.querySelector('.arcat-post-list');
    if (!feedElement) {
        return;
    }

    let loading = false;
    const target = document.querySelector('.pagination');
    const buttonElement = document.querySelector('.arcat-loadmore');

    if (!document.querySelector('link[rel=next]') && buttonElement) {
        buttonElement.remove();
    }

    const loadNextPage = async function () {
        const nextElement = document.querySelector('link[rel=next]');
        if (!nextElement) {
            return;
        }

        try {
            const res = await fetch(nextElement.href);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const postElements = doc.querySelectorAll('.arcat-post-list > *');
            const fragment = document.createDocumentFragment();
            const elems = [];

            postElements.forEach(function (post) {
                const clonedItem = document.importNode(post, true);

                if (isMasonry) {
                    clonedItem.style.visibility = 'hidden';
                }

                fragment.appendChild(clonedItem);
                elems.push(clonedItem);
            });

            feedElement.appendChild(fragment);

            if (done) {
                done(elems, loadNextWithCheck);
            }

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
            const nextElement = document.querySelector('link[rel=next]');
            if (nextElement) {
                nextElement.remove();
            }
            throw e;
        }
    };

    const loadNextWithCheck = async function () {
        if (
            target &&
            target.getBoundingClientRect().top <= window.innerHeight &&
            document.querySelector('link[rel=next]')
        ) {
            await loadNextPage();
        }
    };

    const callback = async function (entries, observer) {
        if (loading) {
            return;
        }
        loading = true;

        if (entries[0].isIntersecting) {
            if (!isMasonry) {
                while (
                    target &&
                    target.getBoundingClientRect().top <= window.innerHeight &&
                    document.querySelector('link[rel=next]')
                ) {
                    await loadNextPage();
                }
            } else {
                await loadNextPage();
            }
        }

        loading = false;

        if (!document.querySelector('link[rel=next]')) {
            observer.disconnect();
        }
    };

    const observer = new IntersectionObserver(callback);

    if (isInfinite) {
        if (target) {
            observer.observe(target);
        }
    } else if (buttonElement) {
        buttonElement.addEventListener('click', loadNextPage);
    }
}
