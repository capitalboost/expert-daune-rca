#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST=/home2/expertdaunerca/public_html
BACKUPS=/home2/expertdaunerca/site-backups
cd "$ROOT"
test -f index.html
test -f .htaccess
mkdir -p "$DEST" "$BACKUPS"
test ! -L "$DEST"
STAGE="$(mktemp -d)"
trap 'rm -rf -- "$STAGE"' EXIT

# Copy only website files; never publish Git, scripts or preview tooling.
for dir in assets asiguratori confidentialitate contact despre-noi politica-cookies resurse servicii termeni-si-conditii; do
  cp -R "$dir" "$STAGE/"
done
find . -maxdepth 1 -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.xml' \) -exec cp '{}' "$STAGE/" \;
cp .htaccess "$STAGE/.htaccess"

# Production indexing, equivalent to INDEX_SITE=true in the Cloudflare build.
find "$STAGE" -type f -name '*.html' ! -name '404.html' -exec sed -i 's/<meta name="robots" content="[^"]*"[[:space:]]*\/*>/<meta name="robots" content="index, follow">/g' '{}' \;
printf 'User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://expertdaunerca.ro/sitemap.xml\n' > "$STAGE/robots.txt"
test -s "$STAGE/index.html"
test -s "$STAGE/sitemap.xml"
if grep -riE 'noindex' "$STAGE" --include='index.html'; then
  echo 'Deployment stopped: a website page still blocks indexing.' >&2
  exit 1
fi

# Keep the previous public directory outside the web root for recovery.
BACKUP="$BACKUPS/site-$(date +%Y%m%d-%H%M%S)-$$.tar.gz"
tar -czf "$BACKUP" -C "$DEST" .
cp -R "$STAGE/." "$DEST/"
echo "Published to $DEST. Previous files backed up to $BACKUP"
