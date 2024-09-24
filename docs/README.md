# Source of Yuta Watanabe Locker Room

渡邊雄太選手のファンサイトの[Ghost](http://github.com/tryghost/ghost/)テーマファイル

&nbsp;

## Requirements

- [Node.js](https://nodejs.org/): v18.20.4
- [Yarn](https://yarnpkg.com/): v1.22.22
- [ローカルのGhost環境](https://github.com/magaport/DIS-Ghost): yw-japanese ブランチ
  - `ghost/core/content/themes`以下の`source`ディレクトリを本リポジトリに置換する

&nbsp;

## Development

- packageのインストール

   ```bash
   yarn install
   ```

- serverの起動  
  - `/assets/css/` ファイルを編集できるようになり、自動的に `/assets/built/` にコンパイルされる

   ```bash
   yarn dev
   ```

- (サイトにテーマファイルをアップロードするときにのみ使用)テーマファイルをzipする
  - `dist/<theme-name>.zip`に出力

   ```bash
   yarn zip
   ```

### Develope Reference

- [Handlebars](http://handlebarsjs.com/)
- [theme API documentation](https://ghost.org/docs/themes/)

## Production Deployment Flow

[リリース作業](RELEASE.md)

## Copyright & License

Copyright (c) 2013-2023 Ghost Foundation - Released under the [MIT license](LICENSE).
