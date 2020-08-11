#!/usr/bin/pwsh
param (
    [switch] $NoDump,
    [string] $DumpPath = (Join-Path 'data' 'dumps'),
    [string] $DumpCsvDelimiter = ';',
    [string] $DBConfigFile = (Join-Path '..' 'config' 'db.json')
)

. (Join-Path '..' 'pwsh' 'libs' 'git.ps1')
. (Join-Path '..' 'pwsh' 'libs' 'mysql.ps1')

if (!$NoDump) {
    & (Join-Path '.' 'dump-db.ps1') -DBConfigFile $DBConfigFile -Path $DumpPath -CsvDelimiter $DumpCsvDelimiter
}
"Uninstalling db '$((Get-Content -Path $DBConfigFile | ConvertFrom-Json).db)'" | Out-Host
Remove-MysqlDB -DBConfigFile $DBConfigFile
Remove-GitIgnoredFiles -CleanIgnoreFile '.cleanignore'
