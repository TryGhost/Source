// 雑誌ページのグループ情報取得機能
(function () {
    'use strict';

    /**
     * URLからクエリパラメータを取得
     * @param {string} name - パラメータ名
     * @returns {string|null} パラメータ値
     */
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * グループ情報を取得
     * @param {string} slug - グループのslug
     * @param {string} key - Content API Key
     * @returns {Promise<Object|null>} グループ情報
     */
    async function fetchGroupBySlug(slug, key) {
        try {
            const response = await fetch(
                `/ghost/api/content/groups/?key=${key}&filter=slug:${slug}`
            );

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data.groups && data.groups[0] ? data.groups[0] : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * ページを初期化
     */
    async function initialize() {
        // URLからgroup slugを取得
        const groupSlug = getQueryParam('group');
        if (!groupSlug) {
            return;
        }

        // Content API Keyを取得
        const contentApiKey = document.querySelector('section.magazine-section')?.getAttribute('data-content-api-key');
        if (!contentApiKey) {
            return;
        }

        // グループ情報を取得
        const group = await fetchGroupBySlug(groupSlug, contentApiKey);
        if (!group) {
            return;
        }

        // グループ情報をページに反映
        updatePageWithGroupData(group, contentApiKey);
    }

    /**
     * グループIDで投稿一覧を取得
     * @param {string} key - Content API Key
     * @param {string} filter - 絞り込み条件
     * @returns {Promise<Array>} 投稿一覧
     */
    async function fetchPosts(key, filter) {
        try {
            const response = await fetch(
                `/ghost/api/content/posts/?key=${key}&filter=${filter}&order=published_at%20desc&include=tags,group&limit=3`
            );

            if (!response.ok) {
                return [];
            }

            const data = await response.json();
            return data.posts || [];
        } catch (error) {
            return [];
        }
    }

    /**
     * グループ情報でページを更新
     * @param {Object} group - グループ情報
     * @param {string} contentApiKey - Content API Key
     */
    async function updatePageWithGroupData(group, contentApiKey) {
        const nameElement = document.querySelector('h1.magazine-name');
        if (nameElement) {
            nameElement.textContent = group.name || '';
        }

        const descriptionElement = document.querySelector('p.magazine-description');
        if (descriptionElement) {
            if (group.description) {
                descriptionElement.textContent = group.description;
                descriptionElement.style.display = 'block';
            } else {
                descriptionElement.style.display = 'none';
            }
        }

        // サイトURL の更新
        const siteUrlElement = document.querySelector('a.magazine-url');
        if (siteUrlElement) {
            if (group.site_url) {
                siteUrlElement.textContent = group.site_url || '';
                siteUrlElement.href = group.site_url || '';
                siteUrlElement.target = '_blank';
            } else {
                siteUrlElement.style.display = 'none';
            }
        }

        // 背景画像の更新
        const coverImageElement = document.querySelector('div.magazine-cover-image');
        if (coverImageElement && group.cover_image) {
            coverImageElement.style.backgroundImage = `url(${group.cover_image})`;
        }

        // ロゴ画像の更新
        const logoImageElement = document.querySelector('img.magazine-logo-image');
        if (logoImageElement) {
            if (group.logo_image) {
                logoImageElement.src = group.logo_image;
            } else {
                logoImageElement.style.display = 'none';
            }
        }

        // 記事の取得と表示
        const [newPostsResult, featuredPostsResult] = await Promise.allSettled([
            fetchPosts(contentApiKey, `group_id:${group.id}`),
            fetchPosts(contentApiKey, `group_id:${group.id}%2Btag:pickup`)
        ]);

        // 新着投稿の表示
        if (newPostsResult.status === 'fulfilled') {
            displayCards(newPostsResult.value, 'magazine-new');
        }

        // 特集投稿の表示
        if (featuredPostsResult.status === 'fulfilled') {
            displayCards(featuredPostsResult.value, 'magazine-featured');
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

