/**
 * 雑誌タグ処理
 * magazines.hbsに定義されている雑誌タグを記事カードと記事詳細ページで表示
 */
/* eslint-env browser */
(function () {
    'use strict';

    // 各雑誌タグと親カテゴリーのマッピング
    const MAGAZINE_CATEGORIES = {
        // ブランドムック
        'brandmook': 'brandmook',

        // 女性ファッション雑誌
        '25ans-hearstfujingaho': 'women-magazine',
        'androsy-takarajimasha': 'women-magazine',
        'baila-shueisha': 'women-magazine',
        'bestory-kobunsha': 'women-magazine',
        'bijinhyakka-kadokawaharuki': 'women-magazine',
        'biteki-shogakukan': 'women-magazine',
        'cancam-shogakukan': 'women-magazine',
        'domani-shogakukan': 'women-magazine',
        'eclat-shueisha': 'women-magazine',
        'elledecor-hearstfujingaho': 'women-magazine',
        'ellejapon-hearstfujingaho': 'women-magazine',
        'fudge-saneishobo': 'women-magazine',
        'fujingaho-hearstfujingaho': 'women-magazine',
        'gina-bunkasha': 'women-magazine',
        'ginger-gentosha': 'women-magazine',
        'glow-takarajimasha': 'women-magazine',
        'harpersbazaar-hearstfujingaho': 'women-magazine',
        'inred-takarajimasha': 'women-magazine',
        'jelly-bunkasha': 'women-magazine',
        'jj-kobunsha': 'women-magazine',
        'jsgirl-saneishobo': 'women-magazine',
        'kimonoanne-tacshuppan': 'women-magazine',
        'kirapichi-gakken': 'women-magazine',
        'kunel-magazinehouse': 'women-magazine',
        'lafarfa-bunkasha': 'women-magazine',
        'larme-tokumashoten': 'women-magazine',
        'lee-shueisha': 'women-magazine',
        'liniere-takarajimasha': 'women-magazine',
        'loveggg-mediaboy': 'women-magazine',
        'maquia-shueisha': 'women-magazine',
        'marisol-shueisha': 'women-magazine',
        'mini-takarajimasha': 'women-magazine',
        'more-shueisha': 'women-magazine',
        'nicola-shinchosha': 'women-magazine',
        'nicopuchi-shinchosha': 'women-magazine',
        'nonno-shueisha': 'women-magazine',
        'numerotokyo-fusosha': 'women-magazine',
        'oggi-shogakukan': 'women-magazine',
        'osharetecho-takarajimasha': 'women-magazine',
        'otonamuse-takarajimasha': 'women-magazine',
        'popteen-kadokawaharuki': 'women-magazine',
        'richesse-hearstfujingaho': 'women-magazine',
        'seventeen-shueisha': 'women-magazine',
        'spring-takarajimasha': 'women-magazine',
        'spur-shueisha': 'women-magazine',
        'steady-takarajimasha': 'women-magazine',
        'sutekinaanohito-takarajimasha': 'women-magazine',
        'sweet-takarajimasha': 'women-magazine',
        'utsukushiikimono-hearstfujingaho': 'women-magazine',
        'vivi-kodansha': 'women-magazine',
        'voce-kodansha': 'women-magazine',
        'waraku-shogakukan': 'women-magazine',
        'with-kodansha': 'women-magazine',
        'yogini-peacs': 'women-magazine',

        // 少女・女性マンガの付録
        'ciao-shogakukan': 'women-manga',
        'nakayosi-kodansha': 'women-manga',
        'ribon-shueisha': 'women-manga',
        'shocomi-shogakukan': 'women-manga',

        // 子供・児童学習 雑誌
        'babybook-shogakukan': 'child-magazine',
        'fukufuku-fukuinkan': 'child-magazine',
        'genki-kodansha': 'child-magazine',
        'inaiinai-kodansha': 'child-magazine',
        'mebae-shogakukan': 'child-magazine',
        'nene-shufu': 'child-magazine',
        'okaitsu-kodansha': 'child-magazine',
        'otomodachi-kodansha': 'child-magazine',
        'pucchigumi-shogakukan': 'child-magazine',
        'sho1-shogakukan': 'child-magazine',
        'sho8-shogakukan': 'child-magazine',
        'tanoyo-kodansha': 'child-magazine',
        'telemaga-kodansha': 'child-magazine',
        'televikun-shogakukan': 'child-magazine',
        'youchien-shogakukan': 'child-magazine',

        // ママ・主婦雑誌
        '39mag-benesse': 'mother-magazine',
        'akahoshi-shufunotomo': 'mother-magazine',
        'babymo-shufunotomo': 'mother-magazine',
        'cookpadplus-7andi': 'mother-magazine',
        'croissant-magazinehouse': 'mother-magazine',
        'ellegourmet-hearstfujingaho': 'mother-magazine',
        'esse-fusosha': 'mother-magazine',
        'hiyokoclub-benesse': 'mother-magazine',
        'hugmug-sekaibunkasha': 'mother-magazine',
        'kodomoe-hakusensha': 'mother-magazine',
        'lettuceclub-kadokawa': 'mother-magazine',
        'moe-hakusensha': 'mother-magazine',
        'orangepage': 'mother-magazine',
        'premo-shufunotomo': 'mother-magazine',
        'sutekinaokusan-shufutoseikatsusha': 'mother-magazine',

        // 結婚情報誌
        'ellemariage-hearstfujingaho': 'wedding-magazine',
        'zexy-recruit': 'wedding-magazine',

        // メンズファッション雑誌
        'dime-shogakukan': 'men-magazine',
        'getnavi-gakkenplus': 'men-magazine',
        'lightning-eipublishing': 'men-magazine',
        'mensclub-hearstfujingaho': 'men-magazine',
        'mensnonno-shueisha': 'men-magazine',
        'monomaster-takarajimasha': 'men-magazine',
        'monomax-takarajimasha': 'men-magazine',
        'smart-takarajimasha': 'men-magazine',
        'uomo-shueisha': 'men-magazine',

        // アウトドア雑誌
        'bepal-shogakukan': 'outdoor-magazine',
        'bicycleclub-eipublishing': 'outdoor-magazine',
        'camplife-yamakei': 'outdoor-magazine',
        'cyclesports-yaesu': 'outdoor-magazine',
        'fielder-kasakura': 'outdoor-magazine',
        'peaks-eipublishing': 'outdoor-magazine',
        'randonnee-eipublishing': 'outdoor-magazine',
        'wandervogel-yamakei': 'outdoor-magazine',

        // その他雑誌
        'modernliving-hearstfujingaho': 'other-magazine',
        'nikkeiwoman-nikkeibp': 'other-magazine',
        'serai-shogakukan': 'other-magazine',
        'tabinotecho-kotsushinbun': 'other-magazine',
        'tokyowalker-kadokawa': 'other-magazine',

        // エンタメ
        'campaign': 'entertainment',
        'furoku-favorite': 'entertainment',
        'furoku-ranking': 'entertainment',
        'furoku-sufficiency': 'entertainment',
        'other': 'entertainment',
        'recommended': 'entertainment',
        'subscription-tokuten': 'entertainment'
    };

    /**
     * タグリストから最初の雑誌タグを見つけて親カテゴリー配下のURLに変換
     * @param {Array} tags - タグ情報の配列 [{slug: '', name: '', url: ''}, ...]
     * @returns {Object|null} - 雑誌タグオブジェクト（urlを親カテゴリー配下に変更したもの）またはnull
     */
    function findMagazineTag(tags) {
        if (!tags || tags.length === 0) {
            return null;
        }

        for (let i = 0; i < tags.length; i++) {
            const slug = tags[i].slug;
            if (MAGAZINE_CATEGORIES[slug]) {
                const parentCategory = MAGAZINE_CATEGORIES[slug];
                return {
                    slug: slug,
                    name: tags[i].name,
                    url: '/category/' + parentCategory + '/' + slug + '/'
                };
            }
        }

        return null;
    }

    /**
     * 記事カードの雑誌タグを処理
     */
    function processPostCardMagazineTags() {
        const postCards = document.querySelectorAll('.post-card[data-magazine-tags]');

        postCards.forEach(function (card) {
            const tagsData = card.getAttribute('data-magazine-tags');
            if (!tagsData) {
                return;
            }

            try {
                const tags = JSON.parse(tagsData);
                const magazineTag = findMagazineTag(tags);

                if (magazineTag) {
                    const tagElement = card.querySelector('.magazine-tag-placeholder');
                    if (tagElement) {
                        tagElement.innerHTML = '<a class="dfont cat-name catid68" href="' +
                            magazineTag.url + '">' + magazineTag.name + '</a>';
                    }
                }
            } catch (e) {
                // JSONパースエラーは無視
            }
        });
    }

    /**
     * 記事詳細ページの雑誌タグを処理
     */
    function processPostDetailMagazineTag() {
        const categoryElement = document.querySelector('.post-category-placeholder[data-magazine-tags]');
        if (!categoryElement) {
            return;
        }

        const tagsData = categoryElement.getAttribute('data-magazine-tags');
        if (!tagsData) {
            return;
        }

        // 親カテゴリータグのリスト
        const parentCategoryTags = {
            'brandmook': 'ブランドムック',
            'women-magazine': '女性ファッション雑誌',
            'women-manga': '少女・女性マンガの付録',
            'child-magazine': '子供・児童学習 雑誌',
            'mother-magazine': 'ママ・主婦雑誌',
            'wedding-magazine': '結婚情報誌',
            'men-magazine': 'メンズファッション雑誌',
            'outdoor-magazine': 'アウトドア雑誌',
            'other-magazine': 'その他雑誌',
            'entertainment': 'エンタメ'
        };

        try {
            const tags = JSON.parse(tagsData);
            const magazineTag = findMagazineTag(tags);

            if (magazineTag) {
                // 子タグが見つかった場合
                categoryElement.innerHTML = '<div>' +
                    '<p class="footer-meta_title">CATEGORY :</p>' +
                    '<ul class="post-categories">' +
                    '<li><a href="' + magazineTag.url + '" rel="category tag">' +
                    magazineTag.name + '</a></li>' +
                    '</ul>' +
                    '</div>';

                // TAGSセクションから雑誌タグと親カテゴリータグを削除
                removeMagazineTagFromTagsList(magazineTag.slug);

                // 親カテゴリーも削除
                const parentCategory = MAGAZINE_CATEGORIES[magazineTag.slug];
                if (parentCategory) {
                    removeMagazineTagFromTagsList(parentCategory);
                }
            } else {
                // 子タグが見つからない場合、親カテゴリータグをチェック
                for (let i = 0; i < tags.length; i++) {
                    const slug = tags[i].slug;
                    if (parentCategoryTags[slug]) {
                        // 親カテゴリータグが見つかった
                        categoryElement.innerHTML = '<div>' +
                            '<p class="footer-meta_title">CATEGORY :</p>' +
                            '<ul class="post-categories">' +
                            '<li><a href="/category/' + slug + '/" rel="category tag">' +
                            tags[i].name + '</a></li>' +
                            '</ul>' +
                            '</div>';

                        // TAGSセクションから親カテゴリータグを削除
                        removeMagazineTagFromTagsList(slug);
                        break;
                    }
                }
            }
        } catch (e) {
            // JSONパースエラーは無視
        }
    }

    /**
     * TAGSセクションから雑誌タグを削除
     * @param {string} magazineTagSlug - 削除する雑誌タグのslug
     */
    function removeMagazineTagFromTagsList(magazineTagSlug) {
        const tagsSection = document.querySelector('.meta-tag ul');
        if (!tagsSection) {
            return;
        }

        const tagLinks = tagsSection.querySelectorAll('li a[href*="/' + magazineTagSlug + '"]');
        tagLinks.forEach(function (link) {
            const listItem = link.parentElement;
            if (listItem) {
                listItem.remove();
            }
        });
    }

    /**
     * パンくずナビゲーションを処理
     */
    function processBreadcrumb() {
        // 既に処理済みかチェック
        if (document.querySelector('.breadcrumb-processed')) {
            return;
        }

        const placeholders = document.querySelectorAll('.breadcrumb-placeholder[data-tag-slug]');
        if (!placeholders || placeholders.length === 0) {
            return;
        }

        // 最初のplaceholderのみ処理（重複を避ける）
        const placeholder = placeholders[0];
        const tagSlug = placeholder.getAttribute('data-tag-slug');
        const tagName = placeholder.getAttribute('data-tag-name');
        const postTitle = placeholder.getAttribute('data-post-title');

        // 他のplaceholderを削除
        for (let i = 1; i < placeholders.length; i++) {
            placeholders[i].remove();
        }

        // カテゴリーページかどうかを判定（URLに/category/が含まれる）
        const isCategoryPage = window.location.pathname.indexOf('/category/') === 0;

        // 投稿ページかどうかを判定（postTitleがある）
        const isPostPage = !!postTitle;

        // 親カテゴリーのマッピング
        const parentCategoryNames = {
            'brandmook': 'ブランドムック',
            'women-magazine': '女性ファッション雑誌',
            'women-manga': '少女・女性マンガの付録',
            'child-magazine': '子供・児童学習 雑誌',
            'mother-magazine': 'ママ・主婦雑誌',
            'wedding-magazine': '結婚情報誌',
            'men-magazine': 'メンズファッション雑誌',
            'outdoor-magazine': 'アウトドア雑誌',
            'other-magazine': 'その他雑誌',
            'entertainment': 'エンタメ',
            'uncategorized': 'Uncategorized'
        };

        // 親カテゴリーかチェック
        if (parentCategoryNames[tagSlug]) {
            // 親カテゴリーページ
            if (isCategoryPage) {
                // カテゴリーページでは現在のページは表示しない
                placeholder.remove();
            } else {
                // 投稿ページでは親カテゴリーリンクのみ表示
                placeholder.innerHTML =
                    '<a href="/category/' + tagSlug + '/" itemprop="item">' +
                    '<span itemprop="name">' + tagName + '</span>' +
                    '</a>' +
                    '<meta itemprop="position" content="2">';
                placeholder.setAttribute('itemprop', 'itemListElement');
                placeholder.setAttribute('itemscope', '');
                placeholder.setAttribute('itemtype', 'http://schema.org/ListItem');
                placeholder.classList.add('breadcrumb-processed');
            }
        } else {
            // 子タグページ
            const parentCategory = MAGAZINE_CATEGORIES[tagSlug];
            if (parentCategory && parentCategoryNames[parentCategory]) {
                // 親カテゴリーのli要素を作成
                const parentLi = document.createElement('li');
                parentLi.setAttribute('itemprop', 'itemListElement');
                parentLi.setAttribute('itemscope', '');
                parentLi.setAttribute('itemtype', 'http://schema.org/ListItem');
                parentLi.innerHTML =
                    '<a href="/category/' + parentCategory + '/" itemprop="item">' +
                    '<span itemprop="name">' + parentCategoryNames[parentCategory] + '</span>' +
                    '</a>' +
                    '<meta itemprop="position" content="2">';

                // placeholderの前に親カテゴリーを挿入
                placeholder.parentNode.insertBefore(parentLi, placeholder);

                if (isCategoryPage) {
                    // カテゴリーページでは現在のページは表示しない
                    placeholder.remove();
                } else {
                    // 投稿ページでは子タグのリンクを表示（記事タイトルは表示しない）
                    placeholder.innerHTML =
                        '<a href="/category/' + parentCategory + '/' + tagSlug + '/" itemprop="item">' +
                        '<span itemprop="name">' + tagName + '</span>' +
                        '</a>' +
                        '<meta itemprop="position" content="3">';
                    placeholder.setAttribute('itemprop', 'itemListElement');
                    placeholder.setAttribute('itemscope', '');
                    placeholder.setAttribute('itemtype', 'http://schema.org/ListItem');
                    placeholder.classList.add('breadcrumb-processed');
                }
            }
        }
    }

    /**
     * 初期化
     */
    function init() {
        // カテゴリーページかどうかを判定してbodyクラスを追加
        if (window.location.pathname.indexOf('/category/') === 0) {
            document.body.classList.add('category-page');
        }

        processPostCardMagazineTags();
        processPostDetailMagazineTag();
        processBreadcrumb();
    }

    // DOMの準備ができるまで待機
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 関数をグローバルに公開（他のスクリプトから呼び出せるようにする）
    window.MagazineTag = {
        processPostCardMagazineTags: processPostCardMagazineTags,
        processPostDetailMagazineTag: processPostDetailMagazineTag,
        processBreadcrumb: processBreadcrumb
    };
})();
