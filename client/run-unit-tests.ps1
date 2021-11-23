#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoConfigurationValidation
)

'Running unit tests of client...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$testsConfigurationFile = Join-Path '..' 'config' $environment 'tests.json'

$isTestsConfigurationValid = $NoConfigurationValidation -or (& (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $testsConfigurationFile)
if (!$isTestsConfigurationValid) {
    exit
}

try {
    $env:POLICE_LINEUPS_KARMA_ENV = $environment
    & npm run test
}
finally {
    $env:POLICE_LINEUPS_KARMA_ENV = $null
    'Unit tests of client stopped' | Out-Host
}
