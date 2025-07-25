/**
 * new-paid-cancellation.txt.js
 * new-paid-cancellation.hbsとセット
 *
 * - 有料プラン解約完了メールテンプレート
 *
 */

const subjects = require('./subjects');


module.exports = function (data) {
    // Be careful when you indent the email, because whitespaces are visible in emails!
    return `
${data.memberData.name}様

${data.siteTitle}の有料プラン解約手続きが完了いたしましたので、お知らせいたします。
これまでご利用いただき、誠にありがとうございました。

お客様の有料プランは ${data.cancellationDate} までご利用いただけます。
期限日を過ぎますと、自動的に無料会員へ移行となります。

無料会員として、引き続き一部のコンテンツをお楽しみいただけます。
またのご利用を心よりお待ちしております。

---
${data.siteTitle}運営事務局
${data.siteUrl}/

※ このメールはシステムにより自動送信されています。ご返信いただいても対応できませんのでご了承ください。
※ この手続きにお心当たりがない場合は、お手数ですが至急お問い合わせフォームよりご連絡ください。
${data.siteUrl}/contact
    `;
};

