$serverVsCodeSettingsDir = Join-Path '.' 'server' '.vscode'
Copy-Item -Path (Join-Path $serverVsCodeSettingsDir 'settings-windows.json') -Destination (Join-Path $serverVsCodeSettingsDir 'settings.json')
& code policeLineups.code-workspace *> $null
