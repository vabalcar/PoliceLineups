#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$commonArgs = $Debug ? @('-Debug') : @()
$clientArgs = $Debug ? @() : @('-NonInteractive')

$executor = $Debug -and $IsWindows ? [ExternalScriptExecutor]::new() : [ParallelScriptExecutor]::new()

$executor.Execute(@(
        @{Script = 'run.ps1'; WD = 'client'; ArgumentList = $commonArgs + $clientArgs },
        @{Script = 'run.ps1'; WD = 'proxy'; ArgumentList = $commonArgs },
        @{Script = 'run.ps1'; WD = 'server'; ArgumentList = $commonArgs }
    ))
