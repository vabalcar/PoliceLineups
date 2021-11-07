#!/usr/bin/pwsh
Start-Process -Wait -NoNewWindow -Path 'pwsh' -ArgumentList '-NoLogo', '-Command', ". (Join-Path '.' 'utils' 'script-executor.ps1'); [ServiceScriptExecutor]::new().TerminateAllExecutions()"
