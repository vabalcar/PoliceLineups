#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoConfigurationValidation,
    [switch] $PassThru
)

$environment = $Debug ? 'debug' : 'production'
$dbConfigurationFile = Join-Path '..' 'config' $environment 'db.json'

$isDbConfigurationValid = $NoConfigurationValidation -or (& (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $dbConfigurationFile)
if (!$isDbConfigurationValid) {
    if ($PassThru) {
        return $false
    }
    exit
}

'Running DB...' | Out-Host

$dbConfiguration = Get-Content $dbConfigurationFile | ConvertFrom-Json
$serviceName = $dbConfiguration.service
$isServiceRunning = $false

if ($IsWindows) {
    $service = Get-Service $serviceName -ErrorAction SilentlyContinue
    if ($null -eq $service) {
        "Service $serviceName doesn't exist" | Out-Host
        if ($PassThru) {
            return $false
        }
        exit
    }

    $dbStatus = $service.Status
    $isServiceRunning = $dbStatus -eq 'Running'

    if (!$isServiceRunning) {
        Start-Process -Wait -Verb RunAs -FilePath 'pwsh' -Args '-NoLogo', '-Command', "Start-Service $service"
        $dbStatus = (Get-Service $service).Status
        $isServiceRunning = $dbStatus -eq 'Running'
    }

    "DB (service $service) is $($dbStatus.ToString().ToLower())" | Out-Host
}
else {
    & sudo service $serviceName start
    $isServiceRunning = $true
}

if ($PassThru) {
    return $isServiceRunning
}
