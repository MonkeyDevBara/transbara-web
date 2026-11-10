#!/usr/bin/env bash
set -Eeuo pipefail

# Creates/reuses one dedicated key, installs a server-side deploy command outside
# the app checkout, then appends a forced-command key. Existing SSH config and
# authorized_keys entries are preserved. Run from a checkout of this branch.

readonly KEY_PATH="${HOME}/.ssh/transbara-web-deploy-key"
readonly APP_PATH="/var/www/html/transbara-web"
readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly DEPLOY_SOURCE="${SCRIPT_DIR}/../deploy/ci-deploy.sh"

read -r -p "VPS host [43.173.9.126]: " HOST
HOST="${HOST:-43.173.9.126}"
read -r -p "Existing SSH admin username [ubuntu]: " ADMIN_USER
ADMIN_USER="${ADMIN_USER:-ubuntu}"
read -r -p "SSH port [22]: " SSH_PORT
SSH_PORT="${SSH_PORT:-22}"

if [[ ! "$HOST" =~ ^[A-Za-z0-9.-]+$ || ! "$ADMIN_USER" =~ ^[A-Za-z_][A-Za-z0-9_-]*$ || ! "$SSH_PORT" =~ ^[0-9]+$ ]]; then
  echo "Invalid host, username, or port." >&2
  exit 2
fi
if [[ ! -f "$DEPLOY_SOURCE" ]]; then
  echo "Missing deployment script beside this setup script: $DEPLOY_SOURCE" >&2
  exit 2
fi

mkdir -p "${HOME}/.ssh"
chmod 700 "${HOME}/.ssh"
if [[ -e "$KEY_PATH" && -e "${KEY_PATH}.pub" ]]; then
  echo "Reusing existing dedicated key at $KEY_PATH; it will not be overwritten."
elif [[ -e "$KEY_PATH" || -e "${KEY_PATH}.pub" ]]; then
  echo "Found an incomplete key pair at $KEY_PATH; refusing to overwrite it." >&2
  exit 1
else
  ssh-keygen -t ed25519 -N "" -C "github-actions-transbara-web" -f "$KEY_PATH" >/dev/null
fi

PUBKEY_B64="$(base64 < "${KEY_PATH}.pub" | tr -d '\n')"
DEPLOY_SCRIPT_B64="$(base64 < "$DEPLOY_SOURCE" | tr -d '\n')"
ssh -p "$SSH_PORT" -o BatchMode=yes "$ADMIN_USER@$HOST" \
  "APP_PATH='$APP_PATH' PUBKEY_B64='$PUBKEY_B64' DEPLOY_SCRIPT_B64='$DEPLOY_SCRIPT_B64' bash -s" <<'REMOTE'
set -Eeuo pipefail
test -d "$APP_PATH"
test -w "$APP_PATH" || { echo "App folder is not writable by this SSH user: $APP_PATH" >&2; exit 3; }
PUBKEY="$(printf '%s' "$PUBKEY_B64" | base64 -d)"
DEPLOY_HOME="$HOME/.local/bin"
DEPLOY_COMMAND="$DEPLOY_HOME/transbara-web-deploy"
mkdir -p "$DEPLOY_HOME"
printf '%s' "$DEPLOY_SCRIPT_B64" | base64 -d > "$DEPLOY_COMMAND"
chmod 700 "$DEPLOY_COMMAND"
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
touch "$HOME/.ssh/authorized_keys"
chmod 600 "$HOME/.ssh/authorized_keys"
if ! grep -Fq 'github-actions-transbara-web' "$HOME/.ssh/authorized_keys"; then
  printf 'restrict,command="%s" %s\n' "$DEPLOY_COMMAND" "$PUBKEY" >> "$HOME/.ssh/authorized_keys"
fi
REMOTE

echo "Dedicated deploy key created/reused; restricted public key appended on the VPS."
echo "Private key stays in: $KEY_PATH"
echo "Add the entire private key file as GitHub Actions secret DEPLOY_SSH_KEY."
echo "For DEPLOY_KNOWN_HOSTS, run: ssh-keyscan -p $SSH_PORT -H $HOST and verify the fingerprint."
echo "Set DEPLOY_HOST=$HOST, DEPLOY_USER=$ADMIN_USER, DEPLOY_PORT=$SSH_PORT, DEPLOY_KNOWN_HOSTS=<verified ssh-keyscan output>."
