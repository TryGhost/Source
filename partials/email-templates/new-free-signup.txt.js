/**
 * new-free-signup.txt.js
 * new-free-signup.hbsとセット
 *
 * - 無料会員登録完了メールテンプレート
 *　
 */

const subjects = require('./subjects');

module.exports = function (data) {
    return `
${data.memberData.name}様

この度は、${data.siteTitle}に会員登録いただき、誠にありがとうございます。
お客様のアカウント登録が正常に完了いたしました。

早速ログインして、${data.siteTitle}の様々なコンテンツをお楽しみください。

▼ログインはこちらから
${data.siteUrl}/login


${data.siteTitle}運営事務局
${data.siteDomain}
※ このメールはシステムにより自動送信されています。ご返信いただいても対応できませんのでご了承ください。
※ ご不明な点がございましたら、以下のお問い合わせフォームよりご連絡ください。
${data.siteUrl}/contact
    `;
};

