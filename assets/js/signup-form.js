/**
 * カスタム新規登録フォーム処理
 */

function openSignupModal() {
    console.log('Opening signup modal'); // デバッグ用
    const modal = document.getElementById('signup-modal');
    if (modal) {
        console.log('Modal found, showing...'); // デバッグ用
        modal.showModal();
        document.body.classList.add('custom-portal-open');
    } else {
        console.log('Modal not found!'); // デバッグ用
    }
}

// グローバルに関数を登録
window.openSignupModal = openSignupModal;
window.closeSignupModal = closeSignupModal;
window.switchToSignin = switchToSignin;
window.selectTier = selectTier;
window.selectPaidTier = selectPaidTier;
window.togglePlanType = togglePlanType;

function closeSignupModal() {
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.close();
        document.body.classList.remove('custom-portal-open');
        // フォームをリセット
        const form = document.getElementById('signup-form');
        if (form) {
            form.reset();
        }
        // エラー・成功メッセージを非表示
        const errorDiv = document.getElementById('signup-error');
        const successDiv = document.getElementById('signup-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
    }
}

function switchToSignin() {
    closeSignupModal();
    setTimeout(() => {
        if (window.openSigninModal) {
            window.openSigninModal();
        }
    }, 100);
}

function selectPaidTier(tierId, tierType, tierName) {
    console.log('Paid tier selected:', tierId, tierType, tierName);
    
    // Ghost設定の確認
    console.log('Ghost config check:', {
        membersEnabled: window.ghostConfig || 'No ghostConfig',
        siteUrl: window.location.origin,
        currentUrl: window.location.href
    });
    
    // フォームデータを取得
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const termsCheckbox = document.getElementById('agree-terms');
    const errorDiv = document.getElementById('signup-error');
    
    // バリデーション
    let errors = [];
    
    if (!nameInput.value.trim()) {
        errors.push('お名前を入力してください。');
    }
    
    if (!emailInput.value.trim()) {
        errors.push('メールアドレスを入力してください。');
    } else if (!emailInput.value.includes('@')) {
        errors.push('有効なメールアドレスを入力してください。');
    }
    
    if (!termsCheckbox.checked) {
        errors.push('利用規約に同意してください。');
    }
    
    if (errors.length > 0) {
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = errors.join(' ');
        }
        return false;
    }
    
    // エラーをクリア
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    
    // 現在の支払いタイプを取得
    const currentPlanType = getCurrentPlanType();
    
    // フォームデータを準備
    const userData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim()
    };
    
    console.log('Opening Ghost Portal directly with user data:', userData);
    console.log('Portal URL will be:', `signup/${tierId}/${currentPlanType}`);
    console.log('Available Ghost APIs:', {
        ghost: !!window.ghost,
        portal: !!(window.ghost && window.ghost.portal),
        ghostConfig: !!window.ghostConfig
    });
    
    // モーダルを閉じる
    closeSignupModal();
    
    // すべてのカスタムモーダルを閉じる
    const signinModal = document.getElementById('signin-modal');
    if (signinModal && signinModal.hasAttribute('open')) {
        signinModal.close();
    }
    
    // Ghost標準のPortalを開く
    setTimeout(() => {
        console.log('Opening Ghost Portal for paid plan...');
        
        // URLパラメータをクリア
        if (window.location.search.includes('stripe=cancel')) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
        
        // すべてのカスタムPortalクラスを削除
        document.body.classList.remove('custom-portal-open');
        
        // Ghost Portalの状態を確認
        const existingPortal = document.getElementById('ghost-portal-root');
        console.log('Existing portal check:', {
            exists: !!existingPortal,
            visible: existingPortal ? getComputedStyle(existingPortal).display !== 'none' : false
        });
        
        // 既存のPortalがある場合は一旦削除
        if (existingPortal) {
            console.log('Removing existing portal');
            existingPortal.remove();
        }
        
        // Ghost Portalの初期化を待つ
        let retryCount = 0;
        const maxRetries = 10;
        
        const waitForGhostPortal = () => {
            if (window.ghost && window.ghost.portal) {
                console.log('Ghost Portal API available, opening with plan');
                try {
                    window.ghost.portal.open({
                        page: 'signup',
                        plan: tierId,
                        cadence: currentPlanType
                    });
                    return;
                } catch (error) {
                    console.error('Ghost Portal API error:', error);
                }
            }
            
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Waiting for Ghost Portal... (${retryCount}/${maxRetries})`);
                setTimeout(waitForGhostPortal, 500);
            } else {
                console.log('Ghost Portal API not available, using fallback method');
                openPortalFallback();
            }
        };
        
        const openPortalFallback = () => {
            console.log('Using fallback method to open Ghost Portal');
            
            try {
                // Ghost標準のdata-portal要素をクリック
                const tempLink = document.createElement('a');
                tempLink.href = `#/portal/signup/${tierId}/${currentPlanType}/`;
                tempLink.setAttribute('data-portal', `signup/${tierId}/${currentPlanType}`);
                tempLink.style.position = 'absolute';
                tempLink.style.left = '-9999px';
                tempLink.style.visibility = 'hidden';
                
                document.body.appendChild(tempLink);
                
                // クリックイベントを発火
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                
                console.log('Dispatching click event for portal link with:', `signup/${tierId}/${currentPlanType}`);
                tempLink.dispatchEvent(clickEvent);
                
                // 要素をクリーンアップ
                setTimeout(() => {
                    if (document.body.contains(tempLink)) {
                        document.body.removeChild(tempLink);
                    }
                }, 2000);
                
            } catch (error) {
                console.error('Error in fallback method:', error);
                
                // 最終的なfallback: 単純なsignup画面を開く
                const fallbackLink = document.createElement('a');
                fallbackLink.href = '#/portal/signup/';
                fallbackLink.setAttribute('data-portal', 'signup');
                fallbackLink.style.display = 'none';
                document.body.appendChild(fallbackLink);
                fallbackLink.click();
                
                setTimeout(() => {
                    if (document.body.contains(fallbackLink)) {
                        document.body.removeChild(fallbackLink);
                    }
                }, 1000);
            }
        };
        
        // Ghost Portal APIを待つかfallbackを実行
        waitForGhostPortal();
        
    }, 300);
    
    return false;
}

