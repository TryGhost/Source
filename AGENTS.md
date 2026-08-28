# AGENTS.md

## Scope

This repository is the default Ghost theme. Keep changes focused on theme source, generated assets, CI, and repo-level metadata for this repository.

## Commands

Use pnpm for this repo.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm test:ci
pnpm zip
```

Run the test command before opening a PR when theme files, generated assets, dependencies, or CI change.

## Boundaries

- Edit source CSS, JavaScript, Handlebars templates, partials, and package metadata intentionally.
- Keep generated assets/built/ files in sync when source assets change and the repo tracks those outputs.
- Do not commit node_modules/, local Ghost content, generated zip files outside tracked release expectations, or secrets.
- Repo settings, descriptions, and branch rules belong on the GitHub repository; internal clean-repos metadata stays in TryGhost/cleanrepos.

## Cosmonauta customizations

This repository is a fork of TryGhost/Source. Preserve compatibility with
future Source releases by keeping Cosmonauta-specific changes isolated.

- Put CSS customizations only in `assets/css/custom.css`; the Gulp build
  appends it after Source's stylesheet.
- Put JavaScript customizations only in `assets/js/custom.js`; the Gulp build
  appends it after Source's scripts.
- Do not modify Source CSS or JavaScript for a local customization when one of
  the `custom.*` files can implement it.
- When a `.hbs` template or partial must change, make the smallest possible
  edit and wrap every local block with these Handlebars comments:

  ```hbs
  {{!-- COSMONAUTA CUSTOM: inizio — description --}}
  {{!-- local code --}}
  {{!-- COSMONAUTA CUSTOM: fine — description --}}
  ```

- Use equivalent `COSMONAUTA CUSTOM: inizio` / `fine` comments for isolated
  exceptions outside the `custom.*` files.
- Never edit `assets/built/` files by hand; regenerate them with `pnpm build`
  (or `pnpm dev`) after source changes.
