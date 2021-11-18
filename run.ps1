#!/usr/bin/pwsh
param (
    [switch] $AsService,
    [switch] $Debug,
    [switch] $NoConfigurationValidation
)

$allConfigurationsValid = $NoConfigurationValidation -or (& (Join-Path '.' 'config' 'test-all.ps1') -Debug:$Debug)
if (!$allConfigurationsValid) {
    exit
}

. (Join-Path '.' 'utils' 'script-executor.ps1')

$commonArgs = @('-NoConfigurationValidation')
if ($Debug) {
    $commonArgs += '-Debug'
}

$clientArgs = $Debug ? @() : @('-NonInteractive')

$executor = $AsService ? [ServiceScriptExecutor]::new() : $Debug -and $IsWindows ? [ExternalScriptExecutor]::new() : [ParallelScriptExecutor]::new()

$executor.Execute(@(
        @{Script = 'run.ps1'; WD = 'client'; ArgumentList = $commonArgs + $clientArgs },
        @{Script = 'run.ps1'; WD = 'proxy'; ArgumentList = $commonArgs },
        @{Script = 'run.ps1'; WD = 'server'; ArgumentList = $commonArgs }
    ))
