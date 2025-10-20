/**
 * ページトップへ戻るボタン
 */
(function() {
    'use strict';

    function init() {
        const pageTopBtn = document.querySelector('.page-top-btn');

        if (!pageTopBtn) {
            return;
        }

        pageTopBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // スムーススクロールでページトップへ
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // DOMの準備ができるまで待機
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
