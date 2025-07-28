(function() {
    'use strict';

    const POSTS_PER_PAGE = 3;

    // DOMContentLoaded後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    async function initialize() {
        // 投稿ページ以外では実行しない
        const isPostPage = Boolean(document.querySelector('.post-main'));
        if (!isPostPage) {
            return;
        }

        const mainElement = document.querySelector('.post-main');
        const tag = mainElement?.getAttribute('data-filter-tag');
        const currentPostId = mainElement?.getAttribute('data-post-id');
        if (!tag || !currentPostId) {
            return;
        }


        const cardContainerSelector = '.articles-section-card';
        const {handleLoadMoreButton} = useFetchPosts(cardContainerSelector, {
            include: 'tags,group',
            filter: `primary_tag:${tag}+id:-${currentPostId}`,
            page: 1,
            limit: POSTS_PER_PAGE,
            order: 'published_at DESC'
        }, 'featured');

        handleLoadMoreButton();

        // 有料会員のみページビューを記録
        if (window.currentMember?.paid) {
            await recordPageView(currentPostId);
        }
    }
})();
