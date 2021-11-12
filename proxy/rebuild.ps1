#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '..' 'utils' 'script-executor.ps1')

$executor = [SequentialScriptExecutor]::new()

$commonArgs = $Debug ? @('-Debug') : @()

$executor.Execute(@(
        @{Script = 'clean.ps1' },
        @{Script = 'build.ps1'; ArgumentList = $commonArgs }
    ))
