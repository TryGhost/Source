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

## Upstream sync

This repository is a fork of [TryGhost/Source](https://github.com/TryGhost/Source), customized for personal use. The `.github/workflows/sync-upstream.yml` workflow checks upstream weekly (and on manual dispatch): if `upstream/main` has new commits, it merges them into a `sync/upstream-*` branch, runs `pnpm test:ci` against the merged result, and opens a PR against `main` with the test outcome noted in the description. If the merge conflicts, it opens an issue instead of a PR.

The repository's "Workflow permissions" setting (Settings > Actions > General) must allow read/write for `GITHUB_TOKEN`, or the workflow cannot push branches or create PRs/issues.

To sync manually:

```bash
git remote add upstream https://github.com/TryGhost/Source.git
git fetch upstream
git checkout -b sync/upstream-manual
git merge upstream/main
# resolve conflicts, then commit and push
```

## Boundaries

- Edit source CSS, JavaScript, Handlebars templates, partials, and package metadata intentionally.
- Keep generated assets/built/ files in sync when source assets change and the repo tracks those outputs.
- Do not commit node_modules/, local Ghost content, generated zip files outside tracked release expectations, or secrets.
- Repo settings, descriptions, and branch rules belong on the GitHub repository; internal clean-repos metadata stays in TryGhost/cleanrepos.
