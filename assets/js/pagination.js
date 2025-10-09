/**
 * pagination
 * @param {Boolean} isInfinite  - trueなら無限スクロール、falseならロードボタンを使う
 * @param {Function} done       - 読み込み完了後のコールバック関数(オプション)
 * @param {Boolean} isMasonry   - Masonryレイアウト用のフラグ(オプション)
 */
function pagination(isInfinite = false, done, isMasonry = false) {
    const feedElement = document.querySelector('.category-post-list, .home-post-list');
    if (!feedElement) {
        return;
    }

    let loading = false;
    const target = document.querySelector('.pagination');
    const buttonElement = document.querySelector('.category-loadmore');

    if (!document.querySelector('link[rel=next]') && buttonElement) {
        buttonElement.remove();
    }

    const loadNextPage = async function () {
        const nextElement = document.querySelector('link[rel=next]');
        if (!nextElement) {
            return;
        }

        try {
            const res = await fetch(nextElement.href);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const postElements = doc.querySelectorAll('.category-post-list > *, .home-post-list > *');
            const fragment = document.createDocumentFragment();
            const elems = [];

            postElements.forEach(function (post) {
                const clonedItem = document.importNode(post, true);

                if (isMasonry) {
                    clonedItem.style.visibility = 'hidden';
                }

                fragment.appendChild(clonedItem);
                elems.push(clonedItem);
            });

            feedElement.appendChild(fragment);

            if (done) {
                done(elems, loadNextWithCheck);
            }

            const resNextElement = doc.querySelector('link[rel=next]');
            if (resNextElement && resNextElement.href) {
                nextElement.href = resNextElement.href;
            } else {
                nextElement.remove();
                if (buttonElement) {
                    buttonElement.remove();
                }
            }
        } catch (e) {
            const nextElement = document.querySelector('link[rel=next]');
            if (nextElement) {
                nextElement.remove();
            }
            throw e;
        }
    };

    const loadNextWithCheck = async function () {
        if (
            target &&
            target.getBoundingClientRect().top <= window.innerHeight &&
            document.querySelector('link[rel=next]')
        ) {
            await loadNextPage();
        }
    };

    const callback = async function (entries, observer) {
        if (loading) {
            return;
        }
        loading = true;

        if (entries[0].isIntersecting) {
            if (!isMasonry) {
                while (
                    target &&
                    target.getBoundingClientRect().top <= window.innerHeight &&
                    document.querySelector('link[rel=next]')
                ) {
                    await loadNextPage();
                }
            } else {
                await loadNextPage();
            }
        }

        loading = false;

        if (!document.querySelector('link[rel=next]')) {
            observer.disconnect();
        }
    };

    const observer = new IntersectionObserver(callback);

    if (isInfinite) {
        if (target) {
            observer.observe(target);
        }
    } else if (buttonElement) {
        buttonElement.addEventListener('click', loadNextPage);
    }
}

/**
 * renderPaginationNumbers
 * ページネーション番号を動的に生成する
 */
