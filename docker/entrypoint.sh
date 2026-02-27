#!/bin/sh
set -eu

mkdir -p /app/data

if [ -n "${DATABASE_URL:-}" ]; then
  echo "Applying Prisma schema..."
  ./node_modules/.bin/prisma db push --skip-generate
fi

exec "$@"
