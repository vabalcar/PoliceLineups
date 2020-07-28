#!/usr/bin/pwsh
using namespace System.IO

param(
    [string] $OutputDirectory = 'src',
    [string] $AdminUserOutFile = (Join-Path $OutputDirectory 'admin-user.sql'),
    [string] $ConstantsOutFile = (Join-Path $OutputDirectory 'constants.sql'),
    [string] $DBConfigFile = (Join-Path '..' 'config' 'db.json')
)

. (Join-Path '..' 'pwsh' 'libs' 'mysql.ps1')

$DBConf = Get-Content -Path $DBConfigFile | ConvertFrom-Json

"Generating DB SQL scripts into $OutputDirectory" | Out-Host

# Generate script to create admin user

@"
CREATE USER IF NOT EXISTS '$($DBConf.user)'@'$($DBConf.host)' IDENTIFIED BY '$($DBConf.password)';
GRANT ALL PRIVILEGES ON * . * TO '$($DBConf.user)'@'$($DBConf.host)';
FLUSH PRIVILEGES;
"@ | Out-File -Path $AdminUserOutFile

"'$($DBConf.user)'@'$($DBConf.host)' DB user creation has been generated into '$AdminUserOutFile'" | Out-Host

# Generate script to create constant functions

Get-MysqlConstDecl -Type 'string' -Name 'PATH_DELIMITER' -Value ([Path]::DirectorySeparatorChar -replace '\\', '\\') | Out-File $ConstantsOutFile

"constant function creations have been generated into '$ConstantsOutFile'" | Out-Host
'done.' | Out-Host