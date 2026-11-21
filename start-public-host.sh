#!/usr/bin/env bash
# start-public-host.sh
# Launches the Problem Solving Lab Next.js platform and creates a free, random public Cloudflare tunnel.
# No Vercel branding, 100% free, accessible from any device.

set -e

PORT=${PORT:-3000}
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLOUDFLARED="$HOME/.local/bin/cloudflared"

echo "⚡ Starting Nexus Academy / Problem Solving Lab..."
cd "$PROJECT_DIR"

# 1. Build if .next does not exist
if [ ! -d ".next" ]; then
  echo "📦 Building production Next.js bundle..."
  npm run build
fi

# 2. Check if cloudflared is installed
if [ ! -f "$CLOUDFLARED" ]; then
  echo "📥 Installing cloudflared to $CLOUDFLARED..."
  mkdir -p "$HOME/.local/bin"
  curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-arm64.tgz -o /tmp/cf.tgz
  tar -xzf /tmp/cf.tgz -C "$HOME/.local/bin/"
  chmod +x "$CLOUDFLARED"
fi

# 3. Kill existing servers on port if any
PID=$(lsof -ti :"$PORT" 2>/dev/null || true)
if [ -n "$PID" ]; then
  echo "Stopping existing process on port $PORT (PID $PID)..."
  kill -9 $PID 2>/dev/null || true
fi

# 4. Start Next.js production server
echo "🚀 Launching Next.js on port $PORT..."
npm run start &
SERVER_PID=$!

sleep 2

# 5. Launch Cloudflare Tunnel
echo "🌐 Creating public link (random trycloudflare URL)..."
"$CLOUDFLARED" tunnel --url "http://localhost:$PORT"
