/**
 * signup-paid.js
 *
 * - 有料プラン登録完了メールテンプレート
 *
 */
const subjects = require('./subjects');

module.exports = ({ userName, planName, amount, nextRenewalDate, siteTitle, siteUrl}) => `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>【${siteTitle}】有料プランお申し込みありがとうございます</title>
  </head>
  <body>
    <p>${userName}様</p>
    <p>
      この度は、${siteTitle}の有料プランにお申し込みいただき、誠にありがとうございます。<br>
      お手続きが完了し、有料プランの全機能がご利用いただけるようになりました。
    </p>
    <p>
      ■ご登録内容<br>
      プラン名： ${planName}<br>
      お支払い金額： ${amount}円<br>
      次回更新日： ${nextRenewalDate}
    </p>
    <p>
      ご登録内容の確認や変更は、マイページから行えます。
    </p>
    <p>
      ▼マイページはこちら<br>
       <a href="${siteUrl}/account">${siteUrl}/account</a>
    </p>
    <p>
      今後とも${siteTitle}をよろしくお願いいたします。
    </p>
    <hr>
    <p>
      ${siteTitle}運営事務局<br>
      <a href="${siteUrl}">${siteUrl}</a>
    </p>
    <p>
      ※ このメールはシステムにより自動送信されています。ご返信いただいても対応できませんのでご了承ください。<br>
      ※ ご不明な点がございましたら、以下のお問い合わせフォームよりご連絡ください。<br>
      <a href="${siteUrl}/contact">${siteUrl}/contact</a>
    </p>

  </body>
</html>
`;

