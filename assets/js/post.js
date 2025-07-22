(function() {
    'use strict';

    const POSTS_PER_PAGE = 3;
    // 追加は2ページ目から
    let page = 2;

    // DOMContentLoaded後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    function initialize() {
        // 投稿ページ以外では実行しない
        const isPostPage = Boolean(document.querySelector('.post-main'));
        if (!isPostPage) {
            return;
        }

        const loadMoreButton = document.querySelector('.articles-section-action button');
        if (!loadMoreButton) {
            return;
        }

        loadMoreButton.addEventListener('click', handleLoadMoreButtonClick);
    }

    async function handleLoadMoreButtonClick() {
        const mainElement = document.querySelector('.post-main');
        const tag = mainElement?.getAttribute('data-filter-tag');
        const currentPostId = mainElement?.getAttribute('data-post-id');
        const key = window.ghostConfig.contentApiKey;
        if (!tag || !key || !currentPostId) {
            return;
        }

        const [additionalPosts, hasNext] = await fetchPostsByTag(key, tag, currentPostId);
        if (additionalPosts.length > 0) {
            displayCards(additionalPosts, '.articles-section-card');
        }

        if (hasNext) {
            page++;
        } else {
            const loadMoreButton = document.querySelector('.articles-section-action button');
            if (loadMoreButton) {
                loadMoreButton.style.display = 'none';
            }
        }
    }

    async function fetchPostsByTag(key, tag, currentPostId) {
        const params = new URLSearchParams({
            key,
            include: 'tags,group',
            filter: `primary_tag:${tag}+id:-${currentPostId}`,
            page,
            limit: POSTS_PER_PAGE,
            order: 'published_at DESC'
        });

        try {
            const response = await fetch(
                `/ghost/api/content/posts/?${params.toString()}`
            );

            if (!response.ok) {
                return [[], false];
            }

            const data = await response.json();
            return [data.posts ?? [], data.meta.pagination.next !== null];
        } catch (error) {
            return [[], false];
        }
    }

    /**
     * 投稿カードを表示
     * @param {Array} posts - 投稿一覧
     * @param {string} selector - セクションのセレクタ
     */
    function displayCards(posts, selector) {
        const container = document.querySelector(selector);
        if (!container) {
            return;
        }

        posts.forEach(post => {
            const cardHtml = createPostCard(post);
            container.insertAdjacentHTML('beforeend', cardHtml);
        });
    }
})();
