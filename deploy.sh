#!/bin/bash
set -e

REMOTE="u102920777@access851067532.webspace-data.io"
REMOTE_DIR="~/wildman"
WEBROOT="~/clickandbuilds/StevenLawton"

echo "=== TheWildMan Deploy ==="

# Build with correct base path
npm run build:client -- --base=/wildman/
npm run build:server -- --base=/wildman/ && npm run build:prerender

# Copy index.html as 404.html for SPA fallback
cp dist/index.html dist/404.html

# Deploy to remote
rsync -avz --delete dist/ "$REMOTE:$REMOTE_DIR/"

# Symlink into webroot
ssh "$REMOTE" "ln -sfn $REMOTE_DIR $WEBROOT/wildman"

echo "=== Deployed to $REMOTE_DIR ==="
echo "=== Live at https://stevenlawton.com/wildman/ ==="
