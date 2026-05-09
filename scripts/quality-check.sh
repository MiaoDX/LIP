#!/usr/bin/env bash
set -euo pipefail

if [ "${1:-}" != "" ]; then
  cd "$1"
fi

node scripts/quality-check.mjs
