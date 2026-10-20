#!/usr/bin/env bash

set -euo pipefail

INPUT="$(cat)"
HOOK_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$HOOK_ROOT/logs"
LOG_FILE="$LOG_DIR/audit.jsonl"

mkdir -p "$LOG_DIR"
chmod 700 "$LOG_DIR"

TOOL_NAME="$(printf '%s' "$INPUT" | jq -r '.toolName // empty')"
TOOL_ARGS_RAW="$(printf '%s' "$INPUT" | jq -r '.toolArgs // empty')"

redact() {
  sed -E \
    -e 's/ghp_[A-Za-z0-9]{20,}/[REDACTED_TOKEN]/g' \
    -e 's/gho_[A-Za-z0-9]{20,}/[REDACTED_TOKEN]/g' \
    -e 's/ghu_[A-Za-z0-9]{20,}/[REDACTED_TOKEN]/g' \
    -e 's/ghs_[A-Za-z0-9._-]{20,}/[REDACTED_TOKEN]/g' \
    -e 's/Bearer [A-Za-z0-9_.-]+/Bearer [REDACTED]/g' \
    -e 's/--password[= ][^ ]+/--password=[REDACTED]/g' \
    -e 's/--token[= ][^ ]+/--token=[REDACTED]/g'
}

REDACTED_TOOL_ARGS="$(printf '%s' "$TOOL_ARGS_RAW" | redact)"

jq -n \
  --arg tool "$TOOL_NAME" \
  --arg toolArgs "$REDACTED_TOOL_ARGS" \
  '{event:"preToolUse", toolName:$tool, toolArgs:$toolArgs}' \
  >> "$LOG_FILE"

# Only enforce command rules for bash.
if [ "$TOOL_NAME" != "bash" ]; then
  exit 0
fi

# If toolArgs is malformed, allow and retain the audit record.
if ! printf '%s' "$TOOL_ARGS_RAW" | jq -e . >/dev/null 2>&1; then
  exit 0
fi

COMMAND="$(printf '%s' "$TOOL_ARGS_RAW" | jq -r '.command // empty')"

deny() {
  local reason="$1"
  local redacted_command

  redacted_command="$(printf '%s' "$COMMAND" | redact)"
  jq -n \
    --arg cmd "$redacted_command" \
    --arg reason "$reason" \
    '{event:"policyDeny", toolName:"bash", command:$cmd, reason:$reason}' \
    >> "$LOG_FILE"

  jq -n \
    --arg reason "$reason" \
    '{permissionDecision:"deny", permissionDecisionReason:$reason}'

  exit 0
}

if printf '%s' "$COMMAND" | grep -qE '\b(sudo|su|runas)\b'; then
  deny "Privilege escalation requires manual approval."
fi

if printf '%s' "$COMMAND" | grep -qE 'rm\s+-rf\s*/($|\s)|rm\s+.*-rf\s*/($|\s)'; then
  deny "Destructive operations targeting the filesystem root require manual approval."
fi

if printf '%s' "$COMMAND" | grep -qE '\b(mkfs|dd|format)\b'; then
  deny "System-level destructive operations are not allowed via automated execution."
fi

if printf '%s' "$COMMAND" | grep -qE 'curl.*\|\s*(bash|sh)|wget.*\|\s*(bash|sh)'; then
  deny "Download-and-execute patterns require manual approval."
fi

exit 0
