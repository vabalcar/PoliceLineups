#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$commonArgs = $Debug ? @('-Debug') : @()

[Executor]::ExecuteSequentially(@(
        @{Script = 'build.ps1'; ArgumentList = $commonArgs },
        @{Script = 'run.ps1'; ArgumentList = $commonArgs }
    ))
