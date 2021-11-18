#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoConfigurationValidation,
    [switch] $NoPlatformTest
)

$isPlatformReady = $NoPlatformTest -or (& (Join-Path '.' 'platform' 'test.ps1') -PassThru)
if (!$isPlatformReady) {
    exit
}

$allConfigurationsValid = $NoConfigurationValidation -or (& (Join-Path '.' 'config' 'test-all.ps1') -Debug:$Debug)
if (!$allConfigurationsValid) {
    exit
}

. (Join-Path '.' 'utils' 'script-executor.ps1')

$sequentialExecutor = [SequentialScriptExecutor]::new()
$executor = $Debug ? $sequentialExecutor : [ParallelScriptExecutor]::new()

$commonArgs = @('-NoConfigurationValidation')
if ($Debug) {
    $commonArgs += '-Debug'
}

$sequentialExecutor.Execute(@(
        @{Script = 'initialize.ps1'; WD = 'config' },
        @{Script = 'install.ps1'; WD = 'api' }
    ))

$executor.Execute(@(
        @{Script = 'build.ps1'; WD = 'client'; ArgumentList = $commonArgs },
        @{Script = 'build.ps1'; WD = 'proxy'; ArgumentList = $commonArgs },
        @{Script = 'build.ps1'; WD = 'server' }
    ))
