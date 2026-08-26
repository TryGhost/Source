#!/usr/bin/env bash
set -Eeuo pipefail

theme_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
stack_dir="$(cd "$theme_dir/.." && pwd)"

usage() {
    cat <<'EOF'
Usage: ./theme.sh <command>

Commands:
  build   Build theme assets and restart local Ghost when it is running.
  update  Merge the latest official Source tag locally without committing it,
          build it, restart local Ghost, and replace local Ghost data with
          a production sync for manual verification.
EOF
}

require_command() {
    command -v "$1" >/dev/null || {
        echo "Required command not found: $1" >&2
        exit 1
    }
}

restart_local_ghost_if_running() {
    local compose

    if [[ ! -f "$stack_dir/.env.local" ]]; then
        echo "Local Ghost is not configured; skipping restart."
        return
    fi

    require_command docker
    compose=(docker compose --env-file "$stack_dir/.env.local" -f "$stack_dir/compose.yml" -f "$stack_dir/compose.local.yml")

    if "${compose[@]}" ps -q cosmonauta_dev_ghost | grep -q .; then
        echo "Restarting local Ghost so it reloads the theme..."
        "$stack_dir/local.sh" restart
    else
        echo "Local Ghost is not running; build completed without a restart."
    fi
}

build() {
    require_command pnpm
    pnpm build
    restart_local_ghost_if_running
}

sync_from_production() {
    [[ -f "$stack_dir/.env.local" ]] || {
        echo "Local Ghost is not configured; cannot synchronize production data." >&2
        return 1
    }

    echo "Synchronizing local Ghost data from production..."
    "$stack_dir/local.sh" sync --yes
}

latest_upstream_tag() {
    git ls-remote --tags --refs upstream |
        awk -F/ '{print $3}' |
        sort -V |
        tail -n 1
}

latest_merged_tag() {
    git tag --merged HEAD --sort=-v:refname | head -n 1
}

update() {
    local latest_tag current_tag

    require_command git
    require_command pnpm

    [[ -z "$(git status --porcelain)" ]] || {
        echo "Working tree is not clean. Commit or stash changes before updating." >&2
        exit 1
    }

    [[ "$(git branch --show-current)" == "main" ]] || {
        echo "Run update from the local main branch." >&2
        exit 1
    }

    git pull --ff-only origin main
    echo "Fetching official Source tags..."
    git fetch --prune --prune-tags upstream 'refs/tags/*:refs/tags/*'
    latest_tag="$(latest_upstream_tag)"
    current_tag="$(latest_merged_tag)"

    [[ -n "$latest_tag" ]] || {
        echo "No release tags were found in upstream." >&2
        exit 1
    }

    if [[ "$latest_tag" == "$current_tag" ]]; then
        echo "Cosmonauta is already based on the latest Source release: $latest_tag"
        return
    fi

    echo "Merging Source $latest_tag locally without a commit..."
    if ! git merge --no-ff --no-commit "$latest_tag"; then
        git merge --abort || true
        echo "Merge conflict: the working tree was restored to main." >&2
        echo "Resolve the update manually on a dedicated branch." >&2
        exit 1
    fi

    if ! build; then
        echo "Build or local Ghost restart failed; the uncommitted merge was kept for inspection." >&2
        echo "To discard it safely, run: git merge --abort" >&2
        exit 1
    fi

    if ! sync_from_production; then
        echo "Production sync failed; the uncommitted merge was kept for inspection." >&2
        echo "To discard it safely, run: git merge --abort" >&2
        exit 1
    fi

    echo "Source $latest_tag is ready for local review and remains uncommitted."
    echo "Activate cosmonauta in local Ghost Admin before reviewing it."
    echo "Keep it later: create a branch, commit, push, and open a PR."
    echo "Discard it: git merge --abort"
}

case "${1:-}" in
    build) build ;;
    update) update ;;
    help|-h|--help|"") usage ;;
    *) usage >&2; exit 64 ;;
esac
