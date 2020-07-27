#!/usr/bin/pwsh
param(
    [string] $Path = (Join-Path 'data' 'init'),
    [switch] $Force,
    [string] $DBConfigFile = (Join-Path '..' 'config' 'db.json')
)

. (Join-Path '..' 'pwsh' 'libs' 'mysql.ps1')

$DBConf = Get-Content -Path $DBConfigFile | ConvertFrom-Json
"Importing DB '$($DBConf.db)'..." | Out-Host
Import-MysqlDB -Path $Path -DBConfigFile $DBConfigFile -Delimiter ';' -Purge:$Force