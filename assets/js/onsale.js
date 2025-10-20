/**
 * Onsale page - Filter onsale detail pages
 */
(function() {
    'use strict';

    function filterOnsalePages() {
        // onsaleページにいるかチェック
        if (window.location.pathname !== '/onsale/') {
            return;
        }

        // 最新3件セクション
        const recentItems = document.querySelectorAll('.onsale-recent');
        let recentCount = 0;

        recentItems.forEach(function(item) {
            const slug = item.getAttribute('data-slug');
            // onsaleYYYYMMフォーマットかチェック
            if (slug && slug.match(/^onsale\d{6}$/)) {
                if (recentCount < 3) {
                    // 最初の3件を表示
                    recentCount++;
                } else {
                    // 4件目以降は非表示
                    item.style.display = 'none';
                }
            } else {
                // onsale以外は非表示
                item.style.display = 'none';
            }
        });

        // 残りの年月リストセクション
        const pastItems = document.querySelectorAll('.onsale-past');
        let pastCount = 0;

        pastItems.forEach(function(item) {
            const slug = item.getAttribute('data-slug');
            // onsaleYYYYMMフォーマットかチェック
            if (slug && slug.match(/^onsale\d{6}$/)) {
                if (pastCount < 3) {
                    // 最初の3件は非表示（上に表示済み）
                    item.style.display = 'none';
                    pastCount++;
                }
                // 4件目以降は表示
            } else {
                // onsale以外は非表示
                item.style.display = 'none';
            }
        });
    }

    function init() {
        filterOnsalePages();
    }

    // DOMの準備ができるまで待機
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
