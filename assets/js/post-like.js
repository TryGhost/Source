/**
 * post_like.js
 *
 * - テーマ側のJSとしてロードすると、ページ読み込み時に
 *   すべての .gh-post-like-button の状態を取得し、いいね数と「いいね済みか」を反映
 * - ボタンクリックでPOST/DELETEしていいね数を更新
 *
 * GhostのContent APIエンドポイント (例: /ghost/api/content/posts/:postId/like?key=YOUR_API_KEY) を想定
 */

const getMemberByEmail = async (email, contentApiKey) => {
    if (!email) {
        return null;
    }

    const url = `/ghost/api/content/members/${encodeURIComponent(email)}?key=${contentApiKey}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });

    if (!res.ok) {
        // メール未登録などで404の場合はnull扱いにする
        return null;
    }

    const data = await res.json();

    const member = data.members[0];
    return member || null;
};

const getPostLike = async (postId, contentApiKey) => {
    const res = await fetch(`/ghost/api/content/posts/${postId}/like?key=${contentApiKey}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    if (!res.ok) {
        // eslint-disable-next-line ghost/ghost-custom/no-native-error
        throw new Error(`Like GET API failed: ${res.status}`);
    }

    const data = await res.json();
    return data;
};

const addPostLike = async (postId, memberId, contentApiKey) => {
    const res = await fetch(`/ghost/api/content/posts/${postId}/like?key=${contentApiKey}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            post_likes: [{
                member: {id: memberId}
            }]
        })
    });

    if (!res.ok) {
        // eslint-disable-next-line ghost/ghost-custom/no-native-error
        throw new Error(`Like POST API failed: ${res.status}`);
    }
    return;
};

const removePostLike = async (postId, memberId, contentApiKey) => {
    const res = await fetch(`/ghost/api/content/posts/${postId}/like?key=${contentApiKey}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            post_likes: [{member: {id: memberId}}]
        })
    });

    if (!res.ok) {
        // eslint-disable-next-line ghost/ghost-custom/no-native-error
        throw new Error(`Like DELETE API failed: ${res.status}`);
    }

    return;
};

// -----(UIを初期化する関数)----------------------------
/**
 * ページ読み込み時に呼び出し:
 * - GET していいね数と「いいね済みか」を反映
 */
async function initializeLikeButtonUI(button) {
    const postId = button.getAttribute('data-post-id');
    const memberEmail = button.getAttribute('data-member-email');
    const contentApiKey = button.getAttribute('data-content-api-key');
    let memberId = ''; // 未ログイン or 存在しない場合は空
    if (memberEmail) {
        const memberInfo = await getMemberByEmail(memberEmail, contentApiKey);
        if (memberInfo && memberInfo.id) {
            memberId = memberInfo.id;
        } else {
            console.warn('[post-like] No member found for email:', memberEmail);
        }
    }

    // ボタンにmemberIdをセット
    button.setAttribute('data-member-id', memberId);

    if (!postId) {
        console.warn('[post-like] No postId, cannot proceed');
        return;
    }

    try {
        // いいね情報を取得
        const responsePostLikes = await getPostLike(postId, contentApiKey);
        const postLikes = responsePostLikes.post_likes?.[0] || [];
        const likeCount = postLikes.length;

        // ログイン中のmemberIdが含まれているかを確認
        let isLiked = false;
        if (memberId) {
            isLiked = postLikes.some(likeObj => likeObj.member_id === memberId);
        }

        // data-liked属性を更新
        button.setAttribute('data-liked', String(isLiked));

        // カウントの表示
        const countSpan = button.closest('.gh-post-like-wrapper')?.querySelector('.gh-post-like-count');
        if (countSpan) {
            countSpan.textContent = String(likeCount);
        }

        // アイコン表示更新
        const icon = button.querySelector('.gh-post-like-icon');
        if (icon) {
            if (isLiked) {
                icon.classList.add('gh-post-like-icon--active');
            } else {
                icon.classList.remove('gh-post-like-icon--active');
            }
        }
    } catch (error) {
        console.error('[post-like] いいね情報の初期化に失敗しました:', error);
    }
}

// -----(クリック時の処理)----------------------------
/**
 * ボタンがクリックされたときに呼び出し:
 * - 「いいね済み」なら DELETE,
 * - 「未いいね」なら POST
 * - UIを更新
 */
async function handleLikeButtonClick(event) {
    const button = event.currentTarget;
    const postId = button.getAttribute('data-post-id');
    const memberId = button.getAttribute('data-member-id');
    const contentApiKey = button.getAttribute('data-content-api-key');
    // 未ログイン？
    if (!memberId) {
        alert('ログインが必要です');
        return;
    }

    const currentIsLiked = (button.getAttribute('data-liked') === 'true');

    try {
        if (currentIsLiked) {
            await removePostLike(postId, memberId, contentApiKey);
        } else {
            await addPostLike(postId, memberId, contentApiKey);
        }
    } catch (error) {
        console.error('[post-like] いいね操作に失敗しました:', error);
        return;
    }

    // 成功したのでUIを更新
    const newIsLiked = !currentIsLiked;
    button.setAttribute('data-liked', String(newIsLiked));

    const icon = button.querySelector('.gh-post-like-icon');
    if (icon) {
        if (newIsLiked) {
            icon.classList.add('gh-post-like-icon--active');
        } else {
            icon.classList.remove('gh-post-like-icon--active');
        }
    }

    const countSpan = button.closest('.gh-post-like-wrapper')?.querySelector('.gh-post-like-count');
    if (countSpan) {
        let currentCount = parseInt(countSpan.textContent, 10) || 0;
        currentCount = newIsLiked ? currentCount + 1 : currentCount - 1;
        countSpan.textContent = String(currentCount);
    }
}

// -----(メイン: DOMContentLoaded)----------------------------
document.addEventListener('DOMContentLoaded', async () => {
    const button = document.querySelector('.gh-post-like-button');
    if (!button) {
        return;
    }

    // 1) 初期化 (GETして状態を反映)
    await initializeLikeButtonUI(button);

    // 2) クリック時の処理
    button.addEventListener('click', handleLikeButtonClick);
});