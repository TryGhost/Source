/**
 * Onsale page - Apply tags to post cards
 */
(function() {
    'use strict';

    function applyOnsaleTags() {
        // onsaleページかチェック
        if (window.location.pathname !== '/onsale/') {
            return;
        }

        // タグデータが存在するかチェック
        if (!window.onsalePostsTags) {
            return;
        }

        // 全ての記事カードを取得
        const postCards = document.querySelectorAll('.post-card');
        if (postCards.length === 0) {
            return;
        }

        // 各記事カードのURLからスラッグを抽出し、タグを適用
        postCards.forEach(function(card) {
            const link = card.querySelector('a.post-card__link');
            if (!link) {
                return;
            }

            const postUrl = link.getAttribute('href');
            const slug = postUrl.replace(/^\//, '').replace(/\/$/, '');

            // タグデータを取得
            const tags = window.onsalePostsTags[slug];
            if (tags) {
                const tagsJson = JSON.stringify(tags);
                card.setAttribute('data-magazine-tags', tagsJson);
            }
        });

        // magazine-tag.jsの処理を直接呼び出す（無限ループを回避）
        // magazine-tag.jsが完全に初期化されるまで少し待つ
        setTimeout(function() {
            if (window.MagazineTag && window.MagazineTag.processPostCardMagazineTags) {
                window.MagazineTag.processPostCardMagazineTags();
            }
        }, 100);
    }

    // DOMの準備ができるまで待機
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyOnsaleTags);
    } else {
        applyOnsaleTags();
    }
})();
