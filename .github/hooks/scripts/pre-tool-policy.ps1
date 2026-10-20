$ErrorActionPreference = "Stop"

$inputObj = [Console]::In.ReadToEnd() | ConvertFrom-Json
$toolName = [string]$inputObj.toolName
$toolArgsRaw = [string]$inputObj.toolArgs
$hookRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$logDir = Join-Path $hookRoot "logs"
$logFile = Join-Path $logDir "audit.jsonl"

if (-not (Test-Path $logDir)) {
  New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

function Redact([string]$value) {
  return $value `
    -replace 'ghp_[A-Za-z0-9]{20,}', '[REDACTED_TOKEN]' `
    -replace 'gho_[A-Za-z0-9]{20,}', '[REDACTED_TOKEN]' `
    -replace 'ghu_[A-Za-z0-9]{20,}', '[REDACTED_TOKEN]' `
    -replace 'ghs_[A-Za-z0-9._-]{20,}', '[REDACTED_TOKEN]' `
    -replace 'Bearer [A-Za-z0-9_.-]+', 'Bearer [REDACTED]' `
    -replace '--password[= ][^ ]+', '--password=[REDACTED]' `
    -replace '--token[= ][^ ]+', '--token=[REDACTED]'
}

(@{
  event    = "preToolUse"
  toolName = $toolName
  toolArgs = Redact $toolArgsRaw
} | ConvertTo-Json -Compress) | Add-Content -Path $logFile

if ($toolName -ne "bash") { exit 0 }

try {
  $toolArgs = $toolArgsRaw | ConvertFrom-Json
} catch {
  exit 0
}

$command = [string]$toolArgs.command

function Deny([string]$reason) {
  (@{
    event     = "policyDeny"
    toolName  = "bash"
    command   = Redact $command
    reason    = $reason
  } | ConvertTo-Json -Compress) | Add-Content -Path $logFile

  (@{
    permissionDecision       = "deny"
    permissionDecisionReason = $reason
  } | ConvertTo-Json -Compress)

  exit 0
}

if ($command -match '\b(sudo|su|runas)\b') {
  Deny "Privilege escalation requires manual approval."
}

if ($command -match 'rm\s+-rf\s*/(\s|$)|rm\s+.*-rf\s*/(\s|$)') {
  Deny "Destructive operations targeting the filesystem root require manual approval."
}

if ($command -match '\b(mkfs|dd|format)\b') {
  Deny "System-level destructive operations are not allowed via automated execution."
}

if ($command -match 'curl.*\|\s*(bash|sh)|wget.*\|\s*(bash|sh)') {
  Deny "Download-and-execute patterns require manual approval."
}

exit 0
