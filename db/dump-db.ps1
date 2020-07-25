#!/usr/bin/pwsh
param(
    [string] $Path = (Join-Path 'data' 'dumps'),
    [string] $DBConfigFile = (Join-Path '..' 'config' 'db.json')
)

. (Join-Path '..' 'common' 'pwsh' 'mysql.ps1')

"Dumping DB into $Path..." | Out-Host
Export-MysqlDB -DBConfigFile $DBConfigFile -Path $Path -Delimiter ';'
'done.' | Out-Host