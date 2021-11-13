#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '..' 'utils' 'script-executor.ps1')

$executor = $Debug ? [SequentialScriptExecutor]::new() : [ParallelScriptExecutor]::new()

$publishing = $Debug ? @() : @(@{Script = 'publish.ps1' })

$executor.Execute(@(
        @{Script = 'generate-code.ps1' },
        @{Script = 'install.ps1' }
    ) + $publishing)
