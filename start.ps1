#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$executor = [SequentialScriptExecutor]::new()

$commonArgs = $Debug ? @('-Debug') : @()
$runArgs = @('-AsService')

$executor.Execute(@(
        @{Script = 'run.ps1'; ArgumentList = $commonArgs + $runArgs }
    ))
