# Unelash テーマ開発フロー

## Requirements

- **Node.js**: 現行の Ghost がサポートする LTS（2025/09/25 時点 v22 系）
- **パッケージマネージャ**: Yarn 1.x
- **ローカルの Ghost 環境**: 開発モード
  - 通常は `content/themes/<your-theme>` 配下にテーマを配置（またはシンボリックリンク）

---

## テーマの基本構成

```
/partials        # パーシャル（共通断片）
/assets          # CSS/JS/画像（生成物は /assets/built/）
/locales         # 多言語（必要に応じて）
*.hbs            # テンプレート（index.hbs, post.hbs など）
package.json     # テーマのメタ情報・カスタム設定
```

- Handlebars でテンプレート構築（例: `{{> "header"}}` でパーシャル読込）
- [公式の Theme API / Helpers 一覧](https://docs.ghost.org/themes/contexts)を随時参照

---

## 開発フロー（Development）

### 1) 依存インストール

```bash
yarn install
# または npm ci
```

### 2) 開発サーバ（アセット監視・ビルド）

```bash
yarn dev
```

- `assets/css/`（あるいは `src/`）の変更を監視し、`assets/built/` へ自動ビルド
- Gulp / Rollup / esbuild などはプロジェクトの `package.json` に準拠

### 3) テーマの反映

- ローカル Ghost の `content/themes/<your-theme>` に配置（または symlink）
- Ghost 再起動後、管理画面 → **Design & branding** からテーマ選択

> 既存プロジェクトで `ghost/core/content/themes` 以下を直接置換する運用の場合は、環境更新時の衝突や追従コストに注意。標準の `content/themes` 配下運用が推奨です。

---

## 検証（Validation）

テーマの品質・互換性は **gscan** でチェックできます。

```bash
# ディレクトリを検証
yarn dlx gscan .
# もしくは
npx gscan .

# zip を検証
yarn dlx gscan -z dist/theme.zip
# もしくは
npx gscan -z dist/theme.zip
```

- エラー（Fatal）はアップロード時にもブロックされます
- 警告（Warning）は非推奨 API 等の早期検知に有効

---

## パッケージング & デプロイ

### 配布用 ZIP 作成

```bash
yarn zip  # dist/<theme-name>.zip に出力（プロジェクトの script 前提）
```

### 反映方法

- **管理画面アップロード**: Settings → Design & branding → Change theme → **Upload theme** → **Activate**
- **Admin API**: `POST /ghost/api/admin/themes/upload`（CI/CD からの自動反映に最適）
  - マルチパートで `file=@dist/<theme-name>.zip` を送信

---

## カスタム設定（Theme Custom Settings）

`package.json` の `config` セクションで、テーマ独自の設定 UI を管理画面に表示できます。

- 例: カラースキーム、ロゴ画像、レイアウト切替、トグル／セレクト等
- 編集した値はテンプレート内で `@site` / `@custom` 経由で参照

雛形例：

```json
{
  "name": "your-theme",
  "config": {
    "posts_per_page": 25,
    "custom": {
      "brand_color": {
        "type": "color",
        "title": "Brand Color",
        "default": "#111827"
      },
      "show_featured": {
        "type": "boolean",
        "title": "Show Featured Section",
        "default": true
      }
    }
  }
}
```

テンプレート参照例：

```hbs
<style>
  :root { --brand: {{@custom.brand_color}}; }
</style>
{{#if @custom.show_featured}}
  {{> "featured"}}
{{/if}}
```

---

## ルーティング（routes.yaml）

- トップページ差替え／コレクション／チャンネルの定義を `routes.yaml` で管理
- 管理画面 → Labs（あるいは設定画面）からアップロード

例：

```yaml
routes:
  /: home

collections:
  /blog/:
    permalink: /blog/{slug}/
    template: index

taxonomies:
  tag: /tag/{slug}/
  author: /author/{slug}/
```

---

## Production 運用の指針

- サポート対象の **Node LTS** で Ghost を稼働
- 反映前に `gscan` を継続的に実行（CI で PR ごとに Gate）
- 反映は **管理画面アップロード** か **Admin API**（CI/CD）
- 破壊的変更（Helper の仕様変更等）がある Ghost へのアップグレード時は、先にステージングで検証

---

## 参考リンク（開発者向け）

- [テーマ構造 / Theme API / Helpers](https://docs.ghost.org/themes)
- [Ghost-CLI（ローカル／本番のセットアップ）](https://github.com/magaport/Unleash/blob/magaco-foods/docs/Unleash%E3%81%AE%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89%E6%89%8B%E9%A0%86.md)
- [ルーティング（`routes.yaml`）](https://docs.ghost.org/themes/routing)
- [gscan（テーマ検証）](https://docs.ghost.org/themes/gscan)

---

## ライセンス

- 公式テーマ（Casper 等）は **MIT License**。
- 自作テーマはプロジェクト要件に合わせ、`package.json` の `license` も整備。

---

## 補足ドキュメント

- **メールテンプレートのカスタマイズ方法**: `CustomizeMailTemplate.md`

---
