#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $AsService
)

$isPlatformReady = & (Join-Path '.' 'platform' 'test.ps1') -PassThru
if (!$isPlatformReady) {
    exit
}

$allConfigurationsValid = & (Join-Path '.' 'config' 'test-all.ps1') -Debug:$Debug -PassThru
if (!$allConfigurationsValid) {
    exit
}

. (Join-Path '.' 'utils' 'script-executor.ps1')

$executor = [SequentialScriptExecutor]::new()

$commonArgs = $Debug ? @('-Debug') : @()

$buildArgs = @('-NoConfigurationValidation', '-NoPlatformTest')

$runArgs = @('-NoConfigurationValidation')
if ($AsService) {
    $runArgs += '-AsService'
}

$executor.Execute(@(
        @{Script = 'build.ps1'; ArgumentList = $commonArgs + $buildArgs },
        @{Script = 'run.ps1'; ArgumentList = $commonArgs + $runArgs }
    ))
