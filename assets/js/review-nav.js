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

        // テンプレートから投稿データを取得
        // 現在の投稿がhash-beforeなら、hash-afterのデータから検索
        // 現在の投稿がhash-afterなら、hash-beforeのデータから検索
        let postsDataElement;
        if (hasBefore) {
            postsDataElement = document.getElementById('review-nav-posts-after');
        } else if (hasAfter) {
            postsDataElement = document.getElementById('review-nav-posts-before');
        }

        if (!postsDataElement) {
            console.error('レビューナビゲーション: 投稿データが見つかりません');
            return;
        }

        try {
            const allPosts = JSON.parse(postsDataElement.textContent);
            processReviewNav(allPosts);
        } catch (error) {
            console.error('レビューナビゲーション: 投稿データのパースエラー', error);
        }

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
