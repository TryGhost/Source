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

// 有料プラン登録完了メール	signup-paid.js
const signupPaid = () => {
    return `【${siteTitle}】有料プランへのお申し込みありがとうございます`;
};

// -----(module.exports)----------------------------
module.exports = {
    signin,
    signup,
    signupPaid,
};