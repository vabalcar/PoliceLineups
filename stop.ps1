#!/usr/bin/pwsh
'Stopping all scripts run as a service...' | Out-Host

. (Join-Path '.' 'utils' 'script-executor.ps1')

$executor = [ServiceScriptExecutor]::new()
$executor.TerminateAllExecutions()

if (!$IsWindows) {
    & stty sane
}

'done.' | Out-Host
