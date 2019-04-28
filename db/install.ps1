using namespace System.Text
using namespace System.IO

Param(
    [switch] $force
)

. (Join-Path '.' 'mysql.ps1')

Install-Mysql -DBConfigFile (Join-Path '..' 'config' 'db.json')
#Export-MysqlDB -DBConfigFile (Join-Path '..' 'config' 'db.json') -Path 'dumps' -Delimiter ';'
#Import-MysqlDB -Path (Join-Path 'dumps' '2019-04-28T12.16.34.6070484+02.00') -DBConfigFile (Join-Path '..' 'config' 'db.json') -Delimiter ';' -Purge
