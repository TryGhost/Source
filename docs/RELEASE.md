# リリース作業

本番環境へのリリース作業

&nbsp;

## 環境情報

- Staging：<https://test.yuta-watanabe.com/>
- Production：<https://yuta-watanabe.com/>

## 一度きりの作業

### Pagesの作成

本番環境のGhost Adminにログインし、以下の通りにPagesを設定する

- Aboutページ
  - タイトル: About
  - コンテンツ: 要求のとおりに設定
  - Page URL: about
  - Tags: 空欄
  - Page access: Public
  - Excerpt: 空欄
  - Authors: 誰でも
  - Meta data: meta情報の設定を参考

- Airticlesページ
  - タイトル: Airticles
  - コンテンツ: 空欄
  - Page URL: airticles
  - Tags: 空欄
  - Page access: Public
  - Excerpt: 空欄
  - Authors: 誰でも
  - Meta data: meta情報の設定を参考

- Galleryページ
  - タイトル: Gallery
  - コンテンツ: 要求のとおりに設定
    - 部員への限定公開部分はpublic previewブロックを差し込む
  - Page URL: gallery
  - Tags: 空欄
  - Page access: 任意のアクセスを設定する
  - Excerpt: 空欄
  - Authors: 誰でも
  - Meta data: meta情報の設定を参考

- Q&Aページ
  - タイトル: Q&A
  - コンテンツ: 空欄
  - Page URL: questions-and-answers
  - Tags: 空欄
  - Page access: Public
  - Excerpt: 空欄
  - Authors: 誰でも
  - Meta data: meta情報の設定を参考

### meta情報の設定

本番環境のGhost Adminにログインし、以下の通りにmeta情報を設定する

- Homeページにtitleとdescriptionを設定
  - Ghost Admin > Setting > General settings > Meta data
    - Meta title: Locker Room | 渡邊雄太公式ファンコミュニティ
    - Meta description: 渡邊雄太公式ファンコミュニティ「Locker Room」は、NBAでのプレー経験や自信がバスケットボールと向き合ってきた考え方の発信など、ファンの方々にYutaをもっと知ってもらい、交流できる場を目指しています。
- 各Pagesにtitleとdescriptionを設定
  - Airticlesページ
    - Meta title: Locker Room 記事 | 渡邊雄太公式ファンコミュニティ
    - Meta description: 渡邊雄太公式ファンコミュニティ「Locker Room」は、NBAでのプレー経験や自信がバスケットボールと向き合ってきた考え方の発信など、ファンの方々にYutaをもっと知ってもらい、交流できる場を目指しています。
  - Aboutページ
    - Meta title: このサイトについて | 渡邊雄太公式ファンコミュニティ
    - Meta description: 渡邊雄太公式ファンコミュニティ「Locker Room」は、NBAでのプレー経験や自信がバスケットボールと向き合ってきた考え方の発信など、ファンの方々にYutaをもっと知ってもらい、交流できる場を目指しています。
  - Galleryページ
    - Meta title: Locker Room ギャラリー | 渡邊雄太公式ファンコミュニティ
    - Meta description: 渡邊雄太公式ファンコミュニティ「Locker Room」は、NBAでのプレー経験や自信がバスケットボールと向き合ってきた考え方の発信など、ファンの方々にYutaをもっと知ってもらい、交流できる場を目指しています。
  - Q&Aページ
    - Meta title: 確認中
    - Meta description: 確認中
- 各Postにtitleとdescriptionを設定
  - Meta title、Meta descriptionともにコンテンツ管理者が設定する
- faviconを設定
  - Ghost Admin > Setting > Site > Design & branding > Customize > Brandタブ > Publication icon に検証環境と同じ画像をアップロード
- OGP画像を設定
  - Ghost Admin > Setting > Site > Design & branding > Customize > Brandタブ > Publication cover に検証環境と同じ画像をアップロード
- htmlのLanguageをjaに変更
  - Ghost Admin > Setting > General settings > Publication Language

### サインイン、サインアップ設定

1. アクセントカラーを設定
    - Ghost Admin > Setting > Site > Design & branding > Customize > Brandタブ > Accent color > `2b2b2b`を設定

2. デザインを設定
    - Ghost Admin > Setting > Membership > Portal settings
      - Signup Options
        - Display name in signup form: off
      - Look & feel
        - Show portal button: off

### サブスクリプション設定

