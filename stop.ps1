#!/usr/bin/pwsh
. (Join-Path '.' 'utils' 'script-executor.ps1')

$serviceExecutor = [ServiceScriptExecutor]::new()
$serviceExecutor.TerminateAllExecutions()
