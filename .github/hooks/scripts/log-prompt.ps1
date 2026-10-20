$ErrorActionPreference = "Stop"

$inputObj = [Console]::In.ReadToEnd() | ConvertFrom-Json
$hookRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$logDir = Join-Path $hookRoot "logs"
$logFile = Join-Path $logDir "audit.jsonl"

if (-not (Test-Path $logDir)) {
  New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

$prompt = if ($null -eq $inputObj.prompt) { "" } else { [string]$inputObj.prompt }

# Keep the audit record evidence-light: do not persist prompt content.
$logEntry = @{
  event        = "userPromptSubmitted"
  timestampMs  = $inputObj.timestamp
  cwd          = $inputObj.cwd
  promptLength = $prompt.Length
} | ConvertTo-Json -Compress

Add-Content -Path $logFile -Value $logEntry
exit 0
