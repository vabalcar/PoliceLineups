#!/usr/bin/pwsh
param(
    [switch] $Force,
    [string] $DBConfigFile = (Join-Path '..' 'config' 'db.json')
)

. (Join-Path '..' 'pwsh' 'libs' 'mysql.ps1')

$installInfoFile = 'install-info.json'
if (Test-Path $installInfoFile) {
    if ($Force) {
        Remove-Item $installInfoFile
    } elseif ((Get-Content -Path $installInfoFile | ConvertFrom-Json).Installed) {
        'DB already installed' | Out-Host
        exit
    }
}
$srcFolder = 'src'
(Get-MysqlConstantsInstall),[MysqlScript]::new((Join-Path $srcFolder 'procedures.sql')), [MysqlScript]::new((Join-Path $srcFolder 'schema.sql')) | Invoke-Mysql -DBConfigFile $DBConfigFile -Force:$Force
Import-MysqlDB -Path (Join-Path 'data' 'init') -DBConfigFile $DBConfigFile -Delimiter ';' -Purge:$Force

@{
    Installed = $true
} | ConvertTo-Json | Out-File -Path $installInfoFile