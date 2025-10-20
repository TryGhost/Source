/**
 * Calendar page - Filter calendar detail pages
 */
(function() {
    'use strict';

    function filterCalendarPages() {
        const items = document.querySelectorAll('.calendar-item');

        if (items.length === 0) {
            return;
        }

        items.forEach(function(item) {
            const slug = item.getAttribute('data-slug');
            // slug が "calendar" で始まり、その後に6桁の数字が続くかチェック
            if (!slug || !slug.match(/^calendar\d{6}$/)) {
                item.style.display = 'none';
            }
        });
    }

    function updateTodayButton() {
        const todayButton = document.querySelector('.btn-simple');

        if (!todayButton) {
            return;
        }

        // 今日の日付を取得
        const today = new Date();
        const month = String(today.getMonth() + 1); // 月は0始まりなので+1
        const day = String(today.getDate());

        // mm_dd形式で作成
        const dateHash = month + '_' + day;

        // hrefを更新
        todayButton.href = '#' + dateHash;
    }

    function init() {
        filterCalendarPages();
        updateTodayButton();
    }

    // DOMの準備ができるまで待機
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
