#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $AsService
)

$isEnvironmentReady = & (Join-Path '.' 'environment' 'test.ps1') -PassThru
if (!$isEnvironmentReady) {
    exit
}

. (Join-Path '.' 'utils' 'script-executor.ps1')

$executor = [SequentialScriptExecutor]::new()

$commonArgs = $Debug ? @('-Debug') : @()
$buildArgs = @('-NoEnvironmentTest')
$runArgs = $AsService ? @('-AsService') : @()

$executor.Execute(@(
        @{Script = 'build.ps1'; ArgumentList = $commonArgs + $buildArgs },
        @{Script = 'run.ps1'; ArgumentList = $commonArgs + $runArgs }
    ))
