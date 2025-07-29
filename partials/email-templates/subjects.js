const siteTitle = 'マガコフード';

// パスワードレスログイン時のマジックリンクメール
const signin = () => {
    return `【${siteTitle}】ログインリンクのお知らせ`;
};

// ユーザー登録時の確認メール／ウェルカムメール（無料ユーザー）
const signup = () => {
    return `【${siteTitle}】ご登録ありがとうございます（メールアドレスの確認）`;
};

// ユーザー登録時の確認メール／ウェルカムメール（有料ユーザー）
const signupPaid = () => {
    return `【${siteTitle}】ご登録ありがとうございます（メールアドレスの確認）`;
};

// -----(module.exports)----------------------------
module.exports = {
    signin,
    signup,
    signupPaid,
};
