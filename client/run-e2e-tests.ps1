#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoConfigurationValidation
)

$environment = $Debug ? 'debug' : 'production'
$testsConfigurationFile = Join-Path '..' 'config' $environment 'tests.json'

$isTestsConfigurationValid = $NoConfigurationValidation -or (& (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $testsConfigurationFile)
if (!$isTestsConfigurationValid) {
    exit
}

'Running e2e tests of client...' | Out-Host

$testsConfiguration = Get-Content $testsConfigurationFile | ConvertFrom-Json

try {
    & npm run e2e -- --host $testsConfiguration.e2eClientHost --port $testsConfiguration.e2eClientPort
}
finally {
    'e2e tests of client stopped' | Out-Host
}
