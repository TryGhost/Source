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
                    url: '/' + parentCategory + '/' + slug + '/'
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

        try {
            const tags = JSON.parse(tagsData);
            const magazineTag = findMagazineTag(tags);

            if (magazineTag) {
                categoryElement.innerHTML = '<div>' +
                    '<p class="footer-meta_title">CATEGORY :</p>' +
                    '<ul class="post-categories">' +
                    '<li><a href="' + magazineTag.url + '" rel="category tag">' +
                    magazineTag.name + '</a></li>' +
                    '</ul>' +
                    '</div>';

                // TAGSセクションから雑誌タグを削除
                removeMagazineTagFromTagsList(magazineTag.slug);
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
     * 初期化
     */
    function init() {
        processPostCardMagazineTags();
        processPostDetailMagazineTag();
    }

    // DOMの準備ができるまで待機
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
