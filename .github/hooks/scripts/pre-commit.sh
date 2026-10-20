#!/usr/bin/env bash

set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
log_dir="$repo_root/.github/hooks/logs"
log_file="$log_dir/pre-commit.log"

mkdir -p "$log_dir"
cd "$repo_root"

# Keep the local hook evidence available without adding test output to Git.
run_checks() {
  echo "[pre-commit] $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  npx lint-staged
  npm run check:agent-setup
  npm test
}

run_checks 2>&1 | tee "$log_file"
