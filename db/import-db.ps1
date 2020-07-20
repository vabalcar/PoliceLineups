Param(
    [string] $Path = (Join-Path 'data' 'init'),
    [switch] $Force
)

. (Join-Path '.' 'mysql.ps1')

$DBConfigFile = Join-Path '..' 'config' 'db.json'
Import-MysqlDB -Path $Path -DBConfigFile $DBConfigFile -Delimiter ';' -Purge:$Force