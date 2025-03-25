/**
 * Generates an HTML email template for a subscribe link.
 *
 * @param {Function} t - The template function.
 * @param {string} siteTitle - The title of the site.
 * @param {string} email - The email address of the recipient.
 * @param {string} url - The subscribe URL.
 * @param {string} [accentColor='#15212A'] - The accent color for the email template.
 * @param {string} siteDomain - The domain of the site.
 * @param {string} siteUrl - The URL of the site.
 * @returns {string} The generated HTML email template.
 */

module.exports = ({url, accentColor = '#15212A'}) => `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- 件名を日本語に変更 -->
    <title>メールアドレスご確認のご案内【Locker Room │ 渡邊雄太公式ファンコミュニティ】</title>
    <style>
    /* -------------------------------------
        RESPONSIVE AND MOBILE FRIENDLY STYLES
    ------------------------------------- */
    @media only screen and (max-width: 620px) {
      table[class=body] h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }
      table[class=body] p,
      table[class=body] ul,
      table[class=body] ol,
      table[class=body] td,
      table[class=body] span,
      table[class=body] a {
        font-size: 16px !important;
      }
      table[class=body] .wrapper,
      table[class=body] .article {
        padding: 10px !important;
      }
      table[class=body] .content {
        padding: 0 !important;
      }
      table[class=body] .container {
        padding: 0 !important;
        width: 100% !important;
      }
      table[class=body] .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }
      table[class=body] .btn table {
        width: 100% !important;
      }
      table[class=body] .btn a {
        width: 100% !important;
      }
      table[class=body] .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
      table[class=body] p[class=small],
      table[class=body] a[class=small] {
        font-size: 11px !important;
      }
    }
    /* -------------------------------------
        PRESERVE THESE STYLES IN THE HEAD
    ------------------------------------- */
    @media all {
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      .recipient-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
    }
    hr {
      border-width: 0;
      height: 0;
      margin-top: 34px;
      margin-bottom: 34px;
      border-bottom-width: 1px;
      border-bottom-color: #EEF5F8;
    }
    a {
      color: #3A464C;
    }
    </style>
  </head>
  <body style="background-color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; width: 100%; background-color: #FFFFFF;">
      <tr>
        <td style="font-size: 14px; vertical-align: top;">&nbsp;</td>
        <td class="container" style="font-size: 14px; vertical-align: top; display: block; margin: 0 auto; max-width: 540px; padding: 10px; width: 540px;">
          <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 30px 20px;">

            <!-- START CENTERED WHITE CONTAINER -->
            <!-- プレヘッダー（非表示テキスト） 不要であれば削除可能 -->
            <span class="preheader" style="display: none; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
              メールアドレスのご確認について
            </span>

            <table class="main" style="border-collapse: separate; width: 100%; background: #ffffff; border-radius: 8px;">

              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper" style="font-size: 14px; vertical-align: top; box-sizing: border-box;">
                  <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                    <tr>
                      <td style="font-size: 14px; vertical-align: top;">

                        <!-- ここから本文を差し替え -->
                        <p style="font-size: 16px; color: #3A464C; line-height: 1.8; margin: 0; margin-bottom: 24px;">
                          Locker Room │ 渡邊雄太公式ファンコミュニティです。<br><br>
                          入部（登録）を完了させるために、下記URLをクリックいただき<br>
                          メールアドレスの確認を完了させてください。
                        </p>

                        <!-- ボタン部分 -->
                        <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="width: 100%;">
                          <tbody>
                            <tr>
                              <td align="left" style="padding-bottom: 35px;">
                                <table border="0" cellpadding="0" cellspacing="0" style="width: auto;">
                                  <tbody>
                                    <tr>
                                      <!-- ボタンの色は accentColor を使用。変更したい場合は適宜修正 -->
                                      <td style="background-color: ${accentColor}; border-radius: 5px; text-align: center;">
                                        <a href="${url}" target="_blank"
                                          style="display: inline-block; color: #ffffff; background-color: ${accentColor}; border: solid 1px ${accentColor}; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 16px; margin: 0; padding: 9px 22px; font-weight: normal;">
                                          メールアドレスを確認する
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p style="font-size: 16px; color: #3A464C; line-height: 1.8; margin: 0; margin-bottom: 16px;">
                          以下のURLをブラウザにコピー＆ペーストいただくことでも確認が可能です。<br>
                          ${url}
                        </p>

                        <p style="font-size: 16px; color: #3A464C; line-height: 1.8; margin: 0; margin-bottom: 24px;">
                          ※確認用URLの有効期限は24時間です。24時間以内に確認が行われない場合には、もう一度初めから手続きをおこなってください。
                        </p>

                        <p style="font-size: 16px; color: #3A464C; line-height: 1.8; margin: 0; margin-bottom: 24px;">
                          ※このメールはご入力されたメールアドレスへ自動送信しております。お心当たりがない場合は本メールを削除してください。
                        </p>

                        <hr style="border-width: 0; margin: 24px 0; border-bottom: 1px solid #EEF5F8;">

                        <!-- 運営元情報 -->
                        <p style="font-size: 14px; color: #3A464C; margin: 0; margin-bottom: 4px;">
                          Locker Room │ 渡邊雄太公式ファンコミュニティ
                        </p>
                        <p style="font-size: 14px; color: #3A464C; margin: 0; margin-bottom: 24px;">
                          <a href="https://yuta-watanabe.com/" style="color: #3A464C; text-decoration: underline;">
                            https://yuta-watanabe.com/
                          </a>
                        </p>

                        <hr style="border-width: 0; margin: 24px 0; border-bottom: 1px solid #EEF5F8;">

                        <p style="font-size: 14px; color: #3A464C; line-height: 1.8; margin: 0;">
                          ※本メールは送信専用アドレスから自動送信されています。本メールにご返信いただきましても、対応いたしかねます。
                        </p>
                        <!-- ここまで本文の差し替え -->

                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- END MAIN CONTENT AREA -->
            </table>
            <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td style="font-size: 14px; vertical-align: top;">&nbsp;</td>
      </tr>
    </table>
  </body>
</html>
`;