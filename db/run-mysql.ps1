$mysqlService = $IsWindows ? 'MYSQL80' : 'mysql'

if ($IsWindows) {
    if ((Get-Service $mysqlService).Status -ne 'Running') {
        Start-Service $mysqlService
    }
} else {
    & sudo service $mysqlService start
}