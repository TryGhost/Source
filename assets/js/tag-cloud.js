/**
 * タグクラウド - 投稿数に応じたフォントサイズ調整
 */
(function() {
    'use strict';

    function initTagCloud() {
        const tagCloud = document.getElementById('drawer-tag-cloud');

        if (!tagCloud) {
            return;
        }

        const tags = tagCloud.querySelectorAll('.tag-cloud-link[data-count]');

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
