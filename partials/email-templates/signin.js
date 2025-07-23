/**
 * signin.js
 *
 * - パスワードレスログイン時のマジックリンクメール
 *
 */

const subjects = require('./subjects');


module.exports = ({ t, email, url, siteTitle, siteUrl }) => `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>${t('{siteTitle} へのログインリンクのお知らせ', { siteTitle, interpolation: { escapeValue: false } })}</title>
  </head>
  <body style="font-family: sans-serif; font-size: 14px; color: #000; line-height: 1.6;">
    <p>${t('{siteTitle} へのログインリクエストを受け付けました。', { siteTitle, interpolation: { escapeValue: false } })}</p>

    <p>以下のリンクをクリックしてログインしてください。</p>

    <p><strong>▼ログイン用リンク</strong><br>
    <a href="${url}">${url}</a></p>

    <p>このリンクの有効期限は15分です。<br>
    有効期限が切れた場合は、お手数ですが再度ログイン手続きをお願いいたします。</p>

    <hr>

    <p>${t('{siteTitle} 運営事務局', { siteTitle, interpolation: { escapeValue: false } })}<br>
    <a href="${siteUrl}">${siteUrl}</a></p>

    <p style="font-size: 12px; color: #666;">
      ※ このメールはシステムにより自動送信されています。ご返信いただいても対応できませんのでご了承ください。<br>
      ※ このメールにお心当たりがない場合は、第三者が誤ってあなたのメールアドレスを入力した可能性があります。<br>
      お手数ですが本メールを破棄していただきますようお願いいたします。<br>
      ※ ご不明な点がございましたら、以下のお問い合わせフォームよりご連絡ください。<br>
      <a href="${siteUrl}/contact">${siteUrl}/contact</a>
    </p>
  </body>
</html>
`;

