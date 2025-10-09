/**
 * Review Navigation
 * Handles navigation between 発売予告 (before) and 開封レビュー (after) posts
 */
/* eslint-env browser */
(function () {
    'use strict';

    /**
     * Remove prefix from title (e.g., 【発売予告】 or 【開封レビュー】)
     */
    function removeTitlePrefix(title) {
        return title.replace(/^【[^】]+】\s*/, '');
    }

    /**
     * Initialize review navigation
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

        // Hide if post doesn't have either tag
        if (!hasBefore && !hasAfter) {
            reviewNavElement.style.display = 'none';
            return;
        }

        // Fetch all posts using RSS feed (simpler than Content API)
        fetch('/rss/')
            .then(function (response) {
                return response.text();
            })
            .then(function (rssText) {
                // Parse RSS XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(rssText, 'text/xml');
                const items = xmlDoc.querySelectorAll('item');

                const allPosts = [];
                items.forEach(function (item) {
                    const title = item.querySelector('title').textContent;
                    const link = item.querySelector('link').textContent;
                    // Extract slug from link
                    const slug = link.replace(window.location.origin + '/', '').replace(/\/$/, '');

                    allPosts.push({
                        title: title,
                        slug: slug,
                        url: '/' + slug + '/'
                    });
                });

                processReviewNav(allPosts, hasBefore, hasAfter, postTitle, postSlug, reviewNavElement);
            })
            .catch(function () {
                // Failed to fetch posts, navigation will not be rendered
            });

        function processReviewNav(allPosts, hasBefore, hasAfter, postTitle, postSlug, reviewNavElement) {
            const baseTitle = removeTitlePrefix(postTitle);

            // Filter posts that might be related (same base title, different slug)
            const candidatePosts = allPosts.filter(function (post) {
                if (post.slug === postSlug) {
                    return false; // Skip current post
                }
                const postBaseTitle = removeTitlePrefix(post.title);
                return postBaseTitle === baseTitle;
            });

            let html = '';

            // If there's a post with the same base title but different slug, it's the related post
            const relatedPost = candidatePosts.length > 0 ? candidatePosts[0] : null;

            if (hasBefore) {
                // Current post is 発売予告
                html += '<div class="review-nav-tab active">予告</div>';

                if (relatedPost) {
                    html += '<div class="review-nav-tab none-active">' +
                        '<a href="' + relatedPost.url + '">開封レビュー</a>' +
                        '</div>';
                } else {
                    html += '<div class="review-nav-tab review-nav-none">&nbsp;</div>';
                }
            } else if (hasAfter) {
                // Current post is 開封レビュー
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

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReviewNav);
    } else {
        initReviewNav();
    }
})();
