#!/usr/bin/env sh
set -eu

envsubst '${API}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"