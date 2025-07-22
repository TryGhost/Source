async function recordPageView(postId) {
    if (!postId) {
        return;
    }

    try {
        await fetch(`/members/api/posts/${postId}/page-views`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch  {
        // no-op
    }
}
