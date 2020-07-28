#!/usr/bin/pwsh
param (
    [string] $MysqlService = $IsWindows ? 'MYSQL80' : 'mysql'
)

'Running db...' | Out-Host
if ($IsWindows) {
    $dbStatus = (Get-Service $MysqlService).Status

    if ($dbStatus -ne 'Running') {
        Start-Process -Wait -Verb RunAs -FilePath 'pwsh' -Args '-NoLogo', '-Command', "Start-Service $MysqlService"
        $dbStatus = (Get-Service $MysqlService).Status
    }

    "DB (service $MysqlService) is $($dbStatus.ToString().ToLower())" | Out-Host
} else {
    if (Get-Command -CommandType Application -TotalCount 1 -Name 'genie' -ErrorAction SilentlyContinue) {
        # WSL 2 support
        & genie -c sudo systemctl start $MysqlService
        & genie -c sudo systemctl status $MysqlService
    } else {
        & sudo systemctl start $MysqlService
        & sudo systemctl status $MysqlService
    }
}