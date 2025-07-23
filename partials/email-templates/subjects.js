/**
 * subjects.js
 *
 * - メールの件名を管理
 * - 変数を追加したら、module.exportsに追加すること
 *
 * 
 */

const signin = () => {
    return '【マガコフード】ログインリンクのお知らせ';
};

const signup = () => {
    return '【マガコフード】ご登録ありがとうございます（メールアドレスの確認）';
};

// -----(module.exports)----------------------------
module.exports = {
    signin,
    signup,
};