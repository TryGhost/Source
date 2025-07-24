/**
 * Post Magazine Label Management
 * 投稿の雑誌ラベルにgroupのlogo_imageを設定する
 */

/**
 * Content APIから投稿データを取得する
 * @param {string} postId - 投稿ID
 * @param {string} contentApiKey - Content API キー
 * @returns {Promise<Object>} 投稿データ
 */
const getPostWithGroup = async (postId, contentApiKey) => {
    try {
        const response = await fetch(`/ghost/api/content/posts/${postId}/?key=${contentApiKey}&include=group`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.posts || data.posts.length === 0) {
            throw new Error('投稿が見つかりません');
        }
        return data.posts[0];
    } catch (error) {
        throw error;
    }
};

/**
 * 雑誌ラベルのlogo_imageを更新する
 * @param {string} postId - 投稿ID
 * @param {string} contentApiKey - Content API キー
 */
const updateMagazineLabel = async (postId, contentApiKey) => {
    try {
        // 投稿データを取得
        const post = await getPostWithGroup(postId, contentApiKey);

        const postHeroElement = document.querySelector('.post-hero');
        if (!postHeroElement) {
            return;
        }

        if (post.group && post.group.logo_image) {
            const labelLinkElement = document.createElement('a');
            labelLinkElement.className = 'post-magazine-label';
            labelLinkElement.style.backgroundImage = `url(${post.group.logo_image})`;
            labelLinkElement.href = `/magazine?group=${post.group.slug}`;

            postHeroElement.appendChild(labelLinkElement);

            // post-magazine-logoのlogo_imageも設定
            const postLogoImg = document.querySelector('.post-magazine-logo img');
            if (postLogoImg) {
                postLogoImg.src = post.group.logo_image;
                postLogoImg.alt = post.group.name;
                postLogoImg.style.display = 'block';
            }

            return;
        }

        // groupまたはlogo_imageが存在しない場合は非表示
        magazineLabel.style.display = 'none';

        const postLogoImg = document.querySelector('.post-magazine-logo img');
        if (postLogoImg) {
            postLogoImg.style.display = 'none';
        }
    } catch (error) {
        // エラー時は雑誌ラベルとロゴを非表示にする
        const magazineLabel = document.querySelector('.post-magazine-label');
        if (magazineLabel) {
            magazineLabel.style.display = 'none';
        }

        const postLogoImg = document.querySelector('.post-magazine-logo img');
        if (postLogoImg) {
            postLogoImg.style.display = 'none';
        }
    }
};

/**
 * DOMContentLoadedイベントで自動実行
 */
document.addEventListener('DOMContentLoaded', () => {
    // 投稿ページでのみ実行
    const postMainElement = document.querySelector('.post-main');
    if (!postMainElement) {
        return;
    }

    // data属性からpost_idとcontent_api_keyを取得
    const postElement = document.querySelector('[data-post-id]');

    if (!postElement) {
        return;
    }

    const postId = postElement.getAttribute('data-post-id');
    const contentApiKey = window.ghostConfig.contentApiKey;

    if (!postId || !contentApiKey) {
        return;
    }

    // 雑誌ラベルを更新
    updateMagazineLabel(postId, contentApiKey);
});
