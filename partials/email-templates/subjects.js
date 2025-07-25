/**
 * subjects.js
 *
 * - メールの件名を管理
 * - 変数を追加したら、module.exportsに追加すること
 *
 * 
 */

const { setDefaultResultOrder } = require("dns");
const siteTitle = 'マガコフード';


// パスワードレスログイン時のマジックリンクメール
const signin = () => {
    return `【${siteTitle}】ログインリンクのお知らせ`;
};

// ユーザー登録時の確認メール／ウェルカムメール	signup
const signup = () => {
    return `【${siteTitle}】ご登録ありがとうございます（メールアドレスの確認）`;
};

// 無料会員登録完了メール new-free-signup.txt.js
const newFreeSignup = () => {
    return `【${siteTitle}】会員登録ありがとうございます`;
};

// 有料プラン登録完了メール	signup-paid.js
const signupPaid = () => {
    return `【${siteTitle}】有料プランへのお申し込みありがとうございます`;
};

// 有料プラン解約完了メール	new-paid-cancellation.txt.js
const newPaidCancellation = () => {
    return `【${siteTitle}】有料プランの解約手続きが完了しました`;
};

//実装予定
// (CMSユーザー向け) パスワードリセットメール：【マガコフード CMS】パスワード再設定のご案内
// (CMSユーザー向け) スタッフ招待メール：　　　【マガコフード CMS】スタッフへのご招待
// 有料プラン更新確認メール：　　　　　　　　　【マガコフード】有料プランが更新されました
// 有料プラン更新失敗通知メール：　　　　　　　【マガコフード】有料プランの更新ができませんでした
// 無料トライアル開始通知メール：            【マガコフード】無料トライアルへようこそ
// 無料トライアル終了間近通知メール：　　　　　【マガコフード】無料トライアル期間まもなく終了のお知らせ
// 無料トライアル終了通知メール：　　　　　　【マガコフード】無料トライアルが終了し、有料プランへ移行しました

// -----(module.exports)----------------------------
module.exports = {
    signin,
    signup,
    signupPaid,
    newPaidCancellation,
    newFreeSignup,
};