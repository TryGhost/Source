/**
 * カスタムログインフォーム処理
 */

function openSigninModal() {
    console.log('Opening signin modal'); // デバッグ用
    const modal = document.getElementById('signin-modal');
    if (modal) {
        console.log('Modal found, showing...'); // デバッグ用
        modal.showModal();
        document.body.classList.add('custom-portal-open');
    } else {
        console.log('Modal not found!'); // デバッグ用
    }
}

// グローバルに関数を登録
window.openSigninModal = openSigninModal;
window.closeSigninModal = closeSigninModal;
window.switchToSignup = switchToSignup;

function closeSigninModal() {
    const modal = document.getElementById('signin-modal');
    if (modal) {
        modal.close();
        document.body.classList.remove('custom-portal-open');
        // フォームをリセット
        const form = document.getElementById('signin-form');
        if (form) {
            form.reset();
        }
        // エラー・成功メッセージを非表示
        const errorDiv = document.getElementById('signin-error');
        const successDiv = document.getElementById('signin-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
    }
}

function switchToSignup() {
    closeSigninModal();
    setTimeout(() => {
        if (window.openSignupModal) {
            window.openSignupModal();
        }
    }, 100);
}

// DOMContentLoaded時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // フォーム送信処理
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        // Ghostのネイティブ処理を使用しつつ、独自のハンドリングも追加
        signinForm.addEventListener('submit', function(e) {
            console.log('Signin form submitted - using Ghost native handling');
            
            const submitButton = document.getElementById('signin-submit');
            const buttonText = submitButton?.querySelector('.custom-portal-button-text');
            const loadingText = submitButton?.querySelector('.custom-portal-loading');
            
            // ローディング状態に変更
            if (buttonText) buttonText.style.display = 'none';
            if (loadingText) loadingText.style.display = 'inline';
            if (submitButton) submitButton.disabled = true;
            
            // 5秒後にローディング状態を解除（メール送信完了想定）
            setTimeout(() => {
                if (buttonText) buttonText.style.display = 'inline';
                if (loadingText) loadingText.style.display = 'none';
                if (submitButton) submitButton.disabled = false;
                
                const successDiv = document.getElementById('signin-success');
                if (successDiv) {
                    successDiv.style.display = 'block';
                    successDiv.textContent = 'ログインリンクをメールでお送りしました。メールをご確認ください。';
                }
            }, 5000);
        });
        
        // Ghostのネイティブイベントリスナーを追加
        signinForm.addEventListener('memberSignin', function(e) {
            console.log('Member signin event:', e);
            const successDiv = document.getElementById('signin-success');
            if (successDiv) {
                successDiv.style.display = 'block';
                successDiv.textContent = 'ログインリンクをメールでお送しましたのでご確認ください';
            }
        });
        
        // ログイン成功を検知してリロード
        signinForm.addEventListener('success', function(e) {
            console.log('Login success detected, reloading page...');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
    
    // モーダル外クリックで閉じる
    const modal = document.getElementById('signin-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSigninModal();
            }
        });
    }
    
    // data-portal属性のリンクをカスタムモーダルに置き換え（signinのみ）
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-portal]');
        if (target) {
            const portalType = target.getAttribute('data-portal');
            
            // signin のみカスタムモーダルを使用（Ghost Portal内からは除外）
            if (portalType === 'signin' && !target.closest('#ghost-portal-root')) {
                console.log('Signin button clicked'); // デバッグ用
                e.preventDefault();
                e.stopPropagation();
                openSigninModal();
                return false;
            }
            // account, upgrade などその他のPortal機能はそのまま動作させる
        }
    });
});

