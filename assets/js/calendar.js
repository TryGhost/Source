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

    // DOMの準備ができるまで待機
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', filterCalendarPages);
    } else {
        filterCalendarPages();
    }
})();
