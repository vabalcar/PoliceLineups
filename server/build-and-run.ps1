#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '..' 'utils' 'script-executor.ps1')

$executor = [SequentialScriptExecutor]::new()

$commonArgs = $Debug ? @('-Debug') : @()

$executor.Execute(@(
        @{Script = 'build.ps1'; ArgumentList = $commonArgs },
        @{Script = 'run.ps1'; ArgumentList = $commonArgs }
    ))
