#!/usr/bin/pwsh
param(
    [switch] $SkipUserCreationMessage,
    [switch] $NoImport,
    [switch] $Force,
    [string] $DBConfigFile = (Join-Path '..' 'config' 'db.json')
)

. (Join-Path '..' 'pwsh' 'libs' 'io.ps1')
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

$srcDir = 'src'

if (!$SkipUserCreationMessage) {
    $DBConf = Get-Content -Path $DBConfigFile | ConvertFrom-Json
    @"
Please ensure that $($DBConf.user) exists in the db at $($DBConf.host) and has all priviligies.
You can do it by running '$(Join-Path $srcDir 'admin-user.sql')' in the db as its root user.
You can safely continue to DB installation if/after these conditions are met.
"@ | Out-host
    Wait-AnyKeyPress
}

'constants.sql', 'procedures.sql', 'tables.sql' | ForEach-Object {
    [MysqlScript]::new((Join-Path $srcDir $_))
} | Invoke-Mysql -DBConfigFile $DBConfigFile -Force:$Force

if (!$NoImport) {
    & (Join-Path '.' 'import-db.ps1') -Force:$Force
}

@{
    Installed = $true
} | ConvertTo-Json | Out-File -Path $installInfoFile