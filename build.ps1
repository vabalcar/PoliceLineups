#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$sequentialExecutor = [SequentialScriptExecutor]::new()
$executor = $Debug ? $sequentialExecutor : [ParallelScriptExecutor]::new()

$commonArgs = $Debug ? @('-Debug') : @()

$sequentialExecutor.Execute(@(
        @{Script = 'install.ps1'; WD = 'api' },
        @{Script = 'generate-code.ps1'; ArgumentList = $commonArgs }
    ))

$executor.Execute(@(
        @{Script = 'install.ps1'; WD = 'client' },
        @{Script = 'build.ps1'; WD = 'proxy' },
        @{Script = 'install.ps1'; WD = 'server' }
    ))
