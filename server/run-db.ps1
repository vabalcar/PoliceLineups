#!/usr/bin/pwsh
param (
    [string] $MysqlService = 'mysql'
)

'Running db...' | Out-Host
if ($IsWindows) {
    $dbStatus = (Get-Service $MysqlService).Status

    if ($dbStatus -ne 'Running') {
        Start-Process -Wait -Verb RunAs -FilePath 'pwsh' -Args '-NoLogo', '-Command', "Start-Service $MysqlService"
        $dbStatus = (Get-Service $MysqlService).Status
    }

    "DB (service $MysqlService) is $($dbStatus.ToString().ToLower())" | Out-Host
}
else {
    & sudo service $MysqlService start
}