1. Stripeアカウントと連携
    - Ghost Admin > Setting > Membership > Tiers > Connect with Stripe からStripeと連携 ref: [Stripe + Ghost](https://ghost.org/integrations/stripe/)

2. Planを作成
    - Ghost Admin > Setting > Membership > Tiers > 「＋」から追加
    - 検証環境を確認し、同じように設定

3. デザインを修正
    - Ghost Admin > Setting > Membership > Portal settings > Signup Options
      - Tiers available at signupのBASIC PLANとPREMIUM PLANのみチェック
      - Prices available at signupMonthlyにのみチェック

4. アクセスを設定
    - Ghost Admin > Setting > Membership > Access > Subscription access > Anyone can signupを選択

### コメント機能

1. アクセスを設定
    - Ghost Admin > Setting > Membership > Access > Commenting > Paid-members onlyを選択

### Q&A機能の設定

- Coveを用意する
  1. [cove](https://cove.chat/)にアクセス
  2. アカウントを作成する（クレジットカード登録なしで2週間無料で使用できますが、追ってカードの登録をお願いいたします）
     1. メールアドレスを入力
     2. 任意のCoveアカウント名を入力
  3. GhostにCoveを適用する
     1. Ghost Content API Key を入力
        1. Ghostの管理画面を開く > settings > Advanced > Add custom integrationを選択
        2. 任意の名前を入力（例：cove）
        3. Content API key をコピーして Coveのアカウントに貼り付ける
     2. Ghost API URL / Ghost site URL を入力
        1. 同様に API URLをコピーして Coveのアカウントに貼り付ける
     3. Ghost Admin API Key を入力
        1. 同様に Admin API key をコピーして Coveのアカウントに貼り付ける
  4. Coveでコメントの設定を変更する
     1. [Comment settings](https://app.cove.chat/comments/settings/) に移動
     2. Show branding = No
     3. Show Cove branding in automated emails = No
     4. Post = 質問する
     5. Leave your comment / Leave the first comment = ここに質問を140文字以内で入力してください。
     6. Save settings で変更を適用する
- Q&Aページを用意する
  1. Ghost 管理画面にアクセス > Pages > New page
  2. title = Q&A, Page URL = questions-and-answers でページを作成する（コンテンツは何も入れなくてOK）
  3. settings > navigation で Primary に Q&A / <http://localhost:2368/questions-and-answers/> でナビゲーションを追加

- Q&Aのタグを用意する
  1. Ghost 管理画面にアクセス > Tags > New tag
  2. Name = Q&A, sLug = qa でタグを作成する
  3. 適当な記事にQ&Aのタグをつける（タグが記事に紐づいていないと「最新のQ&Aを見る」を押すと404になる）

- 注意事項
  - Coveは月額が発生するプランでの実装になります
    - 検証環境と本番環境でアカウントを分けると上記費用が両環境にかかりますので、同一のCoveアカウントでの実装を推奨いたします
    - その際、検証環境でテスト送信した場合、本番環境のユーザーのQ＆Aが同一管理下になりますのでご注意ください

## 毎回の作業

### 1. テーマzipファイルのアップロード

1. 検証環境のGhost Adminにログインし、テーマファイルを確認する
    - Ghost Admin > Setting > Site > Design & branding > Customize > Change theme > Installed
2. yw-japanese-theme-prod.zipをダウンロードする
    - yw-japanese-theme-stg.zip・・・検証環境
    - yw-japanese-theme-prod.zip・・・本番環境
3. ダウンロードしたファイルを本番環境にアップロードする
    - Ghost Admin > Setting > Site > Design & branding > Customize > Change theme > Upload theme

### 2. Navigationの設定を確認

1. リリース用のPRを参照し、設定するNavigationを確認する
    - [PRリスト](https://github.com/magaport/ghost-support/pulls?q=is:pr+is:closed)からリリース用のPullRequestを探す（例：20240913リリース）

2. 本番環境のGhost Adminにログインし、設定を反映する
    - Ghost Admin > Setting > Site > Navigation > Customize

### 3. routes.yaml を更新

1. リリース用のPRを参照し、設定するroutes.yamlを確認する
    - [PRリスト](https://github.com/magaport/ghost-support/pulls?q=is:pr+is:closed)からリリース用のPullRequestを探す（例：20240913リリース）

2. 本番環境のGhost Adminにログインし、routes.yamlをアップロードする
   - Ghost Admin > Setting > Advanced > Labs > Openをクリック > Routes > Upload routes.yaml