function renderPaginationNumbers() {
    const paginationNav = document.querySelector('.pagination[data-current-page]');

    if (!paginationNav) {
        return;
    }

    const currentPage = parseInt(paginationNav.getAttribute('data-current-page'), 10) || 1;
    const totalPages = parseInt(paginationNav.getAttribute('data-total-pages'), 10) || 1;
    const firstUrl = paginationNav.getAttribute('data-first-url') || '/';
    const secondUrl = paginationNav.getAttribute('data-second-url') || '';
    const pageNumbersList = paginationNav.querySelector('.page-numbers');

    if (!pageNumbersList) {
        return;
    }

    const buildPageUrl = function (pageNum) {
        if (pageNum === 1) {
            return firstUrl;
        }

        if (secondUrl) {
            return secondUrl.replace(/2(\/)?$/, `${pageNum}$1`);
        }

        const normalized = firstUrl.endsWith('/') ? firstUrl : `${firstUrl}/`;
        return `${normalized}page/${pageNum}/`;
    };

    // Previous button
    if (currentPage > 1) {
        const prevLi = document.createElement('li');
        const prevLink = document.createElement('a');
        prevLink.classList.add('prev', 'page-numbers');
        prevLink.href = buildPageUrl(currentPage - 1);
        prevLink.setAttribute('aria-label', '前のページ');
        prevLink.innerHTML = '<i class="fa fa-chevron-left"></i>';
        prevLi.appendChild(prevLink);
        pageNumbersList.appendChild(prevLi);
    }

    // First page
    const firstLi = document.createElement('li');
    if (currentPage === 1) {
        const firstSpan = document.createElement('span');
        firstSpan.classList.add('page-numbers', 'current');
        firstSpan.setAttribute('aria-current', 'page');
        firstSpan.textContent = '1';
        firstLi.appendChild(firstSpan);
    } else {
        const firstLink = document.createElement('a');
        firstLink.classList.add('page-numbers');
        firstLink.href = buildPageUrl(1);
        firstLink.textContent = '1';
        firstLi.appendChild(firstLink);
    }
    pageNumbersList.appendChild(firstLi);

    // Dots before current range
    const PAGE_WINDOW = 1;
    const start = Math.max(2, currentPage - PAGE_WINDOW);
    const end = Math.min(totalPages - 1, currentPage + PAGE_WINDOW);

    if (start > 2) {
        const dotsLi = document.createElement('li');
        const dotsSpan = document.createElement('span');
        dotsSpan.classList.add('page-numbers', 'dots');
        dotsSpan.textContent = '…';
        dotsLi.appendChild(dotsSpan);
        pageNumbersList.appendChild(dotsLi);
    }

    // Page numbers around current page
    for (let i = start; i <= end; i++) {
        const li = document.createElement('li');
        if (i === currentPage) {
            const span = document.createElement('span');
            span.classList.add('page-numbers', 'current');
            span.setAttribute('aria-current', 'page');
            span.textContent = String(i);
            li.appendChild(span);
        } else {
            const link = document.createElement('a');
            link.classList.add('page-numbers');
            link.href = buildPageUrl(i);
            link.textContent = String(i);
            li.appendChild(link);
        }
        pageNumbersList.appendChild(li);
    }

    // Dots after current range
    if (end < totalPages - 1) {
        const dotsLi = document.createElement('li');
        const dotsSpan = document.createElement('span');
        dotsSpan.classList.add('page-numbers', 'dots');
        dotsSpan.textContent = '…';
        dotsLi.appendChild(dotsSpan);
        pageNumbersList.appendChild(dotsLi);
    }

    // Last page
    if (totalPages > 1) {
        const lastLi = document.createElement('li');
        if (currentPage === totalPages) {
            const lastSpan = document.createElement('span');
            lastSpan.classList.add('page-numbers', 'current');
            lastSpan.setAttribute('aria-current', 'page');
            lastSpan.textContent = String(totalPages);
            lastLi.appendChild(lastSpan);
        } else {
            const lastLink = document.createElement('a');
            lastLink.classList.add('page-numbers');
            lastLink.href = buildPageUrl(totalPages);
            lastLink.textContent = String(totalPages);
            lastLi.appendChild(lastLink);
        }
        pageNumbersList.appendChild(lastLi);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextLi = document.createElement('li');
        const nextLink = document.createElement('a');
        nextLink.classList.add('next', 'page-numbers');
        nextLink.href = buildPageUrl(currentPage + 1);
        nextLink.setAttribute('aria-label', '次のページ');
        nextLink.innerHTML = '<i class="fa fa-chevron-right"></i>';
        nextLi.appendChild(nextLink);
        pageNumbersList.appendChild(nextLi);
    }
}

// DOMContentLoadedで自動実行
document.addEventListener('DOMContentLoaded', renderPaginationNumbers);
