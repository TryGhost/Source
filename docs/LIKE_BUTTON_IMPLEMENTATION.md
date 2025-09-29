# Ghost テーマ「いいねボタン」実装ガイド

※yw-japanese や magaco-foods での実装を参考にすること

## 概要

Ghost テーマに「いいねボタン」機能を実装するための手順書です。この機能により、会員ユーザーが記事に「いいね」を付けて、お気に入りの記事を管理できるようになります。

## 必要なファイル

### 1. JavaScript ファイル (`assets/js/post-like.js`)

いいねボタンの動作を制御する JavaScript ファイルです。以下の機能を提供します：

- Ghost Content API を使用したいいね情報の取得・追加・削除
- ボタンクリック時の UI 更新
- ページ読み込み時の状態初期化

### 2. Handlebars コンポーネント (`partials/components/post-like.hbs`)

いいねボタンの UI コンポーネントです。SVG アイコンとボタン要素で構成されています。

### 3. メインテンプレートへの組み込み (`post.hbs`)

記事詳細ページでいいねボタンコンポーネントを配置します。

## 実装手順

### ステップ 1: JavaScript ファイルの配置

`assets/js/post-like.js` ファイルを作成し、いいねボタンの機能を実装します。このファイルは以下の処理を行います：

- **API 通信機能**

  - `getPostLike()`: 記事のいいね情報を取得
  - `addPostLike()`: いいねを追加
  - `removePostLike()`: いいねを削除

- **UI 制御機能**
  - `initializeLikeButtonUI()`: ページ読み込み時にボタンの状態を初期化
  - `handleLikeButtonClick()`: ボタンクリック時の処理

### ステップ 2: ビルドプロセスへの組み込み

`gulpfile.js` の JavaScript ビルドタスクで、`post-like.js` が自動的に `assets/built/source.js` にバンドルされます。

```javascript
// gulpfile.js の js タスク
src([
  "assets/js/lib/*.js",
  "assets/js/*.js", // post-like.js はここに含まれる
]);
```

### ステップ 3: Handlebars コンポーネントの作成

`partials/components/post-like.hbs` ファイルを作成し、ボタンの HTML 構造を定義します：

```handlebars
{{> "components/post-like" post_id=id stroke_color="#000"}}
```

**パラメータ:**

- `post_id`: 記事の ID（必須）
- `stroke_color`: アイコンの線の色（オプション）
- `class`: 追加の CSS クラス（オプション）

### ステップ 4: 記事ページへの組み込み

`post.hbs` ファイルで、適切な位置にいいねボタンコンポーネントを配置します：

```handlebars
{{#if @member}}
    {{#has visibility="paid"}}
        {{#if @member.paid}}
            {{> "components/post-like" stroke_color="#000" post_id=id}}
        {{/if}}
    {{else}}
        {{> "components/post-like" stroke_color="#000" post_id=id}}
    {{/has}}
{{/if}}
```

この実装例では：

- ログインユーザーのみにボタンを表示
- 有料記事の場合は有料会員のみに表示
- 無料記事の場合はすべての会員に表示

### ステップ 5: グローバル設定の追加

`default.hbs` ファイルで、会員情報と API 設定を JavaScript グローバル変数として設定します：

```handlebars
{{#if @member}}
  <script>
    window.currentMember = { uuid: "{{@member.uuid}}", name: "{{@member.name}}",
    email: "{{@member.email}}", paid:
    {{#if @member.paid}}true{{else}}false{{/if}}
    }; window.ghostConfig = { contentApiKey: "{{content_api_key}}" };
  </script>
{{/if}}
```

### ステップ 6: CSS スタイルの追加

いいねボタンのスタイルを定義します。`assets/css/` ディレクトリに `post-like.css` ファイルを作成し、必要なスタイルを記述します。

```css
.gh-post-like-button {
  /* ボタンのスタイル */
}

.gh-post-like-icon--active {
  /* アクティブ状態のアイコンスタイル */
}
```

## 動作確認

### 1. ビルドの実行

```bash
npm run dev  # 開発サーバーの起動
# または
gulp build  # ビルドのみ実行
```

### 2. 確認項目

- [ ] ログイン済みユーザーにのみボタンが表示される
- [ ] ボタンクリックでいいねの追加・削除ができる
- [ ] いいね数が正しく表示・更新される
- [ ] ページリロード後も状態が保持される
- [ ] 有料記事で適切なアクセス制限が機能する

## トラブルシューティング

### JavaScript が読み込まれない場合

- `assets/built/source.js` ファイルが生成されているか確認
- ブラウザのコンソールでエラーをチェック
- `gulp build` コマンドを実行してビルドを更新

### API エラーが発生する場合

- Content API キーが正しく設定されているか確認
- API エンドポイントの URL が正しいか確認
- ネットワークタブで API レスポンスを確認

### ボタンが表示されない場合

- `@member` 変数が利用可能か確認
- Handlebars パーシャルのパスが正しいか確認
- HTML ソースで要素が出力されているか確認

## 注意事項

- **セキュリティ**: Content API キーは公開されるため、読み取り専用の権限で使用する
- **パフォーマンス**: 大量のいいね情報を扱う場合はページネーションを検討
- **互換性**: Ghost 5.0.0 以上で動作確認済み
- **キャッシュ**: ビルド後はブラウザキャッシュをクリアして確認

## カスタマイズ

### アイコンの変更

`partials/components/post-like.hbs` 内の SVG を編集してアイコンをカスタマイズできます。

### 表示位置の変更

`post.hbs` 内でコンポーネントの配置位置を調整できます。

### スタイルの調整

CSS ファイルでボタンやアイコンの見た目を自由にカスタマイズできます。`assets/css/variables.css` の変数を使用することを推奨します。
