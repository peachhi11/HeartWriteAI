#!/usr/bin/env bash

set -euo pipefail

INPUT="$(cat)"
HOOK_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$HOOK_ROOT/logs"
LOG_FILE="$LOG_DIR/audit.jsonl"

mkdir -p "$LOG_DIR"
chmod 700 "$LOG_DIR"

TIMESTAMP_MS="$(printf '%s' "$INPUT" | jq -r '.timestamp // empty')"
CWD="$(printf '%s' "$INPUT" | jq -r '.cwd // empty')"
PROMPT_LENGTH="$(printf '%s' "$INPUT" | jq -r '(.prompt // "") | length')"

# Keep the audit record evidence-light: do not persist prompt content.
jq -n \
  --arg ts "$TIMESTAMP_MS" \
  --arg cwd "$CWD" \
  --argjson promptLength "$PROMPT_LENGTH" \
  '{event:"userPromptSubmitted", timestampMs:$ts, cwd:$cwd, promptLength:$promptLength}' \
  >> "$LOG_FILE"

exit 0
