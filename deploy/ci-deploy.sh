#!/usr/bin/env bash
set -Eeuo pipefail

readonly APP_PATH="/var/www/html/transbara-web"
cd "$APP_PATH"

# Make Node 22 available for non-interactive SSH sessions when installed with nvm.
if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh"
  nvm use 22 >/dev/null
fi

node -e 'const major = Number(process.versions.node.split(".")[0]); if (major < 22) process.exit(1)' || {
  echo "Node.js 22 or newer is required." >&2
  exit 1
}
command -v npm >/dev/null
command -v pm2 >/dev/null

git pull --ff-only origin main
npm ci
npm run build
pm2 reload transbara-web
