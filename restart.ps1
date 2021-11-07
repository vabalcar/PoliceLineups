#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$executor = [SequentialScriptExecutor]::new()

$commonArgs = $Debug ? @('-Debug') : @()

$executor.Execute(@(
        @{Script = 'stop.ps1'; },
        @{Script = 'start.ps1'; ArgumentList = $commonArgs }
    ))
