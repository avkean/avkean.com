#!/bin/sh
set -e
mkdir -p /var/lib/tor/hidden_service
cp /keys/hs_ed25519_secret_key /keys/hs_ed25519_public_key /keys/hostname /var/lib/tor/hidden_service/
chmod 700 /var/lib/tor /var/lib/tor/hidden_service
chmod 600 /var/lib/tor/hidden_service/*
chown -R tor:tor /var/lib/tor
exec tor -f /etc/tor/torrc
