#!/bin/sh
# Startet den Anfrage-Server (mit automatischem Neustart) und danach nginx im Vordergrund.
set -e
(
  while true; do
    node /srv/server.mjs || true
    echo "Anfrage-Server beendet – Neustart in 2 Sekunden" >&2
    sleep 2
  done
) &
exec nginx -g 'daemon off;'
