/**
 * レビューナビゲーション
 * 発売予告（hash-before）と開封レビュー（hash-after）の記事間のナビゲーションを処理
 */
/* eslint-env browser */
(function () {
    'use strict';

    /**
     * タイトルから接頭辞を削除（例：【発売予告】や【開封レビュー】）
     */
    function removeTitlePrefix(title) {
        return title.replace(/^【[^】]+】\s*/, '');
    }

    /**
     * レビューナビゲーションを初期化
     */
    function initReviewNav() {
        const reviewNavElement = document.querySelector('.review-nav');

        if (!reviewNavElement) {
            return;
        }

        const postTitle = reviewNavElement.getAttribute('data-post-title');
        const postSlug = reviewNavElement.getAttribute('data-post-slug');
        const postTags = (reviewNavElement.getAttribute('data-post-tags') || '').split(',').filter(function (tag) {
            return tag.trim();
        });

        const hasBefore = postTags.indexOf('hash-before') !== -1;
        const hasAfter = postTags.indexOf('hash-after') !== -1;

        // どちらのタグも持っていない場合は非表示
        if (!hasBefore && !hasAfter) {
            reviewNavElement.style.display = 'none';
            return;
        }

        // RSSフィードを使って全投稿を取得（Content APIより簡単）
        fetch('/rss/')
            .then(function (response) {
                return response.text();
            })
            .then(function (rssText) {
                // RSS XMLをパース
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(rssText, 'text/xml');
                const items = xmlDoc.querySelectorAll('item');

                const allPosts = [];
                items.forEach(function (item) {
                    const title = item.querySelector('title').textContent;
                    const link = item.querySelector('link').textContent;
                    // リンクからスラッグを抽出
                    const slug = link.replace(window.location.origin + '/', '').replace(/\/$/, '');

                    allPosts.push({
                        title: title,
                        slug: slug,
                        url: '/' + slug + '/'
                    });
                });

                processReviewNav(allPosts);
            })
            .catch(function () {
                // 投稿の取得に失敗した場合、ナビゲーションは表示されない
            });

        function processReviewNav(allPosts) {
            const baseTitle = removeTitlePrefix(postTitle);

            // 関連する可能性のある投稿をフィルタリング（同じベースタイトル、異なるスラッグ）
            const candidatePosts = allPosts.filter(function (post) {
                if (post.slug === postSlug) {
                    return false; // 現在の投稿をスキップ
                }
                const postBaseTitle = removeTitlePrefix(post.title);
                return postBaseTitle === baseTitle;
            });

            let html = '';

            // 同じベースタイトルで異なるスラッグの投稿があれば、それが関連投稿
            const relatedPost = candidatePosts.length > 0 ? candidatePosts[0] : null;

            if (hasBefore) {
                // 現在の投稿は発売予告
                html += '<div class="review-nav-tab active">予告</div>';

                if (relatedPost) {
                    html += '<div class="review-nav-tab none-active">' +
                        '<a href="' + relatedPost.url + '">開封レビュー</a>' +
                        '</div>';
                } else {
                    html += '<div class="review-nav-tab review-nav-none">&nbsp;</div>';
                }
            } else if (hasAfter) {
                // 現在の投稿は開封レビュー
                if (relatedPost) {
                    html += '<div class="review-nav-tab none-active">' +
                        '<a href="' + relatedPost.url + '">予告</a>' +
                        '</div>';
                } else {
                    html += '<div class="review-nav-tab review-nav-none">&nbsp;</div>';
                }

                html += '<div class="review-nav-tab active">開封レビュー</div>';
            }

            reviewNavElement.innerHTML = html;
        }
    }

    // DOMの準備ができるまで待機
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReviewNav);
    } else {
        initReviewNav();
    }
})();
