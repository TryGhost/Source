// 検索結果ページの動的フィルター機能
(function () {
    'use strict';

    let allPosts = []; // 取得した全投稿データを保存
    let filteredPosts = []; // フィルタリング済み投稿データを保存
    let displayedCount = 0; // 現在表示している投稿数
    const POSTS_PER_PAGE = 15; // 1回に表示する投稿数

    /**
     * URLクエリパラメータを解析して検索フィルター条件を取得
     * @returns {Object} 検索パラメータオブジェクト
     * @returns {string} returns.q - 検索クエリ文字列
     * @returns {string[]} returns.tags - 選択されたタグスラッグの配列
     * @returns {string[]} returns.groups - 選択されたグループIDの配列
     * @returns {string} returns.sort - ソート順
     */
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);

        return {
            q: params.get('q') || '',
            tags: params.getAll('tags'),
            groups: params.getAll('groups'),
            sort: params.get('sort') || 'newest'
        };
    }

    /**
     * Ghost Content APIから投稿データを取得
     * @param {string} key - Content APIのアクセスキー
     * @returns {Promise<Array>} 投稿オブジェクトの配列
     */
    async function fetchPosts(key) {
        try {
            const response = await fetch(
                `/ghost/api/content/posts/?key=${key}&include=tags,group&limit=all`
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
     * フィルタリングされた投稿を画面に表示（初期表示とページング対応）
     * @param {Array} posts - 表示する投稿オブジェクトの配列
     * @param {boolean} isLoadMore - 追加読み込みかどうか
     */
    function displayResults(posts, isLoadMore = false) {
        const container = document.getElementById('search-results-container');
        if (!container) {
            return;
        }

        // フィルタリング済み投稿を保存
        filteredPosts = posts;

        if (posts.length === 0) {
            displayedCount = 0;
            container.innerHTML = `
                <div class='search_results__header'>
                    <div class='search_results__header-tag'>sorry</div>
                    <div class='search_results__header-title'>
                        検索結果が見つかりませんでした。<br/>条件を変更して再度検索してください。
                    </div>
                </div>
            `;
            // 検索結果が0件の場合はボタンを非表示
            toggleLoadMoreButton(false);
            return;
        }

        if (!isLoadMore) {
            // 初回表示：最初の15件のみ
            displayedCount = Math.min(POSTS_PER_PAGE, posts.length);

            const headerHtml = `
                <div class='search_results__header'>
                    <div class='search_results__header-tag'>Search Result</div>
                    <h1 class='search_results__header-title'>
                        検索結果: ${posts.length}件
                    </h1>
                </div>
            `;

            const displayPosts = posts.slice(0, displayedCount);
            const postsHtml = displayPosts.map(post => createPostCard(post)).join('');
            const gridHtml = `<div class='search_results__grid' id='posts-grid'>${postsHtml}</div>`;

            container.innerHTML = headerHtml + gridHtml;

            // 「もっと見る」ボタンの表示/非表示を判断
            const shouldShowLoadMore = posts.length > displayedCount;
            toggleLoadMoreButton(shouldShowLoadMore);
        } else {
            // 追加読み込み：次の15件を追加
            const postsGrid = document.getElementById('posts-grid');
            if (!postsGrid) return;

            const startIndex = displayedCount;
            const endIndex = Math.min(startIndex + POSTS_PER_PAGE, posts.length);
            const additionalPosts = posts.slice(startIndex, endIndex);

            const additionalPostsHtml = additionalPosts.map(post => createPostCard(post)).join('');
            postsGrid.insertAdjacentHTML('beforeend', additionalPostsHtml);

            displayedCount = endIndex;

            // 「もっと見る」ボタンの表示/非表示を更新
            const shouldShowLoadMore = displayedCount < posts.length;
            toggleLoadMoreButton(shouldShowLoadMore);
        }
    }

    /**
     * 検索条件に基づいて投稿をフィルタリング
     * @param {Array} posts - 投稿オブジェクトの配列
     * @param {Object} params - フィルター条件オブジェクト
     * @param {string} [params.q] - 検索クエリ（タイトルと抜粋で検索）
     * @param {string[]} [params.tags] - フィルターするタグスラッグの配列
     * @param {string[]} [params.groups] - フィルターするグループIDの配列
     * @returns {Array} フィルタリングされた投稿の配列
     */
    function filterPosts(posts, params) {
        return posts.filter((post) => {
            // 検索クエリでフィルター
            if (params.q) {
                const query = params.q.toLowerCase();
                const title = post.title.toLowerCase();
                const excerpt = post.excerpt ? post.excerpt.toLowerCase() : '';

                if (!title.includes(query) && !excerpt.includes(query)) {
                    return false;
                }
            }

            // タグでフィルター
            if (params.tags && params.tags.length > 0) {
                const postTags = post.tags
                    ? post.tags.map(tag => tag.slug)
                    : [];
                const hasMatchingTag = params.tags.some(tag =>
                    postTags.includes(tag)
                );

                if (!hasMatchingTag) {
                    return false;
                }
            }

            // グループでフィルター
            if (params.groups && params.groups.length > 0) {
                const postGroupId = post.group ? post.group.id : null;
                const hasMatchingGroup = params.groups.includes(postGroupId);

                if (!hasMatchingGroup) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * 投稿を指定された順序でソート
     * @param {Array} posts - 投稿オブジェクトの配列
     * @param {string} sortOrder - ソート順
     * @returns {Array} ソートされた投稿の配列
     */
    function sortPosts(posts, sortOrder) {
        return [...posts].sort((a, b) => {
            const dateA = new Date(a.published_at);
            const dateB = new Date(b.published_at);

            if (sortOrder === 'newest') {
                return dateB - dateA; // 新しい順
            } else {
                return dateA - dateB; // 古い順
            }
        });
    }


    /**
     * URLパラメータに基づいてフォーム要素の初期状態を設定
     */
    function initializeForm() {
        const params = getUrlParams();

        // キーワード検索フィールドを設定（両方のフォームに値を設定）
        const searchResultsInput = document.getElementById('search-results-input');
        const headerSearchInput = document.getElementById('header-search-input');

        if (searchResultsInput) {
            searchResultsInput.value = params.q;
        }
        if (headerSearchInput) {
            headerSearchInput.value = params.q;
        }

        // 入力フィールドの同期を設定
        setupInputSync()

        // タグボタンのaria-pressed状態を設定
        params.tags.forEach((tag) => {
            const button = document.querySelector(`[data-tag-slug='${tag}']`);
            if (button) {
                button.setAttribute('aria-pressed', 'true');
            }
        });

        // グループチェックボックスの初期状態を設定
        params.groups.forEach((groupId) => {
            const checkbox = document.querySelector(`input[name="magazine"][value="${groupId}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });

        // ソート選択を設定
        const sortSelect = document.querySelector(
            '.search_results__sort-dropdown'
        );
        if (sortSelect) {
            sortSelect.value = params.sort;
        }
    }

    /**
     * ソートドロップダウンの変更イベントを処理
     */
    function handleSortChange() {
        // TODO: ソートも query parameter に入れる
        const sortSelect = document.querySelector(
            '.search_results__sort-dropdown'
        );

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                const params = getUrlParams();
                params.sort = this.value;

                // URLを更新
                const url = new URL(window.location);
                url.searchParams.set('sort', params.sort);
                window.history.pushState({}, '', url);

                // 結果を更新
                applyFilters();
            });
        }
    }

    /**
     * 現在のURLパラメータとheaderの検索値に基づいてフィルターとソートを適用し結果を表示
     */
    function applyFilters() {
        const params = getUrlParams();

        // 検索フィールドから現在の値を取得（検索結果ページ内を優先）
        const searchResultsInput = document.getElementById('search-results-input');
        const headerSearchInput = document.getElementById('header-search-input');
        const searchInput = searchResultsInput || headerSearchInput;
        const currentSearchQuery = searchInput ? searchInput.value.trim() : '';

        // headerの値がある場合はそれを優先、なければURLパラメータを使用
        if (currentSearchQuery) {
            params.q = currentSearchQuery;
        }

        // フィルタリング
        let filteredPosts = filterPosts(allPosts, params);

        // ソート
        filteredPosts = sortPosts(filteredPosts, params.sort);

        // 表示
        displayResults(filteredPosts);
    }

    /**
     * タグボタンのクリックイベントを処理してaria-pressed状態を切り替え
     */
    function handleTagButtonClicks() {
        const tagButtons = document.querySelectorAll('#tag-list > button');

        tagButtons.forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault();

                // aria-pressed状態を切り替え
                const isPressed = this.getAttribute('aria-pressed') === 'true';
                this.setAttribute('aria-pressed', !isPressed);
            });
        });
    }

    /**
     * 「もっと見る」ボタンの表示/非表示を切り替え
     * @param {boolean} show - 表示するかどうか
     */
    function toggleLoadMoreButton(show) {
        const loadMoreContainer = document.querySelector('.search_results__load-more');
        if (loadMoreContainer) {
            loadMoreContainer.style.display = show ? 'grid' : 'none';
        }
    }

    /**
     * 「もっと見る」ボタンのクリックイベントを処理
     */
    function handleLoadMoreButton() {
        const loadMoreBtn = document.querySelector('#load-more button');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();

                // 追加で15件表示
                displayResults(filteredPosts, true);
            });
        }
    }

    /**
     * フォーム送信時にaria-pressed状態のタグとheaderの検索値をhiddenフィールドに変換
     */
    function handleFormSubmit() {
        const form = document.querySelector('form[id="posts"]');

        if (!form) {
            return;
        }

        form.addEventListener('submit', () => {
            // 検索結果ページ内の検索フィールドを優先的に取得、なければヘッダーから取得
            const searchResultsInput = document.getElementById('search-results-input');
            const headerSearchInput = document.getElementById('header-search-input');
            const searchInput = searchResultsInput || headerSearchInput;
            const searchQuery = searchInput ? searchInput.value.trim() : '';

            // 既存のqのhiddenフィールドを削除
            form.querySelectorAll('input[name="q"]').forEach(input => input.remove());

            // 検索クエリをhiddenフィールドに追加
            if (searchQuery) {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'q';
                hiddenInput.value = searchQuery;
                form.appendChild(hiddenInput);
            }

            // 選択されたタグをhiddenフィールドに設定
            const selectedTags = [];
            const tagButtons = document.querySelectorAll(
                '#tag-list > button[aria-pressed="true"]'
            );

            tagButtons.forEach((button) => {
                const tagSlug = button.getAttribute('data-tag-slug');
                if (tagSlug) {
                    selectedTags.push(tagSlug);
                }
            });

            // 既存のtagsのhiddenフィールドを削除
            form.querySelectorAll('input[name="tags"]').forEach(input =>
                input.remove()
            );

            // 新しいtagsのhiddenフィールドを追加
            selectedTags.forEach((tag) => {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'tags';
                hiddenInput.value = tag;
                form.appendChild(hiddenInput);
            });

            // 選択されたグループをhiddenフィールドに設定
            const selectedGroups = [];
            const groupCheckboxes = document.querySelectorAll('input[name="magazine"]:checked');

            groupCheckboxes.forEach((checkbox) => {
                const groupId = checkbox.value;
                if (groupId) {
                    selectedGroups.push(groupId);
                }
            });

            // 既存のgroupsのhiddenフィールドを削除
            form.querySelectorAll('input[name="groups"]').forEach(input =>
                input.remove()
            );

            // 新しいgroupsのhiddenフィールドを追加
            selectedGroups.forEach((groupId) => {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'groups';
                hiddenInput.value = groupId;
                form.appendChild(hiddenInput);
            });
        });
    }

    /**
     * ヘッダーフォームの送信処理
     * 検索結果ページでヘッダーフォームが送信されたときに「この条件で検索」ボタンをクリック
     */
    function handleHeaderFormSubmit() {
        // 全ての検索フォーム（ヘッダーと検索結果ページ内の両方）を取得
        const searchForms = document.querySelectorAll('form[action="/search-results"]');
        const postsForm = document.querySelector('form[id="posts"]');

        if (!searchForms.length || !postsForm) {
            return;
        }

        // 各検索フォームに対してイベントリスナーを設定
        searchForms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault(); // デフォルトのフォーム送信を無効化

                // 既存の「この条件で検索」ボタンをクリックして処理を実行
                const submitButton = postsForm.querySelector('.search_results__filter-button');
                if (submitButton) {
                    submitButton.click();
                }
            });
        });
    }

    /**
     * アコーディオンの開閉を処理
     */
    function handleAccordion() {
        const toggleButton = document.getElementById('accordion-toggle');
        const accordionContent = document.getElementById('accordion-content');
        const stickyButton = document.querySelector('.search_results__sticky_btn');

        if (!toggleButton || !accordionContent) {
            return;
        }

        /**
         * アコーディオンの開閉状態を切り替え
         * @param {boolean} isOpen - 開く場合はtrue、閉じる場合はfalse
         */
        function toggleAccordion(isOpen) {
            toggleButton.setAttribute('aria-expanded', isOpen);
            accordionContent.setAttribute('aria-hidden', !isOpen);
            accordionContent.classList.toggle('search_results__accordion--open', isOpen);
        }

        // 詳細検索ボタンのクリックイベント
        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            toggleAccordion(!isExpanded);
        });

        // スティッキーボタンのクリックイベント
        if (stickyButton) {
            stickyButton.addEventListener('click', function(e) {
                e.preventDefault();
                const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
                toggleAccordion(!isExpanded);

                // スクロールしてナビゲーションバーを表示
                const navbar = document.querySelector('.search_results__navbar');
                if (navbar) {
                    navbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }

    /**
     * 検索入力フィールドの同期を設定
     * search-results-inputとheader-search-inputの値を常に同期させる
     */
    function setupInputSync() {
        const searchResultsInput = document.getElementById('search-results-input');
        const headerSearchInput = document.getElementById('header-search-input');

        if (!searchResultsInput || !headerSearchInput) {
            return;
        }

        // search-results-inputの入力イベント
        searchResultsInput.addEventListener('input', function() {
            headerSearchInput.value = this.value;
        });

        // header-search-inputの入力イベント
        headerSearchInput.addEventListener('input', function() {
            searchResultsInput.value = this.value;
        });
    }

    /**
     * ページ読み込み時の初期化処理
     * 投稿データの取得、フォーム初期化、イベントハンドラー設定を行う
     */
    async function initialize() {
        // 投稿データを取得
        const contentApiKey = window.ghostConfig.contentApiKey;
        if (!contentApiKey) {
            return;
        }

        allPosts = await fetchPosts(contentApiKey);

        // 初期状態では「もっと見る」ボタンを非表示
        toggleLoadMoreButton(false);

        // フォームを初期化
        initializeForm();

        // イベントハンドラーを設定
        handleSortChange();
        handleTagButtonClicks();
        handleFormSubmit();
        handleLoadMoreButton();
        handleAccordion();
        handleHeaderFormSubmit();

        // 初回表示
        applyFilters();
    }

    // DOMContentLoaded後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
