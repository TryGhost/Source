(function () {
    'use strict';

    const POSTS_PER_PAGE = 15;
    let allPosts = [];
    let currentPage = 0;

    async function fetchLikedPosts(key, memberId) {
        try {
            const response = await fetch(
                `/ghost/api/content/liked-posts/?key=${key}&memberId=${memberId}`
            );

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data.liked_posts[0] ?? [];
        } catch (error) {
            return null;
        }

    }

    async function initialize() {
        const contentApiKey = window.ghostConfig.contentApiKey;
        const memberEmail = window.currentMember.email;
        const memberInfo = await getMemberByEmail(memberEmail, contentApiKey);
        const memberId = memberInfo?.id;
        if (!memberId) {
            return;
        }

        const likedPosts = await fetchLikedPosts(contentApiKey, memberId);
        const headingElement = document.querySelector('h1.post-likes-heading')

        if (likedPosts.length === 0) {
            if (headingElement) {
                headingElement.textContent = 'まだお気に入りがありません。';
            }

            return;
        }

        if (headingElement) {
            headingElement.textContent = 'あなたのお気に入り記事一覧';
        }

        allPosts = likedPosts;
        currentPage = 0;
        displayInitialPosts();

        // イベントハンドラを追加
        handleLoadMoreButton()
    }

    /**
     * 初期の投稿表示
     */
    function displayInitialPosts() {
        const container = document.getElementById('liked-posts');
        if (!container) {
            return;
        }

        container.innerHTML = '';

        const postsToShow = allPosts.slice(0, POSTS_PER_PAGE);
        displayCards(postsToShow, 'liked-posts');

        currentPage = 1;
        updateLoadMoreButton();
    }

    /**
     * 「もっと見る」ボタンのクリックイベントを処理
     */
    function handleLoadMoreButton() {
        const loadMoreButton = document.getElementById('load-more-posts');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', loadMorePosts);
        }
    }

    /**
     * 「もっと見る」ボタンの表示・非表示を更新
     */
    function updateLoadMoreButton() {
        const loadMoreContainer = document.getElementById('post-likes-load-more');
        if (!loadMoreContainer) {
            return;
        }

        const hasMorePosts = (currentPage * POSTS_PER_PAGE) < allPosts.length;
        loadMoreContainer.style.display = hasMorePosts ? 'block' : 'none';
    }

    /**
     * 追加の投稿を読み込む
     */
    function loadMorePosts() {
        const startIndex = currentPage * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const additionalPosts = allPosts.slice(startIndex, endIndex);

        if (additionalPosts.length > 0) {
            displayCards(additionalPosts, 'liked-posts')

            currentPage++;
            updateLoadMoreButton();
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
            const cardHtml = createPostCard(post, true);
            container.insertAdjacentHTML('beforeend', cardHtml);
        });
    }

    // DOMContentLoaded後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
