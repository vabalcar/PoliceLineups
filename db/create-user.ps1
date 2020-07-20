$DBConfigFile = Join-Path '..' 'config' 'db.json'
$DBConf = Get-Content -Path $DBConfigFile | ConvertFrom-Json
$outFile = Join-Path '.' 'create-user.sql'

@"
CREATE USER IF NOT EXISTS '$($DBConf.user)'@'$($DBConf.host)' IDENTIFIED BY '$($DBConf.password)';
GRANT ALL PRIVILEGES ON * . * TO '$($DBConf.user)'@'$($DBConf.host)';
FLUSH PRIVILEGES;
"@ | Out-File -Path $outFile

"Please run '$outFile' as db's root user" | Out-host