(function() {
    'use strict';

    // 検索結果ページでのみ実行
    if (window.location.pathname !== '/search-results/') {
        return;
    }

    const POSTS_PER_PAGE = 15;

    // DOMContentLoaded後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    const cardContainerSelector = '#search-results-container';
    const {fetchPosts,displayPosts,handleLoadMoreButton,toggleLoadMoreButton} = useFetchPosts(cardContainerSelector, {
        include: 'tags,group',
        page: 1,
        limit: POSTS_PER_PAGE,
        order: 'published_at DESC',
    });

    async function initialize() {
        // イベントハンドラの登録
        handleTagButtonClicks();
        handleFormSubmit();
        handleLoadMoreButton();
        handleAccordion();

        const params = getUrlParams();
        initializeForm(params);

        const filter = getSearchFilter(params);
        const searchParams = new URLSearchParams({
            filter,
            order: params.order === 'newest' ? 'published_at DESC' : 'page_view_count DESC',
        });
        await displaySearchResults(searchParams);
    }

    async function displaySearchResults(searchParams) {
        clearElements(cardContainerSelector);
        clearElements('.search_results__header');

        const [posts, hasNext] = await fetchPosts(searchParams);
        if (posts.length > 0) {
            displaySearchResultsSummary('.search_results__header', posts.length);
            await displayPosts(posts, hasNext);
        } else {
            toggleLoadMoreButton(false);
            displayNoResultsMessage('.search_results__header');
        }
    }

    function handleFormSubmit() {
        const resultForm = document.querySelector('form[id="posts"]');
        const headerForm = document.querySelector('form[id="header-search-form"]');

        [resultForm, headerForm].forEach((form) => {
            if (!form) {
                return;
            }

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const searchInput = document.getElementById('header-search-input');
                const searchQuery = searchInput ? searchInput.value.trim() : '';
                await submitForm(searchQuery);
            });
        });

        const spForm = document.querySelector('form[id="posts-sp"]');
        spForm?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const searchInput = document.getElementById('search-results-input');
            const searchQuery = searchInput ? searchInput.value.trim() : '';
            await submitForm(searchQuery);
        });
    }

    async function submitForm(searchQuery) {
        const tagButtons = document.querySelectorAll(
            '#tag-list > button[aria-pressed="true"]'
        );
        const selectedTags = Array.from(tagButtons).map(button => button.getAttribute('data-tag-slug')).filter(Boolean);

        const groupCheckboxes = document.querySelectorAll('input[name="magazine"]:checked');
        const selectedGroups = Array.from(groupCheckboxes).map(checkbox => checkbox.value).filter(Boolean);

        const orderSelect = document.querySelector('.search_results__sort-dropdown');
        const order = getSearchOrder(orderSelect?.value);

        setUrlParams({q: searchQuery, tags: selectedTags, groups:selectedGroups, order: orderSelect.value});

        const filter = getSearchFilter({q: searchQuery, tags: selectedTags, groups:selectedGroups});
        const params = new URLSearchParams({
            filter,
            page: 1,
            order
        });
        await displaySearchResults(params)
    };
})();
