#!/usr/bin/pwsh
param (
    [string] $MysqlService = $IsWindows ? 'MYSQL80' : 'mysql'
)

$dbStatus = (Get-Service $MysqlService).Status

if ($dbStatus -ne 'Running') {
    if ($IsWindows) {
        Start-Process -Wait -Verb RunAs -FilePath 'pwsh' -Args '-NoLogo', '-Command', "Start-Service $MysqlService"
    } else {
        & sudo service $MysqlService start
    }
    $dbStatus = (Get-Service $MysqlService).Status
}

"DB (service $MysqlService) is $($dbStatus.ToString().ToLower())" | Out-Host