function selectTier(tierId, tierType, tierName) {
    console.log('Tier selected:', tierId, tierType, tierName);
    
    // ラジオボタンを選択
    const radioButton = document.getElementById(`tier-${tierId}`);
    if (radioButton) {
        radioButton.checked = true;
        
        // 現在の支払いタイプ（月額・年額）を取得
        const currentPlanType = getCurrentPlanType();
        radioButton.setAttribute('data-members-plantype', currentPlanType);
        
        // 視覚的なフィードバック
        updateTierSelection(tierId);
        
        // プランボタンのスタイルを更新
        updateTierButtonStyles();
        
        // Ghost公式のメンバープラン設定
        const form = document.getElementById('signup-form');
        if (form) {
            form.setAttribute('data-members-plan', tierId);
        }
        
        console.log(`Tier ${tierId} (${tierType}) "${tierName}" selected with ${currentPlanType} billing`);
        
        // フォームの必須項目をチェックして、プランを選択した時点で送信
        submitFormWithPlan(tierId, tierType, tierName);
    }
}

function submitFormWithPlan(tierId, tierType, tierName) {
    const form = document.getElementById('signup-form');
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const termsCheckbox = document.getElementById('agree-terms');
    const errorDiv = document.getElementById('signup-error');
    
    // バリデーション
    let errors = [];
    
    if (!nameInput.value.trim()) {
        errors.push('お名前を入力してください。');
    }
    
    if (!emailInput.value.trim()) {
        errors.push('メールアドレスを入力してください。');
    } else if (!emailInput.value.includes('@')) {
        errors.push('有効なメールアドレスを入力してください。');
    }
    
    if (!termsCheckbox.checked) {
        errors.push('利用規約に同意してください。');
    }
    
    if (errors.length > 0) {
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = errors.join(' ');
        }
        return;
    }
    
    // エラーをクリア
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    
    console.log(`Submitting form with plan: ${tierName} (${tierId})`);
    
    // フォームを送信
    if (form) {
        // Ghostのネイティブ送信をトリガー
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
}

