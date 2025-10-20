/**
 * タグクラウド - 投稿数に応じたフォントサイズ調整
 */
(function() {
    'use strict';

    // カテゴリータグ（雑誌タグなど）のリスト - magazines.hbsと同じ
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

    function initTagCloud() {
        const tagCloud = document.getElementById('drawer-tag-cloud');

        if (!tagCloud) {
            return;
        }

        const allTags = tagCloud.querySelectorAll('.tag-cloud-link[data-count]');

        // カテゴリータグを除外して、最大12個のタグのみ表示
        let displayedCount = 0;
        const tags = [];

        allTags.forEach(function(tag) {
            const slug = tag.getAttribute('data-slug');

            // Check if this is a category tag
            if (MAGAZINE_TAG_SLUGS.indexOf(slug) !== -1) {
                // Hide category tags
                tag.style.display = 'none';
            } else if (displayedCount < 12) {
                // Keep non-category tags (up to 12)
                tags.push(tag);
                displayedCount++;
            } else {
                // Hide excess non-category tags beyond 12
                tag.style.display = 'none';
            }
        });

        if (tags.length === 0) {
            return;
        }

        // 最小・最大の投稿数を取得
        let minCount = Infinity;
        let maxCount = 0;

        tags.forEach(function(tag) {
            const count = parseInt(tag.getAttribute('data-count'), 10);
            if (count < minCount) minCount = count;
            if (count > maxCount) maxCount = count;
        });

        // フォントサイズの範囲を設定（pt単位）
        const minFontSize = 8;   // 最小フォントサイズ（1投稿）
        const maxFontSize = 22;  // 最大フォントサイズ（728投稿）

        // 各タグのフォントサイズを計算して適用
        tags.forEach(function(tag) {
            const count = parseInt(tag.getAttribute('data-count'), 10);
            let fontSize;

            if (maxCount === minCount) {
                // すべてのタグの投稿数が同じ場合は中間のサイズ
                fontSize = (minFontSize + maxFontSize) / 2;
            } else {
                // 線形スケールで計算
                const ratio = (count - minCount) / (maxCount - minCount);
                fontSize = minFontSize + (maxFontSize - minFontSize) * ratio;
            }

            // フォントサイズを適用
            tag.style.fontSize = fontSize + 'pt';
        });
    }

    // DOMの準備ができるまで待機
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTagCloud);
    } else {
        initTagCloud();
    }
})();
