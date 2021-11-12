#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $WhatIf
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$executor = $Debug ? [SequentialScriptExecutor]::new() : [ParallelScriptExecutor]::new()

$commonArgs = $WhatIf ? @('-WhatIf') : @()

$executor.Execute(@(
        @{Script = 'clean.ps1'; WD = 'api'; ArgumentList = $commonArgs },
        @{Script = 'clean.ps1'; WD = 'client'; ArgumentList = $commonArgs },
        @{Script = 'clean.ps1'; WD = 'proxy'; ArgumentList = $commonArgs },
        @{Script = 'clean.ps1'; WD = 'server'; ArgumentList = $commonArgs }
    ))
