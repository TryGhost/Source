(function () {
    'use strict';

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
        // Content API Keyを取得
        const contentApiKey = document.querySelector('main.post-likes-main')?.getAttribute('data-content-api-key');
        if (!contentApiKey) {
            return;
        }

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

        displayCards(likedPosts, 'liked-posts');
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

        container.innerHTML = '';

        posts.forEach(post => {
            const cardHtml = createPostCard(post);
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
