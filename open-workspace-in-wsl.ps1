$serverVsCodeSettingsDir = Join-Path '.' 'server' '.vscode'
Copy-Item -Path (Join-Path $serverVsCodeSettingsDir 'settings-linux.json') -Destination (Join-Path $serverVsCodeSettingsDir 'settings.json')
& wsl -- code ./policeLineups.code-workspace
