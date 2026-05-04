# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

This is a **fork of [TryGhost/Source](https://github.com/TryGhost/Source)** customized for `cyberverso.net`, a bilingual (IT/EN) Ghost blog hosted on **Ghost Pro** (ghost.io). Because hosting is managed, only the theme can be modified — no Ghost core/server changes possible.

**Read `CYBERVERSO_HANDOFF.md` first.** It contains palette, typography, bilingual taxonomy strategy, step-by-step roadmap, and what NOT to do. The rest of this document covers only the mechanics.

## Commands

```bash
yarn install            # install deps (Node >=22.12.0 required per package.json)
yarn dev                # alias for `gulp`: builds, starts livereload, watches
npx gulp build          # one-shot build (no watch). There is NO `yarn build` script.
yarn zip                # build + package into dist/source.zip for Ghost.io upload
yarn test               # run gscan (Ghost theme validator); also runs `gulp build` via pretest
yarn test:ci            # gscan in --fatal --verbose mode
```

To run a single gulp task: `npx gulp css`, `npx gulp js`, `npx gulp hbs`. There are no unit tests — `gscan` is the only validator and it operates on the whole theme.

## Build pipeline (gulpfile.js)

- **`css` task**: PostCSS pipeline (`postcss-easy-import` → `autoprefixer` → `cssnano`) over an array of entry files. Each entry produces a separate output in `assets/built/`. Currently: `screen.css` (Source stock) and `cyberverso.css` (our overrides).
- **`js` task**: concat all `assets/js/lib/*.js` + `assets/js/*.js` → `built/source.js`, then uglify. **Adding a new file under `assets/js/` automatically bundles it into `source.js`** — no template changes needed. To exclude one, add `'!assets/js/<file>.js'` to the glob.
- **`hbs` task**: livereload only (no compilation; Ghost renders Handlebars at runtime).
- **`zipper`**: packages everything except `node_modules`, `dist`, `gulpfile.js`, `yarn.lock` into `dist/<theme-name>.zip`.

## Layered architecture

The cyber/verso customization is a thin layer on top of Source, not a fork-and-rewrite:

- `assets/css/cyberverso.css` defines `--cv-*` design tokens and overrides Source variables. It loads in `default.hbs` **after** `screen.css` so cascade wins without `!important`.
- `assets/js/cyberverso.js` handles the dark/light toggle (`localStorage` key `cv-theme`). It is concatenated into `built/source.js` by the `js` task — **do not** add a separate `<script>` tag for it (would double-bind handlers).
- An inline anti-flash script lives in `default.hbs` `<head>`. It must run **after** Source's `documentElement.className = …` script (lines ~27-44 of `default.hbs`), because that script uses `className=` (assignment, not `classList.add`) and would wipe any classes set earlier.
- Source's dark mode is signaled by `.has-light-text` on `:root` (counter-intuitive name: it means "light *text* on dark background"). Light mode adds `.cv-light-mode` and removes `.has-light-text`.
- Source uses `font-size: 62.5%` on `<html>` (10px base, so `1.6rem = 16px`). All cyber/verso sizes use `rem` to stay consistent.

## Naming conventions

- CSS custom properties: `--cv-*` (e.g. `--cv-bg`, `--cv-accent`)
- CSS utility classes: `cv-*` (e.g. `cv-light-mode`, `cv-slash`)
- JS data attributes: `data-cv-*` (e.g. `data-cv-toggle-theme`)
- Cyber/verso Handlebars partials: `partials/cv-*.hbs`

The `cv-` namespace prevents collisions with stock Source code, which uses unprefixed names (`--color-primary-text`, `gh-viewport`, etc.).

## Bilingual strategy (Step 4, not yet implemented)

Ghost has no native multilingual support. The plan documented in `CYBERVERSO_HANDOFF.md`:

- **Tag taxonomy**: public topic tags (`infrastructures`, `identity`, …) + internal language tags (`#en`, `#it`) + internal pairing tags (`#tx-<codename>`). Tags prefixed with `#` are admin-internal in Ghost (invisible publicly, but filterable in templates).
- **routes.yaml**: separate collections for `/` (filter `tag:hash-en`) and `/it/` (filter `tag:hash-it`). Uploaded via Ghost Admin → Labs → Routes.
- **Language switcher**: looks up the post with the same `#tx-*` codename in the other language; falls back to the home of the other language if no translation exists.

## Theme settings exposed to publishers

`package.json` `config.custom` defines settings shown in Ghost Admin (navigation layout, fonts, colors, header style, etc.). These are accessed in templates as `{{@custom.<key>}}`. When adding a new admin-controlled option, declare it here.

`{{@custom.site_background_color}}` is read by the inline script at the top of `default.hbs:<head>` to set `has-light-text` / `has-dark-text` automatically based on contrast — this is Source's stock behavior and runs before the cyber/verso anti-flash init.

## Deployment

Ghost.io accepts theme uploads via Admin UI (`yarn zip` → upload `dist/source.zip`) or via GitHub Action (`TryGhost/action-deploy-theme`, planned in Step 6). There is no `git push to deploy` flow. Always test locally with a Ghost dev install before uploading.

## Conventions

- **Branching**: `main` reflects deploy; feature work on `cyberverso-step-N-<slug>` branches.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `style:`, `chore:`).
- **No `!important`**: if a cascade conflict arises, fix specificity/order instead.
- **No heavy npm deps**: no React, no CSS frameworks. Vanilla CSS + small inline scripts.
- **Visual identity is fixed** (palette, typography, slash motif): don't change without discussion. See §2 and §9 of `CYBERVERSO_HANDOFF.md` for the explicit "do not" list.
