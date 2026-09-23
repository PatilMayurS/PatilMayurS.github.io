#!/usr/bin/env bash
# Run npm scripts with the project-local Node in .node/ (falls back to system Node).
#   ./dev.sh            → npm run dev
#   ./dev.sh build      → npm run build
#   ./dev.sh preview    → npm run preview
#   ./dev.sh install    → npm install
set -euo pipefail
cd "$(dirname "$0")"
[ -x .node/bin/node ] && export PATH="$PWD/.node/bin:$PATH"
cmd="${1:-dev}"; shift || true
if [ "$cmd" = install ]; then exec npm install "$@"; fi
exec npm run "$cmd" -- "$@"
