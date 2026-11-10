#!/usr/bin/env bash
set -Eeuo pipefail

# Creates a dedicated key, then appends a forced-command key to ubuntu's
# authorized_keys. Existing private keys, SSH config, and authorized_keys lines
# are preserved. Run this from the Mac that already has SSH access to the VPS.

readonly KEY_PATH="${HOME}/.ssh/transbara-web-deploy-key"
readonly APP_PATH="/var/www/html/transbara-web"
readonly DEPLOY_COMMAND="/usr/bin/bash ${APP_PATH}/deploy/ci-deploy.sh"

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

if [[ -e "$KEY_PATH" || -e "${KEY_PATH}.pub" ]]; then
  echo "Refusing to overwrite an existing key: $KEY_PATH" >&2
  exit 1
fi

mkdir -p "${HOME}/.ssh"
chmod 700 "${HOME}/.ssh"
ssh-keygen -t ed25519 -N "" -C "github-actions-transbara-web" -f "$KEY_PATH" >/dev/null

PUBKEY_B64="$(base64 < "${KEY_PATH}.pub" | tr -d '\n')"
ssh -p "$SSH_PORT" -o BatchMode=yes "$ADMIN_USER@$HOST" \
  "APP_PATH='$APP_PATH' PUBKEY_B64='$PUBKEY_B64' DEPLOY_COMMAND='$DEPLOY_COMMAND' bash -s" <<'REMOTE'
set -Eeuo pipefail
test -d "$APP_PATH"
test -f "$APP_PATH/deploy/ci-deploy.sh"
test -w "$APP_PATH" || { echo "App folder is not writable by this SSH user: $APP_PATH" >&2; exit 3; }
PUBKEY="$(printf '%s' "$PUBKEY_B64" | base64 -d)"
case "$DEPLOY_COMMAND" in
  *[!A-Za-z0-9/_ .-]*) echo "Unsafe forced command path" >&2; exit 4 ;;
esac
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
touch "$HOME/.ssh/authorized_keys"
chmod 600 "$HOME/.ssh/authorized_keys"
if ! grep -Fq 'github-actions-transbara-web' "$HOME/.ssh/authorized_keys"; then
  printf 'restrict,command="%s" %s\n' "$DEPLOY_COMMAND" "$PUBKEY" >> "$HOME/.ssh/authorized_keys"
fi
REMOTE

echo "Dedicated deploy key created and its restricted public key appended on the VPS."
echo "Private key stays in: $KEY_PATH"
echo "Add the entire private key file as the GitHub Actions secret DEPLOY_SSH_KEY."
echo "For DEPLOY_KNOWN_HOSTS, run: ssh-keyscan -p $SSH_PORT -H $HOST"
echo "Set DEPLOY_HOST=$HOST, DEPLOY_USER=$ADMIN_USER, DEPLOY_PORT=$SSH_PORT, DEPLOY_KNOWN_HOSTS=<pinned ssh-keyscan output>."