function togglePlanType(planType) {
    console.log('Plan type toggled to:', planType);
    
    // トグルボタンの見た目を更新
    const monthlyToggle = document.getElementById('monthly-toggle');
    const yearlyToggle = document.getElementById('yearly-toggle');
    
    if (planType === 'monthly') {
        monthlyToggle.style.background = '#ffffff';
        monthlyToggle.style.color = '#3eb0ef';
        monthlyToggle.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        yearlyToggle.style.background = 'transparent';
        yearlyToggle.style.color = '#738a94';
        yearlyToggle.style.boxShadow = 'none';
    } else {
        yearlyToggle.style.background = '#ffffff';
        yearlyToggle.style.color = '#3eb0ef';
        yearlyToggle.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        monthlyToggle.style.background = 'transparent';
        monthlyToggle.style.color = '#738a94';
        monthlyToggle.style.boxShadow = 'none';
    }
    
    // 価格表示を切り替え
    const allTiers = document.querySelectorAll('.tier-option');
    allTiers.forEach(tier => {
        const monthlyPrices = tier.querySelectorAll('.monthly-price');
        const yearlyPrices = tier.querySelectorAll('.yearly-price');
        
        if (planType === 'monthly') {
            monthlyPrices.forEach(el => el.style.display = 'block');
            yearlyPrices.forEach(el => el.style.display = 'none');
        } else {
            yearlyPrices.forEach(el => el.style.display = 'block');
            monthlyPrices.forEach(el => el.style.display = 'none');
        }
        
        // data-members-plantype を更新
        const radioButton = tier.querySelector('input[type="radio"]');
        if (radioButton) {
            radioButton.setAttribute('data-members-plantype', planType);
        }
        
        // data-portal属性を更新（有料プランのみ）
        const portalLink = tier.querySelector('a[data-portal]');
        if (portalLink) {
            const tierId = tier.getAttribute('data-tier-id');
            const newPortalValue = `signup/${tierId}/${planType}`;
            portalLink.setAttribute('data-portal', newPortalValue);
            console.log(`Updated data-portal to: ${newPortalValue}`);
        }
    });
    
    // プランボタンのスタイルを更新
    updateTierButtonStyles();
}

function updateTierButtonStyles() {
    const allTiers = document.querySelectorAll('.tier-option');
    allTiers.forEach(tier => {
        const selectButton = tier.querySelector('.tier-select-button');
        const monthlyPrice = tier.getAttribute('data-monthly-price');
        const yearlyPrice = tier.getAttribute('data-yearly-price');
        const tierName = tier.getAttribute('data-tier-name');
        const currentPlanType = getCurrentPlanType();
        
        if (selectButton) {
            // ボタンスタイルをリセット
            selectButton.className = 'custom-portal-button tier-select-button';
            
            // プランタイプに応じてスタイルを適用
            const hasPrice = (currentPlanType === 'monthly' && monthlyPrice && monthlyPrice > 0) || 
                           (currentPlanType === 'yearly' && yearlyPrice && yearlyPrice > 0);
                           
            if (hasPrice) {
                // 有料プラン: プライマリスタイル
                selectButton.classList.add('custom-portal-button-primary');
            } else {
                // 無料プラン: グレースタイル
                selectButton.style.background = '#f1f3f4';
                selectButton.style.color = '#738a94';
            }
        }
    });
}

function getCurrentPlanType() {
    const yearlyToggle = document.getElementById('yearly-toggle');
    return yearlyToggle && yearlyToggle.classList.contains('bg-white') ? 'yearly' : 'monthly';
}

function updateTierSelection(selectedTierId) {
    const allTiers = document.querySelectorAll('.tier-option');
    allTiers.forEach(tier => {
        const currentTierId = tier.getAttribute('data-tier-id');
        
        if (currentTierId === selectedTierId) {
            // 選択状態
            tier.style.borderColor = '#3eb0ef';
            tier.style.backgroundColor = '#f8fcff';
        } else {
            // 非選択状態
            tier.style.borderColor = '#e5eff5';
            tier.style.backgroundColor = 'transparent';
        }
    });
}

