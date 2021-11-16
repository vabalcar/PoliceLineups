#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Running db...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$dbConfiguration = Get-Content (Join-Path '..' 'config' $environment 'db.json') | ConvertFrom-Json

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
