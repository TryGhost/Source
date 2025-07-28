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

        const contentApiKey = window.ghostConfig.contentApiKey;

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
     * @param {string} order - ソート条件
     * @returns {Promise<Array>} 投稿一覧
     */
    async function fetchPosts(key, filter, order, limit = 3) {
        const params = new URLSearchParams({
            key,
            filter,
            include: 'tags,group',
            order,
            limit
        });

        try {
            const response = await fetch(
                `/ghost/api/content/posts/?${params.toString()}`
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
        const [newPostsResult, featuredPostsResult, rankingPostsResult] = await Promise.allSettled([
            fetchPosts(contentApiKey, `group_id:${group.id}`, 'published_at DESC'),
            fetchPosts(contentApiKey, `group_id:${group.id}+tag:pickup`, 'updated_at DESC'),
            fetchPosts(contentApiKey, `group_id:${group.id}`, 'page_view_count DESC', 15)
        ]);

        // 新着投稿の表示
        if (newPostsResult.status === 'fulfilled') {
            displayArticleCards(newPostsResult.value, '#magazine-new', { section_type: 'new' });

            const linkElement = document.querySelector('#magazine-new+div a');
            if (linkElement) {
                linkElement.href = `/search-results?groups=${group.id}`;
            }
        }

        // 特集投稿の表示
        if (featuredPostsResult.status === 'fulfilled') {
            displayArticleCards(featuredPostsResult.value, '#magazine-featured');

            const linkElement = document.querySelector('#magazine-featured+div a');
            if (linkElement) {
                linkElement.href = `/search-results?groups=${group.id}&tags=pickup`;
            }
        }

        // ランキング投稿の表示
        if (featuredPostsResult.status === 'fulfilled') {
            displayArticleCards(rankingPostsResult.value, '#magazine-ranking');

            const linkElement = document.querySelector('#magazine-ranking+div a');
            if (linkElement) {
                linkElement.href = `/search-results?groups=${group.id}&order=popular`;
            }
        }
    }

    // DOMContentLoaded後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

