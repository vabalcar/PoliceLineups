$dbConfig = Get-Content (Join-Path '..' 'config' 'db.json') | ConvertFrom-Json
$password = $dbConfig.password
Get-Content 'init.sql' | & 'mysql' '-B' '-h' $dbConfig.host '-u' $dbConfig.user "-p$password" '-P' $dbConfig.port