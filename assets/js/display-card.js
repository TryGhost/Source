/**
 * 投稿データからcard.hbsパーシャルと同様のHTMLカードを生成
 * @param {Object} post - 投稿オブジェクト
 * @param {string} post.url - 投稿のURL
 * @param {string} post.title - 投稿のタイトル
 * @param {string} [post.feature_image] - アイキャッチ画像のURL
 * @param {string} [post.excerpt] - 投稿の抜粋
 * @param {string} post.published_at - 公開日時
 * @param {Array} [post.tags] - タグの配列
 * @param {Object} [post.group] - グループオブジェクト
 * @returns {string} HTMLカードの文字列
 */
function createPostCard(post) {
    const featureImage = post.feature_image;
    const groupLogoImage = post.group?.logo_image;
    const tags = post.tags ? post.tags.slice(0, 2) : [];
    const tagHtml = tags.map(tag => `#${tag.name}`).join(' ');

    // 日付をフォーマット
    const publishedDate = new Date(post.published_at);
    const formattedDate = publishedDate
        .toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
        .replace(/\//g, '.');

    return `
        <article class='card'>
            <div class='card-image'>
                ${
                    featureImage
                        ? `<img src='${featureImage}' alt='' loading='lazy'>`
                        : `<img src='/assets/images/default-post-image.png' alt='' loading='lazy'>`
                }
                ${
                    groupLogoImage
                        ? `
                    <a href='/magazine?group=${post.group.slug}' class='card-magazine-logo' style='background-image: url(${groupLogoImage})'></a>
                `
                        : ''
                }
            </div>

            <a href='${post.url}' class='card-content'>
                <div class='card-header'>
                    ${
                        tags.length > 0
                            ? `
                        <div class='card-tags'>
                            ${tagHtml}
                        </div>
                    `
                            : ''
                    }
                    <h2 class='card-title'>
                        ${post.title}
                    </h2>
                    ${
                        post.excerpt
                            ? `
                        <p class='card-excerpt'>${post.excerpt}</p>
                    `
                            : ''
                    }
                </div>

                <div class='card-footer'>
                    <time class='card-date' datetime='${post.published_at}'>
                        ${formattedDate}
                    </time>
                    <span class='card-readmore'>
                        続きを読む
                        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M9 6l6 6-6 6' stroke='#0c060c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
                        </svg>
                    </span>
                </div>
            </a>
        </article>
    `;
}

/**
 * 投稿カードを表示
 * @param {Array} posts - 投稿一覧
 * @param {string} selector - セクションのセレクタ
 */
function displayArticleCards(posts, selector) {
  const container = document.querySelector(selector);
  if (!container) {
      return;
  }

  posts.forEach(post => {
      const cardHtml = createPostCard(post);
      container.insertAdjacentHTML('beforeend', cardHtml);
  });
}

function clearElements(selector) {
    const container = document.querySelector(selector);
    if (container) {
        container.innerHTML = '';
    }
}

function displaySearchResultsSummary(selector, length) {
    const container = document.querySelector(selector);
    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class='search_results__header-tag'>Search Result</div>
        <h1 class='search_results__header-title'>
            検索結果: ${length}件
        </h1>
    `
}

function displayNoResultsMessage(selector) {
    const container = document.querySelector(selector);
    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class='search_results__header'>
            <div class='search_results__header-tag'>sorry</div>
            <div class='search_results__header-title'>
                検索結果が見つかりませんでした。<br/>条件を変更して再度検索してください。
            </div>
        </div>
   `;
}
