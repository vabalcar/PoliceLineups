#!/usr/bin/pwsh
param(
    [string] $OutFile = (Join-Path 'src' 'admin-user.sql'),
    [string] $DBConfigFile = (Join-Path '..' 'config' 'db.json')
)

$DBConf = Get-Content -Path $DBConfigFile | ConvertFrom-Json

@"
CREATE USER IF NOT EXISTS '$($DBConf.user)'@'$($DBConf.host)' IDENTIFIED BY '$($DBConf.password)';
GRANT ALL PRIVILEGES ON * . * TO '$($DBConf.user)'@'$($DBConf.host)';
FLUSH PRIVILEGES;
"@ | Out-File -Path $OutFile

"Please run '$OutFile' as db's root user" | Out-host