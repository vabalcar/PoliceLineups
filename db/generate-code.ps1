#!/usr/bin/pwsh
using namespace System.IO

param(
    [string] $AdminUserOutFile = (Join-Path 'src' 'admin-user.sql'),
    [string] $ConstantsOutFile = (Join-Path 'src' 'constants.sql'),
    [string] $DBConfigFile = (Join-Path '..' 'config' 'db.json')
)

. (Join-Path '..' 'pwsh' 'libs' 'mysql.ps1')

$DBConf = Get-Content -Path $DBConfigFile | ConvertFrom-Json

# Generate script to create admin user

@"
CREATE USER IF NOT EXISTS '$($DBConf.user)'@'$($DBConf.host)' IDENTIFIED BY '$($DBConf.password)';
GRANT ALL PRIVILEGES ON * . * TO '$($DBConf.user)'@'$($DBConf.host)';
FLUSH PRIVILEGES;
"@ | Out-File -Path $AdminUserOutFile

"Please run '$AdminUserOutFile' as db's root user" | Out-host

# Generate script to create constant functions

Get-MysqlConstDecl -Type 'string' -Name 'PATH_DELIMITER' -Value ([Path]::DirectorySeparatorChar -replace '\\', '\\') | Out-File $ConstantsOutFile

"Constant function declarations have been generated into $ConstantsOutFile" | Out-Host