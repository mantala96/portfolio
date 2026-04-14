#!/bin/sh
set -e

DOMAIN="${DOMAIN:?DOMAIN env var is required}"
CMS_DOMAIN="${CMS_DOMAIN:?CMS_DOMAIN env var is required}"
EMAIL="${CERTBOT_EMAIL:?CERTBOT_EMAIL env var is required}"
WEBROOT="/var/www/certbot"
LE_DIR="/etc/letsencrypt/live"

log() { echo "[nginx-certbot] $*"; }

# ── Build nginx.conf from template ─────────────────────────────────────────
# Only substitute our vars; leave nginx vars ($host, $remote_addr, etc.) alone
envsubst '${DOMAIN} ${CMS_DOMAIN}' \
    < /etc/nginx/nginx.conf.template \
    > /etc/nginx/nginx.conf

# ── Generate a temporary self-signed cert so nginx can start with SSL ──────
self_signed() {
    local domain="$1"
    local dir="$LE_DIR/$domain"
    [ -f "$dir/fullchain.pem" ] && return 0
    log "No cert found for $domain — generating temporary self-signed cert ..."
    mkdir -p "$dir"
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "$dir/privkey.pem" \
        -out    "$dir/fullchain.pem" \
        -subj   "/CN=$domain" 2>/dev/null
}

# ── Request a real cert via certbot webroot ─────────────────────────────────
certbot_issue() {
    local domain="$1"
    # Remove self-signed cert so certbot uses the correct directory name.
    # If a real cert already exists (renewal config present), leave it alone.
    if [ ! -f "/etc/letsencrypt/renewal/$domain.conf" ]; then
        rm -rf "$LE_DIR/$domain"
    fi
    log "Requesting Let's Encrypt certificate for $domain ..."
    certbot certonly --webroot \
        --webroot-path="$WEBROOT" \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --keep-until-expiring \
        --non-interactive \
        -d "$domain"
}

mkdir -p "$WEBROOT"

# Bootstrap: create self-signed certs so nginx can start without errors
self_signed "$DOMAIN"
self_signed "$CMS_DOMAIN"

# Start nginx (serves port 80 for ACME challenge and port 443 with self-signed)
log "Starting nginx ..."
nginx

sleep 3

# Obtain real certs (nginx is already serving the webroot challenge on port 80)
certbot_issue "$DOMAIN"
certbot_issue "$CMS_DOMAIN"

# Reload nginx to switch from self-signed to real certs
log "Reloading nginx with real certificates ..."
nginx -s reload

# Renewal loop — certbot renews ~30 days before expiry
log "Entering renewal loop (checks every 12h) ..."
while :; do
    sleep 12h &
    wait $!
    log "Running certbot renew ..."
    certbot renew --quiet --webroot --webroot-path="$WEBROOT"
    nginx -s reload
done
