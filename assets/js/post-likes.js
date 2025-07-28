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
     * いいね一覧でのいいねボタンを初期化
     * @param {HTMLElement} container - カードを含むコンテナ
     */
    async function initializeLikeButtonsInList(container) {
        const buttons = container.querySelectorAll('.gh-post-like-button');
        const memberEmail = window.currentMember.email;
        const memberInfo = await getMemberByEmail(memberEmail);
        const memberId = memberInfo?.id;

        buttons.forEach(button => {
            button.setAttribute('data-member-id', memberId || '');
            button.addEventListener('click', handleUnlikeInList);
        });
    }

    /**
     * いいね一覧でのいいね解除処理
     * @param {Event} event - クリックイベント
     */
    async function handleUnlikeInList(event) {
        const button = event.currentTarget;
        const postId = button.getAttribute('data-post-id');
        const memberId = button.getAttribute('data-member-id');
        const contentApiKey = window.ghostConfig.contentApiKey;

        if (!memberId) {
            return;
        }

        try {
            await removePostLike(postId, memberId, contentApiKey);

            // カードを取得して削除
            const card = button.closest('.card');
            await fadeOutAndRemove(card);

            // 状態更新
            removePostFromAllPosts(postId);
            updateEmptyState();
            updateLoadMoreButton();

        } catch (error) {
            console.error('いいね解除に失敗しました:', error);
        }
    }

    /**
     * アニメーション付きでカードを削除
     * @param {HTMLElement} element - 削除する要素
     * @returns {Promise} アニメーション完了のPromise
     */
    function fadeOutAndRemove(element) {
        return new Promise(resolve => {
            element.style.transition = 'opacity 0.3s ease';
            element.style.opacity = '0';
            setTimeout(() => {
                element.remove();
                resolve();
            }, 300);
        });
    }

    /**
     * allPosts配列から指定記事を削除
     * @param {string} postId - 削除する記事ID
     */
    function removePostFromAllPosts(postId) {
        allPosts = allPosts.filter(post => post.id !== postId);
    }

    /**
     * 空状態の確認と表示更新
     */
    function updateEmptyState() {
        const headingElement = document.querySelector('h1.post-likes-heading');
        const container = document.getElementById('liked-posts');

        if (allPosts.length === 0) {
            if (headingElement) {
                headingElement.textContent = 'まだお気に入りがありません。';
            }

            if (container) {
                container.innerHTML = '';
            }
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

        displayArticleCards(posts, `#${sectionId}`, {
            isShowLikeButton: true,
            isLiked: true
        });

        // いいねボタンの初期化
        initializeLikeButtonsInList(container);
    }

    // DOMContentLoaded後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