function initializeFormState() {
    // デフォルトで年額プランを選択状態にする
    const yearlyToggle = document.getElementById('yearly-toggle');
    if (yearlyToggle && yearlyToggle.classList.contains('bg-white')) {
        // 年額が既に選択されている場合は何もしない
        return;
    }
    
    // 最初に選択されているTierを視覚的に更新
    const firstCheckedTier = document.querySelector('input[name="data-members-plan"]:checked');
    if (firstCheckedTier) {
        const tierId = firstCheckedTier.value;
        updateTierSelection(tierId);
    }
    
    // プランボタンのスタイルを初期化
    updateTierButtonStyles();
    
    // プラン切り替えハンドラーを設定
    setupPlanSwitchHandlers();
}

function setupPlanSwitchHandlers() {
    // Tier選択のラジオボタンにイベントリスナーを追加
    const tierRadios = document.querySelectorAll('input[name="data-members-plan"]');
    tierRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const tier = this.closest('.tier-option');
                const tierId = tier.getAttribute('data-tier-id');
                const tierType = tier.getAttribute('data-tier-type');
                const tierName = tier.getAttribute('data-tier-name');
                
                updateTierSelection(tierId);
                updateTierButtonStyles();
                
                // Ghost公式設定
                const form = document.getElementById('signup-form');
                if (form) {
                    form.setAttribute('data-members-plan', tierId);
                }
                
                console.log(`Tier changed to: ${tierName} (${tierId})`);
            }
        });
    });
}

// DOMContentLoaded時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // カスタムポータルの準備完了
    window.customPortalReady = true;
    
    // Ghost Portalのイベントリスナーを追加
    document.addEventListener('portal-ready', function(event) {
        console.log('Portal ready event:', event);
        // ユーザーデータがある場合はPortalに設定
        if (window.ghost && window.ghost.userData) {
            console.log('Setting user data to portal:', window.ghost.userData);
            event.detail.portal.setMemberData(window.ghost.userData);
        }
    });
    
    // 初期状態の設定（年額プランがデフォルト）
    initializeFormState();
    // フォーム送信処理
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        // Ghostのネイティブ処理を使用しつつ、独自のハンドリングも追加
        signupForm.addEventListener('submit', function(e) {
            console.log('Form submitted - using Ghost native Members handling');
            
            // 利用規約チェックのバリデーション
            const termsCheckbox = document.getElementById('agree-terms');
            const errorDiv = document.getElementById('signup-error');
            
            if (termsCheckbox && !termsCheckbox.checked) {
                e.preventDefault();
                if (errorDiv) {
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = '利用規約に同意してください。';
                }
                return false;
            }
            
            // 選択されたTierを取得
            const selectedTier = document.querySelector('input[name="data-members-plan"]:checked');
            if (selectedTier) {
                const tierId = selectedTier.value;
                const tierType = selectedTier.getAttribute('data-members-plantype');
                console.log('Selected tier:', tierId, tierType);
                
                // Ghost公式のdata属性を設定
                signupForm.setAttribute('data-members-plan', tierId);
            }
            
            // エラーメッセージをクリア
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
            
            const submitButton = document.getElementById('signup-submit');
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
                
                const successDiv = document.getElementById('signup-success');
                if (successDiv) {
                    successDiv.style.display = 'block';
                    successDiv.textContent = '確認メールをお送りしました。メールをご確認ください。';
                }
            }, 5000);
        });
        
        // Ghostのネイティブイベントリスナーを追加
        // Ghost公式のMembers イベントリスナー
        signupForm.addEventListener('memberSignup', function(e) {
            console.log('Member signup event:', e);
            const successDiv = document.getElementById('signup-success');
            if (successDiv) {
                successDiv.style.display = 'block';
                successDiv.textContent = '登録が完了しました。確認メールをお送りしましたので、ご確認ください。';
            }
        });
    }
    
    // モーダル外クリックで閉じる
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSignupModal();
            }
        });
    }
    
    // signup-form.js専用のクリックハンドリングは削除
    // default.hbsで統合管理する
});

