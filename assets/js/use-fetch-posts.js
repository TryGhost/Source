function useFetchPosts(postsSelector, baseParams) {
    const contentApiKey = window.ghostConfig.contentApiKey;
    const searchParams = new URLSearchParams({
        key: contentApiKey,
        include: baseParams.include || 'tags,group',
        filter: baseParams.filter || '',
        page: baseParams.page || 1,
        limit: baseParams.limit || 'all',
        order: baseParams.order || 'published_at DESC'
    });
    const loadMoreButton = document.querySelector('#load-more button');

    async function fetchPosts(additionalParams = {}) {
        Array.from(additionalParams).forEach(([key, value]) => {
            searchParams.set(key, value);
        });

        try {
            const response = await fetch(
                `/ghost/api/content/posts/?${searchParams.toString()}`
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

    async function displayPosts(posts, hasNext) {
        displayArticleCards(posts, postsSelector);

        if (!hasNext) {
            toggleLoadMoreButton(false);
        }
    }

    async function loadMore() {
        const pageNumber = Number(searchParams.get('page'));
        const currentPage = isNaN(pageNumber) ? 1 : pageNumber;
        searchParams.set('page', currentPage + 1);

        const [posts, hasNext] = await fetchPosts({page: currentPage + 1});
        if (posts.length > 0) {
            await displayPosts(posts, hasNext);
        } else {
            toggleLoadMoreButton(false);
        }
    }

    /**
     * 「もっと見る」ボタンのクリックイベントを処理
     */
    function handleLoadMoreButton() {
        if (!loadMoreButton) {
            return;
        }

        loadMoreButton.addEventListener('click', async (e) => {
            e.preventDefault();
           await loadMore();
        });
    }

    /**
     * もっと見るボタンの表示/非表示を切り替え
     *
     * @param {boolean} isShow - trueなら表示、falseなら非表示
     */
    async function toggleLoadMoreButton(isShow) {
        if (!loadMoreButton) {
            return;
        }

        const displayStyle = isShow ? 'block' : 'none';
        loadMoreButton.style.display = displayStyle;
    }

    return {fetchPosts,displayPosts,handleLoadMoreButton,toggleLoadMoreButton};
}
