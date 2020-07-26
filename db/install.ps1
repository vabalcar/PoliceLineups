#!/usr/bin/pwsh
param(
    [switch] $NoImport,
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

'constants.sql', 'procedures.sql', 'tables.sql' | ForEach-Object {
    [MysqlScript]::new((Join-Path 'src' $_))
} | Invoke-Mysql -DBConfigFile $DBConfigFile -Force:$Force

if (!$NoImport) {
    & (Join-Path '.' 'import-db.ps1') -Force:$Force
}

@{
    Installed = $true
} | ConvertTo-Json | Out-File -Path $installInfoFile