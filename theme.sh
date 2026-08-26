#!/usr/bin/env bash
set -Eeuo pipefail

theme_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
stack_dir="$(cd "$theme_dir/.." && pwd)"

usage() {
    cat <<'EOF'
Usage: ./theme.sh <command>

Commands:
  build   Build theme assets and restart local Ghost when it is running.
  update  Merge the latest official Source tag into a new branch, validate it,
          push the branch, and open a GitHub pull request when gh is available.
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
    local current_branch latest_tag current_tag update_branch

    require_command git
    require_command pnpm

    [[ -z "$(git status --porcelain)" ]] || {
        echo "Working tree is not clean. Commit or stash changes before updating." >&2
        exit 1
    }

    current_branch="$(git branch --show-current)"
    [[ -n "$current_branch" ]] || {
        echo "A named Git branch is required to update the theme." >&2
        exit 1
    }

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

    update_branch="update/source-${latest_tag}"
    if git show-ref --verify --quiet "refs/heads/$update_branch" || git ls-remote --exit-code --heads origin "$update_branch" >/dev/null 2>&1; then
        echo "An update branch already exists: $update_branch" >&2
        echo "Review or resume it instead of creating a second update." >&2
        exit 1
    fi

    git switch main
    git pull --ff-only origin main
    git switch -c "$update_branch"

    echo "Merging Source $latest_tag..."
    if ! git merge --no-ff "$latest_tag" -m "chore: merge Source $latest_tag"; then
        git merge --abort || true
        echo "Merge conflict: the update branch was kept for inspection." >&2
        echo "Resolve manually with: git switch $update_branch && git merge $latest_tag" >&2
        git switch "$current_branch"
        exit 1
    fi

    if ! pnpm install --frozen-lockfile || ! pnpm test:ci; then
        echo "Validation failed: $update_branch was kept without being pushed." >&2
        echo "Inspect the failure, fix it, then run: git push -u origin $update_branch" >&2
        git switch "$current_branch"
        exit 1
    fi

    if ! git push -u origin "$update_branch"; then
        echo "Push failed: the validated local branch was kept for retry." >&2
        echo "Retry with: git push -u origin $update_branch" >&2
        git switch "$current_branch"
        exit 1
    fi

    if command -v gh >/dev/null && gh auth status >/dev/null 2>&1; then
        if ! gh pr create \
            --base main \
            --head "$update_branch" \
            --title "chore: merge Source $latest_tag" \
            --body "Updates Cosmonauta from Source $current_tag to $latest_tag. Validation: pnpm test:ci."; then
            echo "Branch pushed, but GitHub PR creation needs manual completion." >&2
        fi
    else
        echo "Branch pushed. Open a pull request from $update_branch to main."
    fi

    git switch "$current_branch"
    echo "Source update is ready for review: $update_branch"
}

case "${1:-}" in
    build) build ;;
    update) update ;;
    help|-h|--help|"") usage ;;
    *) usage >&2; exit 64 ;;
esac
