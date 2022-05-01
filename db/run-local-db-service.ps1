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

$serviceName = (Get-Content $dbConfigurationFile | ConvertFrom-Json).service
if (!$serviceName) {
    "Name of DB service isn't configured" | Out-Host
    if ($PassThru) {
        return $false
    }
    exit
}

$result = & (Join-Path $PSScriptRoot 'run-local-service.ps1') -ServiceName $serviceName -PassThru

if ($PassThru) {
    return $result
}
