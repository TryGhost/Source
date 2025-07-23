/**
 * タグボタンのクリックイベントを処理してaria-pressed状態を切り替え
 */
function handleTagButtonClicks() {
    const tagButtons = document.querySelectorAll('#tag-list > button');

    tagButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // aria-pressed状態を切り替え
            const isPressed = this.getAttribute('aria-pressed') === 'true';
            this.setAttribute('aria-pressed', !isPressed);
        });
    });
}

/**
 * URLパラメータに基づいてフォーム要素の初期状態を設定
 */
function initializeForm(params) {
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
    params.tags.forEach(tag => {
        const button = document.querySelector(`[data-tag-slug='${tag}']`);
        if (button) {
            button.setAttribute('aria-pressed', 'true');
        }
    });

    // グループチェックボックスの初期状態を設定
    params.groups.forEach(groupId => {
        const checkbox = document.querySelector(`input[name="magazine"][value="${groupId}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });

    // ソート選択を設定
    const orderSelect = document.querySelector(
        '.search_results__sort-dropdown'
    );
    if (orderSelect) {
        orderSelect.value = params.order;
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
 * URLクエリパラメータを解析して検索フィルター条件を取得
 * @returns {Object} 検索パラメータオブジェクト
 * @returns {string} returns.q - 検索クエリ文字列
 * @returns {string[]} returns.tags - 選択されたタグスラッグの配列
 * @returns {string[]} returns.groups - 選択されたグループIDの配列
 * @returns {string} returns.order - ソート順
 */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);

    return {
        q: params.get('q') || '',
        tags: params.getAll('tags'),
        groups: params.getAll('groups'),
        order: params.get('order') || 'newest'
    };
}

function setUrlParams(params) {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams();

    if (params.q) {
        searchParams.set('q', params.q);
    }

    if (params.tags.length > 0) {
        params.tags.forEach(tag => searchParams.append('tags', tag));
    }

    if (params.groups.length > 0) {
        params.groups.forEach(group => searchParams.append('groups', group));
    }

    if (params.order) {
        searchParams.set('order', params.order);
    }

    url.search = searchParams.toString();
    window.history.replaceState({}, '', url.toString());
}

function getSearchFilter(params) {
    const { q, tags, groups } = params;

    const filters = [];

    if (tags.length > 0) {
        filters.push(`tags:[${tags.join(',')}]`);
    }

    if (groups.length > 0) {
        filters.push(`group_id:[${groups.join(',')}]`);
    }

    if (q) {
        filters.push(`title:~'${q}'`);
    }

    return filters.join('+');
}

function getSearchOrder(orderSelectValue) {
    if (!orderSelectValue) {
        return 'published_at DESC';
    }

    return orderSelectValue === 'newest' ? 'published_at DESC' : 'page_view_count DESC';
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
