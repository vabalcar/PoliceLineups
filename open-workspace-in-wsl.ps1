#!/usr/bin/pwsh
if (!$IsWindows) {
    'This script is meant to be run only on Windows' | Out-Host
    exit
}

'Initializing VS Code configuration...' | Out-Host

$serverVsCodeSettingsDir = Join-Path '.' 'server' '.vscode'
Copy-Item -Path (Join-Path $serverVsCodeSettingsDir 'settings-linux.json') -Destination (Join-Path $serverVsCodeSettingsDir 'settings.json') -Verbose

& wsl -- code ./policeLineups.code-workspace
