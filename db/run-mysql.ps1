$mysqlService = 'MYSQL80'

if ((Get-Service $mysqlService).Status -ne 'Running') {
    Start-Service $mysqlService
}