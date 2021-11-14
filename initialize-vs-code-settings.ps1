#!/usr/bin/pwsh
'Initializing VS Code configuration...' | Out-Host

$serverVsCodeSettingsDir = Join-Path '.' 'server' '.vscode'
$serverVsCodeSettings = Join-Path $serverVsCodeSettingsDir ($IsWindows ? 'settings-windows.json' : 'settings-linux.json')
Copy-Item -Path $serverVsCodeSettings -Destination (Join-Path $serverVsCodeSettingsDir 'settings.json') -Verbose
