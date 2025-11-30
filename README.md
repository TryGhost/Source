# Source

The [Ghost](http://github.com/tryghost/ghost/) theme for
[kenziepossee.com](https://kenziepossee.com). This is a fork of
[Source](https://github.com/TryGhost/Source/).

## Layout

Ghost uses a simple templating language called
[Handlebars](http://handlebarsjs.com/) for its themes.

This theme has lots of code comments to help explain what's going on just by
reading the code. Once you feel comfortable with how everything works, we also
have full [theme API documentation](https://ghost.org/docs/themes/) which
explains every possible Handlebars helper and template.

**The main files are:**

- `default.hbs` - The parent template file, which includes your global
  header/footer
- `home.hbs` - The homepage
- `index.hbs` - The main template to generate a list of posts
- `post.hbs` - The template used to render individual posts
- `page.hbs` - Used for individual pages
- `tag.hbs` - Used for tag archives, eg. "all posts tagged with `news`"
- `author.hbs` - Used for author archives, eg. "all posts written by Jamie"

A new feature of this fork is the addition of:

- `custom-scrollytelling.hbs` - a custom post format for scrollytelling
  pieces.


# Development

Source styles are compiled using Gulp/PostCSS to polyfill future CSS spec.
You'll need to install [nodenv](https://github.com/nodenv/nodenv) and
[pnpm](https://pnpm.io/) installed.

## Setup (macOS)

```bash
brew install nodenv pnpm

# Follow the instructions to setup nodenv
nodenv init

git clone https://github.com/nathanmsmith/kpsource/
cd kpsource

# Install Node v24
nodenv install 24

# Verify installations
node --version
pnpm --version

# Install dependencies
pnpm install
```

## Running locally

From the theme's root directory:

```bash
# Run development server
pnpm dev
```

Now you can edit `/assets/css/` and `/assets/js/` files, which will be compiled
to `/assets/built/` automatically with live reload.

## Release

The theme is automatically deployed to Ghost via GitHub Actions when changes are
pushed to the `main` branch. The workflow:

1. Installs dependencies with pnpm.
2. Builds the theme (compiles CSS and JS).
3. Deploys to Ghost using the
   [TryGhost/action-deploy-theme](https://github.com/TryGhost/action-deploy-theme)
   action.

The GitHub Action requires two secrets configured in repository settings:
- `GHOST_ADMIN_API_URL` - Your Ghost site's admin API URL
- `GHOST_ADMIN_API_KEY` - Your Ghost admin API key

# PostCSS Features Used

- Autoprefixer - Don't worry about writing browser prefixes of any kind, it's
  all done automatically with support for the latest 2 major versions of every
  browser.

# SVG Icons

Source uses inline SVG icons, included via Handlebars partials. You can find all
icons inside `/partials/icons`. To use an icon just include the name of the
relevant file, eg. To include the SVG icon in `/partials/icons/rss.hbs` - use
`{{> "icons/rss"}}`.

You can add your own SVG icons in the same manner.
