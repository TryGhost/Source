/**
 * 雑誌タグ処理
 * magazines.hbsに定義されている雑誌タグを記事カードと記事詳細ページで表示
 */
/* eslint-env browser */
(function () {
    'use strict';

    // magazines.hbsに定義されているすべての雑誌タグのslug
    const MAGAZINE_TAG_SLUGS = [
        // ブランドムック
        'brandmook',

        // 女性ファッション雑誌
        '25ans-hearstfujingaho', 'androsy-takarajimasha', 'baila-shueisha', 'bestory-kobunsha',
        'bijinhyakka-kadokawaharuki', 'biteki-shogakukan', 'cancam-shogakukan', 'domani-shogakukan',
        'eclat-shueisha', 'elledecor-hearstfujingaho', 'ellejapon-hearstfujingaho', 'fudge-saneishobo',
        'fujingaho-hearstfujingaho', 'gina-bunkasha', 'ginger-gentosha', 'glow-takarajimasha',
        'harpersbazaar-hearstfujingaho', 'inred-takarajimasha', 'jelly-bunkasha', 'jj-kobunsha',
        'jsgirl-saneishobo', 'kimonoanne-tacshuppan', 'kirapichi-gakken', 'kunel-magazinehouse',
        'lafarfa-bunkasha', 'larme-tokumashoten', 'lee-shueisha', 'liniere-takarajimasha',
        'loveggg-mediaboy', 'maquia-shueisha', 'marisol-shueisha', 'mini-takarajimasha',
        'more-shueisha', 'nicola-shinchosha', 'nicopuchi-shinchosha', 'nonno-shueisha',
        'numerotokyo-fusosha', 'oggi-shogakukan', 'osharetecho-takarajimasha', 'otonamuse-takarajimasha',
        'popteen-kadokawaharuki', 'richesse-hearstfujingaho', 'seventeen-shueisha', 'spring-takarajimasha',
        'spur-shueisha', 'steady-takarajimasha', 'sutekinaanohito-takarajimasha', 'sweet-takarajimasha',
        'utsukushiikimono-hearstfujingaho', 'vivi-kodansha', 'voce-kodansha', 'waraku-shogakukan',
        'with-kodansha', 'yogini-peacs',

        // 少女・女性マンガの付録
        'ciao-shogakukan', 'nakayosi-kodansha', 'ribon-shueisha', 'shocomi-shogakukan',

        // 子供・児童学習 雑誌
        'babybook-shogakukan', 'fukufuku-fukuinkan', 'genki-kodansha', 'inaiinai-kodansha',
        'mebae-shogakukan', 'nene-shufu', 'okaitsu-kodansha', 'otomodachi-kodansha',
        'pucchigumi-shogakukan', 'sho1-shogakukan', 'sho8-shogakukan', 'tanoyo-kodansha',
        'telemaga-kodansha', 'televikun-shogakukan', 'youchien-shogakukan',

        // ママ・主婦雑誌
        '39mag-benesse', 'akahoshi-shufunotomo', 'babymo-shufunotomo', 'cookpadplus-7andi',
        'croissant-magazinehouse', 'ellegourmet-hearstfujingaho', 'esse-fusosha', 'hiyokoclub-benesse',
        'hugmug-sekaibunkasha', 'kodomoe-hakusensha', 'lettuceclub-kadokawa', 'moe-hakusensha',
        'orangepage', 'premo-shufunotomo', 'sutekinaokusan-shufutoseikatsusha',

        // 結婚情報誌
        'ellemariage-hearstfujingaho', 'zexy-recruit',

        // メンズファッション雑誌
        'dime-shogakukan', 'getnavi-gakkenplus', 'lightning-eipublishing', 'mensclub-hearstfujingaho',
        'mensnonno-shueisha', 'monomaster-takarajimasha', 'monomax-takarajimasha', 'smart-takarajimasha',
        'uomo-shueisha',

        // アウトドア雑誌
        'bepal-shogakukan', 'bicycleclub-eipublishing', 'camplife-yamakei', 'cyclesports-yaesu',
        'fielder-kasakura', 'peaks-eipublishing', 'randonnee-eipublishing', 'wandervogel-yamakei',

        // その他雑誌
        'modernliving-hearstfujingaho', 'nikkeiwoman-nikkeibp', 'serai-shogakukan', 'tabinotecho-kotsushinbun',
        'tokyowalker-kadokawa',

        // エンタメ
        'campaign', 'furoku-favorite', 'furoku-ranking', 'furoku-sufficiency', 'other', 'recommended',
        'subscription-tokuten'
    ];

    /**
     * タグリストから最初の雑誌タグを見つける
     * @param {Array} tags - タグ情報の配列 [{slug: '', name: '', url: ''}, ...]
     * @returns {Object|null} - 雑誌タグオブジェクトまたはnull
     */
    function findMagazineTag(tags) {
        if (!tags || tags.length === 0) {
            return null;
        }

        for (let i = 0; i < tags.length; i++) {
            if (MAGAZINE_TAG_SLUGS.indexOf(tags[i].slug) !== -1) {
                return tags[i];
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
