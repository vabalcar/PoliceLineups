#!/usr/bin/pwsh
param(
    [string] $Path = (Join-Path 'data' 'dumps'),
    [string] $CsvDelimiter = ';',
    [string] $DBConfigFile = (Join-Path '..' 'config' 'db.json')
)

. (Join-Path '..' 'pwsh' 'libs' 'mysql.ps1')

if ((Get-MysqlVariable -DBConfigFile $DBConfigFile -Name 'secure_file_priv') -ne '') {
    "Dumping DB won't work until secure_file_priv is set to '' (empty string)" | Out-Host
} else {
    $DBConf = Get-Content -Path $DBConfigFile | ConvertFrom-Json
    "Dumping DB '$($DBConf.db)' into $Path..." | Out-Host
    Export-MysqlDB -DBConfigFile $DBConfigFile -Path $Path -Delimiter $CsvDelimiter
    'done.' | Out-Host
}