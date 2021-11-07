#!/usr/bin/pwsh
'Stopping all scripts run as a service...' | Out-Host

Start-Process -PassThru -NoNewWindow -Path 'pwsh' -ArgumentList '-NoLogo', '-Command', ". (Join-Path '.' 'utils' 'script-executor.ps1'); [ServiceScriptExecutor]::new().TerminateAllExecutions()"
| Wait-Process

'done.' | Out-Host
