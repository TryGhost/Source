/* Mobile menu burger toggle */
(function () {
    const navigation = document.querySelector('.gh-navigation');
    const burger = navigation.querySelector('.gh-burger');
    if (!burger) return;

    burger.addEventListener('click', function () {
        if (!navigation.classList.contains('is-open')) {
            navigation.classList.add('is-open');
            document.documentElement.style.overflowY = 'hidden';
        } else {
            navigation.classList.remove('is-open');
            document.documentElement.style.overflowY = null;
        }
    });
})();

/* Add lightbox to gallery images */
(function () {
    lightbox(
        '.kg-image-card > .kg-image[width][height], .kg-gallery-image > img'
    );
})();

/* Responsive video in post content */
(function () {
    const sources = [
        '.gh-content iframe[src*="youtube.com"]',
        '.gh-content iframe[src*="youtube-nocookie.com"]',
        '.gh-content iframe[src*="player.vimeo.com"]',
        '.gh-content iframe[src*="kickstarter.com"][src*="video.html"]',
        '.gh-content object',
        '.gh-content embed',
    ];
    reframe(document.querySelectorAll(sources.join(',')));
})();

/* Turn the main nav into dropdown menu when there are more than 5 menu items */
(function () {
    dropdown();
})();

/* Infinite scroll pagination */
(function () {
    if (!document.body.classList.contains('home-template') && !document.body.classList.contains('post-template')) {
        pagination();
    }
})();

/* Responsive HTML table */
(function () {
    const tables = document.querySelectorAll('.gh-content > table:not(.gist table)');

    tables.forEach(function (table) {
        const wrapper = document.createElement('div');
        wrapper.className = 'gh-table';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
})();

/* Show NEW badge for posts published within last 7 days */
(function () {
    const badges = document.querySelectorAll('.new-badge');
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    badges.forEach(function (badge) {
        const publishedDate = new Date(badge.getAttribute('data-published'));
        if (publishedDate >= sevenDaysAgo) {
            badge.style.display = 'inline';
        }
    });
})();

/* Show updated date only if different from published date */
(function () {
    const updatedTime = document.querySelector('.entry-header .updated');
    if (!updatedTime) return;

    const publishedDate = updatedTime.getAttribute('data-published');
    const updatedDate = updatedTime.getAttribute('data-updated');

    if (publishedDate !== updatedDate) {
        updatedTime.classList.add('show');
    }
})();

/* Set background image from data attribute */
(function () {
    const bgImageElement = document.querySelector('.fab__contents_img[data-bg-image]');
    if (!bgImageElement) return;

    const imageUrl = bgImageElement.getAttribute('data-bg-image');
    if (imageUrl) {
        bgImageElement.style.backgroundImage = `url(${imageUrl})`;
    }
})();