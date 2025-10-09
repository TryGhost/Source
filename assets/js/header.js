/**
 * ヘッダー機能
 * デスクトップのみでヘッダーアニメーションと動作を処理
 */

/* global window, document */

(function () {
    'use strict';

    // ブレークポイント定数
    const MOBILE_BREAKPOINT = 768;

    // モバイルかチェック (768px以下)
    function isMobile() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    // ヘッダースライドアニメーション
    function initHeaderAnimation() {
        // デスクトップのみで実行
        if (isMobile()) {
            return;
        }

        const header = document.querySelector('.header');
        if (!header) {
            return;
        }

        // 短い遅延後にアニメーションをトリガー
        setTimeout(function () {
            header.classList.add('header-loaded');
        }, 300);
    }

    // DOMの準備ができたら初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeaderAnimation);
    } else {
        initHeaderAnimation();
    }

    // リサイズ時に再チェック
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            const header = document.querySelector('.header');
            if (header && !isMobile()) {
                // リサイズ後にデスクトップでヘッダーが表示されることを確認
                header.classList.add('header-loaded');
            }
        }, 250);
    });
})();
