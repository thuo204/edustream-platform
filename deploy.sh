#!/bin/bash
# ============================================================
# deploy.sh — EduStream full deploy script
# Usage: bash deploy.sh
# ============================================================
set -e  # stop on any error

APP_DIR="/home/$USER/frontend"
LOG_DIR="$APP_DIR/logs"

echo ""
echo "══════════════════════════════════════════"
echo "  EduStream Deploy Script"
echo "══════════════════════════════════════════"

# ── 1. Move into app directory ────────────────────────────────
cd "$APP_DIR"
echo "[1/6] Working in: $APP_DIR"

# ── 2. Create .env.local if missing ──────────────────────────
if [ ! -f ".env.local" ]; then
  echo ""
  echo "⚠  .env.local not found. Creating from template..."
  cp .env.example .env.local
  echo "   → Edit .env.local and fill in your API URL, then re-run this script."
  echo ""
  nano .env.local
fi

# ── 3. Install dependencies ───────────────────────────────────
echo "[2/6] Installing dependencies..."
npm ci --omit=dev

# ── 4. Build ──────────────────────────────────────────────────
echo "[3/6] Building Next.js (output: standalone)..."
npm run build

# ── 5. Copy static files into standalone output ───────────────
# Required when using output:'standalone'
echo "[4/6] Copying static assets into standalone bundle..."
cp -r .next/static      .next/standalone/.next/static
cp -r public            .next/standalone/public 2>/dev/null || true

# ── 6. Create log directory ───────────────────────────────────
mkdir -p "$LOG_DIR"

# ── 7. Start / restart via PM2 ────────────────────────────────
echo "[5/6] Starting app with PM2..."
if pm2 list | grep -q "edustream"; then
  pm2 reload ecosystem.config.js --env production
else
  pm2 start  ecosystem.config.js --env production
fi
pm2 save

# ── 8. Nginx ──────────────────────────────────────────────────
echo "[6/6] Checking Nginx..."
if [ -f "/etc/nginx/sites-available/edustream" ]; then
  sudo nginx -t && sudo systemctl reload nginx
  echo "   Nginx reloaded ✓"
else
  echo "   Nginx config not installed yet."
  echo "   Run: sudo cp nginx.conf /etc/nginx/sites-available/edustream"
  echo "        sudo ln -s /etc/nginx/sites-available/edustream /etc/nginx/sites-enabled/"
  echo "        sudo nginx -t && sudo systemctl reload nginx"
fi

echo ""
echo "══════════════════════════════════════════"
echo "  ✅  Deploy complete!"
echo "  App: http://$(curl -s ifconfig.me 2>/dev/null || echo YOUR_SERVER_IP)"
echo "══════════════════════════════════════════"
echo ""
echo "Useful commands:"
echo "  pm2 logs edustream       # live logs"
echo "  pm2 status               # process status"
echo "  pm2 restart edustream    # restart"
