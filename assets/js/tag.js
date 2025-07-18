(function () {
    'use strict';

    const selector = document.querySelector('section.tag-hero');
    const tagSlug = selector?.getAttribute('data-tag-slug');

    if (!tagSlug) {
        return;
    }

    const POSTS_PER_PAGE = 15;
    let currentOffset = 15; // 初期表示で15件表示済み
    let hasMorePosts = true;

    /**
     * タグの投稿を取得
     * @param {number} limit - 取得件数
     * @param {number} page - ページ番号
     * @returns {Promise<Array>} 投稿の配列
     */
    async function fetchTagPosts(limit, page) {
        try {
            const contentApiKey = window.ghostConfig.contentApiKey;
            const response = await fetch(
                `/ghost/api/content/posts/?key=${contentApiKey}&filter=tag:${tagSlug}&offset=${currentOffset}&limit=${limit}&page=${page}&include=tags,authors`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            return data.posts || [];
        } catch (error) {
            return [];
        }
    }

    /**
     * 投稿カードを表示
     * @param {Array} posts - 投稿一覧
     * @param {string} sectionId - 表示するセクションのid要素
     */
    function displayCards(posts, sectionId) {
        const container = document.getElementById(sectionId);
        if (!container) {
            return;
        }

        posts.forEach(post => {
            const cardHtml = createPostCard(post);
            container.insertAdjacentHTML('beforeend', cardHtml);
        });
    }

    /**
     * 追加の投稿を読み込む
     */
    async function loadMorePosts() {
        if (!hasMorePosts) {
            return;
        }

        // ページ番号を計算（offset / limit + 1）
        const page = Math.floor(currentOffset / POSTS_PER_PAGE) + 1;
        const additionalPosts = await fetchTagPosts(POSTS_PER_PAGE, page);

        if (additionalPosts.length > 0) {
            displayCards(additionalPosts, 'tag-posts')

            currentOffset += additionalPosts.length;

            // 取得した投稿数が要求数より少ない場合は、これ以上投稿がない
            if (additionalPosts.length < POSTS_PER_PAGE) {
                hasMorePosts = false;
            }
        } else {
            hasMorePosts = false;
        }

        const loadMoreButton = document.getElementById('load-more-posts');
        // ボタンの状態を更新
        if (loadMoreButton && !hasMorePosts) {
            loadMoreButton.style.display = 'none';
        }

    }

    /**
     * 初期化処理
     */
    function initialize() {
        const loadMoreButton = document.getElementById('load-more-posts');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', loadMorePosts);
        }
    }

    // DOMContentLoaded後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

