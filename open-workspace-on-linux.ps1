#!/usr/bin/pwsh
if ($IsWindows) {
    'This script is not meant to be run on Windows' | Out-Host
    exit
}

'Initializing VS Code configuration...' | Out-Host

$serverVsCodeSettingsDir = Join-Path '.' 'server' '.vscode'
Copy-Item -Path (Join-Path $serverVsCodeSettingsDir 'settings-linux.json') -Destination (Join-Path $serverVsCodeSettingsDir 'settings.json') -Verbose

& code policeLineups.code-workspace *> $null
