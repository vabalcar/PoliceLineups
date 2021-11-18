#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoConfigurationValidation,
    [switch] $PassThru
)

'Running DB...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$dbConfigurationFile = Join-Path '..' 'config' $environment 'db.json'

$isDbConfigurationValid = $NoConfigurationValidation -or (& (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $dbConfigurationFile)
if (!$isDbConfigurationValid) {
    if ($PassThru) {
        return $false
    }
    exit
}

$dbConfiguration = Get-Content $dbConfigurationFile | ConvertFrom-Json

$service = $dbConfiguration.service

if ($IsWindows) {
    $dbStatus = (Get-Service $service).Status

    if ($dbStatus -ne 'Running') {
        Start-Process -Wait -Verb RunAs -FilePath 'pwsh' -Args '-NoLogo', '-Command', "Start-Service $service"
        $dbStatus = (Get-Service $service).Status
    }

    "DB (service $service) is $($dbStatus.ToString().ToLower())" | Out-Host
}
else {
    & sudo service $service start
}

if ($PassThru) {
    return $true
}
