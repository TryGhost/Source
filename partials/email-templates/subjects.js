const signin = () => {
    return 'ログインリンクのご案内【Locker Room │ 渡邊雄太公式ファンコミュニティ】';
};

const subscribe = () => {
    return 'サブスクリプション登録の確認【Locker Room │ 渡邊雄太公式ファンコミュニティ】';
};

const signup = () => {
    return '入部（登録）のご案内【Locker Room │ 渡邊雄太公式ファンコミュニティ】';
};

const signupPaid = () => {
    return '入部（登録）いただきありがとうございます【Locker Room │ 渡邊雄太公式ファンコミュニティ】';
};

const updateEmail = () => {
    return 'メールアドレスを確認してください【Locker Room │ 渡邊雄太公式ファンコミュニティ】';
};

/**
 * Generates a subject for a new comment email.
 *
 * @param {string} postTitle - The title of the post.
 * @returns {string} The subject for the new comment email.
 */
const newComment = ({postTitle}) => {
    return `${postTitle}に新しいコメントがありました【Locker Room │ 渡邊雄太公式ファンコミュニティ】`;
};

/**
 * Generates a subject for a new comment reply email.
 *
 * @param {string} postTitle - The title of the post.
 * @returns {string} The subject for the new comment reply email.
 */
const newCommentReply = ({postTitle}) => {
    return `「${postTitle}」に返信コメントがつきました【Locker Room │ 渡邊雄太公式ファンコミュニティ】`;
};

/**
 * Generates a subject for a report email.
 *
 * @param {string} postTitle - The title of the post.
 * @returns {string} The subject for the report email.
 */
const report = ({postTitle}) => {
    return `「${postTitle}」に関する報告【Locker Room │ 渡邊雄太公式ファンコミュニティ】`;
};

/**
 * Generates a subject for a newsletter email.
 *
 * @param {string} postTitle - The title of the post.
 * @returns {string} The subject for the newsletter email.
 */
const newsletter = ({postTitle}) => {
    return `${postTitle} 【Locker Room │ 渡邊雄太公式ファンコミュニティ】`;
};

module.exports = {
    signin,
    subscribe,
    signup,
    signupPaid,
    updateEmail,
    newComment,
    newCommentReply,
    report,
    newsletter
};