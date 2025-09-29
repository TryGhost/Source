# メールテンプレートのカスタマイズの方法（暫定対応）

メールテンプレートをカスタマイズしたい場合は、下記の表に従い、”メールテンプレートカスタマイズ用ファイル名”のファイルを配置する。

- 配置先：`ghost/core/content/themes/source/partials/email-templates/`

また、メールの件名をカスタマイズしたい場合は、下記の表に従い、以下のファイルに”メール件名カスタマイズ用変数名”を追加する。

- メール件名カスタマイズ用ファイル：`ghost/core/content/themes/source/partials/email-templates/subjects.js`
- `subjects.js`サンプル

  ```jacascrpt
  const signin = () => {
      return 'ログインのご案内';
  };

  const subscribe = () => {
      return 'サブスクリプション登録の確認';
  };

  const signup = () => {
      return '新規登録のご案内';
  };

  const signupPaid = () => {
      return 'ご登録いただきありがとうございます';
  };

  const updateEmail = () => {
      return 'メールアドレスのご確認';
  };

  /**
  * Generates a subject for a new comment email.
  *
  * @param {string} postTitle - The title of the post.
  * @returns {string} The subject for the new comment email.
  */
  const newComment = ({postTitle}) => {
      return `${postTitle}に新しいコメントがありました`;
  };

  /**
  * Generates a subject for a new comment reply email.
  *
  * @param {string} postTitle - The title of the post.
  * @returns {string} The subject for the new comment reply email.
  */
  const newCommentReply = ({postTitle}) => {
      return `${postTitle}に返信コメントがつきました`;
  };

  /**
  * Generates a subject for a report email.
  *
  * @param {string} postTitle - The title of the post.
  * @returns {string} The subject for the report email.
  */
  const report = ({postTitle}) => {
      return `${postTitle}に報告があります`;
  };

  /**
  * Generates a subject for a newsletter email.
  *
  * @param {string} postTitle - The title of the post.
  * @returns {string} The subject for the newsletter email.
  */
  const newsletter = ({postTitle}) => {
      return `${postTitle}が配信されたました`;
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
  ```

## カスタマイズできるメールテンプレートとファイル名

| 役割                                       | メールテンプレートカスタマイズ元ファイルパス                                   | メールテンプレートカスタマイズ用ファイル名         | メール件名カスタマイズ用変数名 |
| ------------------------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------- | ------------------------------ |
| サインイン時のメールアドレス認証           | ghost/core/core/server/services/members/emails/signin.js                       | partials/email-templates/signin.js                 | signin                         |
| 無料サインアップ時のメールアドレス認証     | ghost/core/core/server/services/members/emails/signup.js                       | partials/email-templates/signup.js                 | signup                         |
| 有料サインアップ時のメールアドレス認証     | ghost/core/core/server/services/members/emails/signup-paid.js                  | partials/email-templates/signup-paid.js            | signupPaid                     |
| サブスク登録時のサンクスメール             | ghost/core/core/server/services/members/emails/subscribe.js                    | partials/email-templates/subscribe.js              | subscribe                      |
| メールアドレス更新時の確認                 | ghost/core/core/server/services/members/emails/update-email.js                 | partials/email-templates/update-email.js           | updateEmail                    |
| Post に新しいコメントが付いたときの通知    | ghost/core/core/server/services/comments/email-templates/new-comment.hbs       | partials/email-templates/new-comment.hbs           | newComment                     |
| コメントに新しいリプライが付いたときの通知 | ghost/core/core/server/services/comments/email-templates/new-comment-reply.hbs | partials/email-templates/new-comment-reply.hbs     | newCommentReply                |
| 報告されたコメントがあったときの通知       | ghost/core/core/server/services/comments/email-templates/report.hbs            | partials/email-templates/report.hbs                | report                         |
| Post が投稿されたときの通知                | ghost/email-service/lib/email-templates/template.hbs                           | partials/email-templates/newsletter.hbs            | newsletter                     |
| 一時的な寄付を受けたときの通知（推測）     | ghost/staff-service/lib/email-templates/donation.hbs                           | partials/email-templates/donation.hbs              | donation                       |
| 新規の無料サインアップがあったときの通知   | ghost/staff-service/lib/email-templates/new-free-signup.hbs                    | partials/email-templates/new-free-signup.hbs       | newFreeSignup                  |
| 新規の有料サインアップがあったときの通知   | ghost/staff-service/lib/email-templates/new-paid-started.hbs                   | partials/email-templates/new-paid-started.hbs      | newPaidStarted                 |
| 有料メンバーが解約したときの通知           | ghost/staff-service/lib/email-templates/new-paid-cancellation.hbs              | partials/email-templates/new-paid-cancellation.hbs | newPaidCancellation            |

## 作業フロー

### メールテンプレートのカスタマイズ

1. カスタマイズしたいメールテンプレートを表から確認する
2. 表のカスタマイズ元ファイルディレクトリとファイル名から、元ファイルを特定する
3. 元ファイルをカスタマイズ用ファイル名で、`ghost/core/content/themes/source/partials/email-templates/`配下にコピーする
4. コピーしたファイルを編集し、保存する

### メール件名のカスタマイズ

1. `partials/email-templates/subjects.js`を作成する
2. 表の「メール件名カスタマイズ用」を確認する
3. `partials/email-templates/subjects.js`に変数名を追加する（サンプル参照）

注意:

- カスタマイズ時に使える helper や引数は、元のファイルを参照すること。基本的に元ファイルで使われていないものは使えないです。
- どうしても元ファイルで使われていない helper や引数を使用したい場合は、開発に相談してください。
