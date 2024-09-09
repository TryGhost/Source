# Source

The default theme for [Ghost](http://github.com/tryghost/ghost/). This is the latest development version of Source! If you're just looking to download the latest release, head over to the [releases](https://github.com/TryGhost/Source/releases) page.

&nbsp;

# First time using a Ghost theme?

Ghost uses a simple templating language called [Handlebars](http://handlebarsjs.com/) for its themes.

This theme has lots of code comments to help explain what's going on just by reading the code. Once you feel comfortable with how everything works, we also have full [theme API documentation](https://ghost.org/docs/themes/) which explains every possible Handlebars helper and template.

**The main files are:**

- `default.hbs` - The parent template file, which includes your global header/footer
- `home.hbs` - The homepage
- `index.hbs` - The main template to generate a list of posts
- `post.hbs` - The template used to render individual posts
- `page.hbs` - Used for individual pages
- `tag.hbs` - Used for tag archives, eg. "all posts tagged with `news`"
- `author.hbs` - Used for author archives, eg. "all posts written by Jamie"

One neat trick is that you can also create custom one-off templates by adding the slug of a page to a template file. For example:

- `page-about.hbs` - Custom template for an `/about/` page
- `tag-news.hbs` - Custom template for `/tag/news/` archive
- `author-ali.hbs` - Custom template for `/author/ali/` archive

# Development

Source styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
# install dependencies
yarn install

# run development server
yarn dev
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/<theme-name>.zip`, which you can then upload to your site.

```bash
# create .zip file
yarn zip
```

# PostCSS Features Used

- Autoprefixer - Don't worry about writing browser prefixes of any kind, it's all done automatically with support for the latest 2 major versions of every browser.

# SVG Icons

Source uses inline SVG icons, included via Handlebars partials. You can find all icons inside `/partials/icons`. To use an icon just include the name of the relevant file, eg. To include the SVG icon in `/partials/icons/rss.hbs` - use `{{> "icons/rss"}}`.

You can add your own SVG icons in the same manner.

# Production Deployment Flow

本番環境へのデプロイ時には、検証環境の設定を反映させるため、以下の手順を実行してください。

1. テーマのアップロード

   - テーマの変更がある場合は、yarn zip コマンドで生成したテーマの zip ファイルを本番環境にアップロードします。
   - 本番環境の Ghost Admin から、テーマをアップロードして適用します

2. Navigation の設定

   - 検証環境の Ghost Admin にログインし、「Design」セクションから「Navigation」の設定を確認します。
   - この設定を本番環境の Ghost Admin にも同様に反映します。

3. routes.yaml の移植

   - 検証環境の Ghost Admin にアクセスし、routes.yaml ファイルをダウンロードします。
     - Admin の「Labs」セクションに移動し、「Download current routes.yaml」をクリックしてダウンロードします。
   - ダウンロードした routes.yaml を本番環境にアップロードし、同様に適用します。
     - 本番環境の Ghost Admin にアクセスし、「Upload routes.yaml」を使用して反映させます。

# Copyright & License

Copyright (c) 2013-2023 Ghost Foundation - Released under the [MIT license](LICENSE).
