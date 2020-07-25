#!/usr/bin/pwsh
param(
    [string] $Path = (Join-Path 'data' 'init'),
    [switch] $Force,
    [string] $DBConfigFile = (Join-Path '..' 'config' 'db.json')
)

. (Join-Path '..' 'common' 'pwsh' 'mysql.ps1')

Import-MysqlDB -Path $Path -DBConfigFile $DBConfigFile -Delimiter ';' -Purge:$Force