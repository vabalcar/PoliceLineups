#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Building proxy...' | Out-Host

. (Join-Path '..' 'utils' 'script-executor.ps1')

$executor = [SequentialScriptExecutor]::new()

$commonArgs = $Debug ? @('-Debug') : @()

$certificateGeneration = $Debug ? @(@{Script = 'generate-certificate.ps1' }) : @()

$executor.Execute(@(
        @{Script = 'install.ps1' },
        @{Script = 'compile.ps1'; ArgumentList = $commonArgs }
    ) + $certificateGeneration)

'Proxy built' | Out-Host
