#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoConfigurationValidation
)

'Building proxy...' | Out-Host

. (Join-Path '..' 'utils' 'script-executor.ps1')

$executor = [SequentialScriptExecutor]::new()

$commonArgs = $Debug ? @('-Debug') : @()

$certificateGenerationArgs = $NoConfigurationValidation ? @('-NoConfigurationValidation') : @()
$certificateGeneration = $Debug ? @(@{Script = 'generate-certificate.ps1'; ArgumentList = $certificateGenerationArgs }) : @()

$executor.Execute(@(
        @{Script = 'install.ps1' },
        @{Script = 'compile.ps1'; ArgumentList = $commonArgs }
    ) + $certificateGeneration)

'Proxy built' | Out-Host
