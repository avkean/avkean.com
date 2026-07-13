#!/bin/sh
# keys are mounted read-only at /keys; tor wants them 0600 under a 0700 dir
set -e
mkdir -p /var/lib/tor/hidden_service
cp /keys/hs_ed25519_secret_key /keys/hs_ed25519_public_key /keys/hostname /var/lib/tor/hidden_service/
chown -R tor:tor /var/lib/tor
chmod 700 /var/lib/tor /var/lib/tor/hidden_service
chmod 600 /var/lib/tor/hidden_service/*
exec tor -f /etc/tor/torrc
