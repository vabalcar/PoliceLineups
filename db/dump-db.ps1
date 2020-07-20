. (Join-Path '.' 'mysql.ps1')

$DBConfigFile = Join-Path '..' 'config' 'db.json'
$targetFolder = Join-Path '.' 'data' 'dumps'
"Dumping DB into $targetFolder..." | Out-Host
Export-MysqlDB -DBConfigFile $DBConfigFile -Path (Join-Path 'data' 'dumps') -Delimiter ';'
"done."