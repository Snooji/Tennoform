#!/usr/bin/env bash
# Build the site from main as it is right now and push it. Used by the workflows only (Build site, Game data update,
# Refresh market prices): they are the only place built files are made and committed, so pull requests never clash over them.
#   build/publish.sh "commit message" [check command...]
# Commit any data changes first (the caller does). If main moved while this ran (a merge, another workflow), the data
# commit is moved onto the new main and the site is built again, up to 5 times. The check command, if given, runs after
# each build; if it fails nothing is pushed.
set -euo pipefail
cd "$(dirname "$0")/.."
msg="$1"; shift
git config user.name "tennoform-bot"
git config user.email "tennoform-bot@users.noreply.github.com"
for attempt in 1 2 3 4 5; do
  git fetch -q origin main
  git rebase -q origin/main
  start=$(git rev-parse HEAD)
  (cd app && npm ci --silent --no-audit --no-fund && npm run build)
  python3 build/make_site.py
  if [ $# -gt 0 ]; then "$@"; fi
  git add -A
  git diff --cached --quiet || git commit -q -m "$msg"
  if [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ]; then echo "Nothing to publish"; exit 0; fi
  if git push -q origin HEAD:main; then echo "Published"; exit 0; fi
  echo "main moved while building; trying again on top of it ($attempt)"
  git reset -q --hard "$start"
  sleep $((attempt * 5))
done
echo "::error::Couldn't push after 5 tries"; exit 1
