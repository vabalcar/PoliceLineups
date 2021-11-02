#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$sequentialExecutor = [SequentialScriptExecutor]::new()
$executor = $Debug ? $sequentialExecutor : [ParallelScriptExecutor]::new()

$commonArgs = $Debug ? @('-Debug') : @()

$sequentialExecutor.Execute(@(
        @{Script = 'install.ps1'; WD = 'api' }
    ))

$executor.Execute(@(
        @{Script = 'build.ps1'; WD = 'client'; ArgumentList = $commonArgs },
        @{Script = 'build.ps1'; WD = 'proxy'; ArgumentList = $commonArgs },
        @{Script = 'build.ps1'; WD = 'server' }
    ))
