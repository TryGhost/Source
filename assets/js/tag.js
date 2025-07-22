(function () {
    'use strict';

    // タグページでのみ実行
    if (!window.location.pathname.startsWith('/tag/')) {
        return;
    }

    const POSTS_PER_PAGE = 15;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    /**
     * 初期化処理
     */
    function initialize() {
        const selector = document.querySelector('section.tag-hero');
        const tagSlug = selector?.getAttribute('data-tag-slug');

        if (!tagSlug) {
            return;
        }

        const cardContainerSelector = '#tag-posts';
        const {handleLoadMoreButton} = useFetchPosts(cardContainerSelector, {
            include: 'tags,group',
            filter: `tag:${tagSlug}`,
            page: 1,
            limit: POSTS_PER_PAGE
        });
        handleLoadMoreButton();
    }
})();

