/**
 * Calendar Detail Page - Display posts by release date
 */
(function() {
    'use strict';

    function parseExcerpt(excerpt) {
        if (!excerpt) return {};

        const data = {};
        const lines = excerpt.split('\n');

        lines.forEach(function(line) {
            const match = line.match(/^([^:]+):\s*(.+)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim();
                data[key] = value;
            }
        });

        return data;
    }

    function formatDate(dateStr) {
        // YYYY-MM-DD を M月D日 に変換
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const month = parseInt(parts[1], 10);
            const day = parseInt(parts[2], 10);
            return month + '月' + day + '日';
        }
        return dateStr;
    }

    function generateCalendarHTML(posts, targetYearMonth) {
        // 発売日でグループ化
        const groupedByDate = {};

        posts.forEach(function(post) {
            const excerptData = parseExcerpt(post.excerpt);
            const releaseDate = excerptData.release_date;

            if (!releaseDate) return;

            // YYYY-MM形式で年月をチェック
            if (releaseDate.startsWith(targetYearMonth)) {
                if (!groupedByDate[releaseDate]) {
                    groupedByDate[releaseDate] = [];
                }
                groupedByDate[releaseDate].push({
                    url: post.url,
                    title: post.title,
                    featureImage: post.feature_image,
                    furokuTitle: excerptData.furoku_title || '',
                    releaseDate: releaseDate
                });
            }
        });

        // 日付順にソート（降順）
        const sortedDates = Object.keys(groupedByDate).sort().reverse();

        let html = '';
        sortedDates.forEach(function(date) {
            const formattedDate = formatDate(date);
            const dateParts = date.split('-');
            const monthDay = dateParts[1] + '_' + dateParts[2];

            html += '<p class="bar-day" id="' + monthDay + '">' + formattedDate + '</p>';

            groupedByDate[date].forEach(function(post) {
                html += '<article class="calendar__article">';
                html += '  <div class="calendar__link">';
                html += '    <p class="calendar__img">';
                html += '      <a class="calendar__link-inline" href="' + post.url + '" style="display:block;">';

                if (post.featureImage) {
                    html += '        <img src="' + post.featureImage + '" alt="' + post.title + '" style="display:inline-block;">';
                } else {
                    html += '        <img src="/assets/images/no-image.png" alt="' + post.title + '" style="display:inline-block;">';
                }

                html += '      </a>';
                html += '    </p>';
                html += '    <a class="calendar__link-inline-info" href="' + post.url + '">';
                html += '      <div class="calendar__article-info">';
                html += '        <span class="calendar__article-info-title">' + post.title + '</span>';

                if (post.furokuTitle) {
                    html += '        <span class="calendar__article-info-appendix">' + post.furokuTitle + '</span>';
                }

                html += '      </div>';
                html += '    </a>';
                html += '  </div>';
                html += '</article>';
            });
        });

        return html;
    }

    function scrollToHash() {
        // URLにハッシュがあれば、その要素までスクロール
        if (window.location.hash) {
            let hash = window.location.hash.substring(1); // '#' を除去

            // "day_" プレフィックスを除去（例：day_01_25 → 01_25）
            if (hash.startsWith('day_')) {
                hash = hash.substring(4);
            }

            const targetElement = document.getElementById(hash);

            if (targetElement) {
                // 少し遅延させてから実行（DOMの準備を待つ）
                setTimeout(function() {
                    targetElement.scrollIntoView({behavior: 'smooth', block: 'start'});
                }, 300);
            }
        }
    }

    function initCalendarDetail() {
        const contentDiv = document.getElementById('calendar-detail-content');
        if (!contentDiv) return;

        const pageSlug = contentDiv.getAttribute('data-page-slug');
        if (!pageSlug) return;

        // slugから年月を抽出（例：calendar202401 → 2024-01）
        const match = pageSlug.match(/^calendar(\d{4})(\d{2})$/);
        if (!match) return;

        const year = match[1];
        const month = match[2];
        const targetYearMonth = year + '-' + month;

        // window.calendarPostsから記事データを取得
        const posts = window.calendarPosts || [];
        const html = generateCalendarHTML(posts, targetYearMonth);

        contentDiv.innerHTML = html;

        // HTMLを挿入した後、ハッシュがあればスクロール
        scrollToHash();
    }

    // DOMの準備ができるまで待機
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCalendarDetail);
    } else {
        initCalendarDetail();
    }
})();
