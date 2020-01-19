Param(
    [switch] $force
)

. (Join-Path '.' 'mysql.ps1')

$installInfoFile = 'install-info.json'
if (Test-Path $installInfoFile) {
    if ($force) {
        Remove-Item $installInfoFile
    } elseif ((Get-Content -Path $installInfoFile | ConvertFrom-Json).Installed) {
        "DB already installed" | Out-Host
        exit
    }
}

$DBConfigFile = Join-Path '..' 'config' 'db.json'
(Get-MysqlConstantsInstall), [MysqlScript]::new('procedures.sql'), [MysqlScript]::new('schema.sql') | Invoke-Mysql -DBConfigFile $DBConfigFile -Force:$force
Import-MysqlDB -Path (Join-Path 'data' 'init') -DBConfigFile $DBConfigFile -Delimiter ';' -Purge:$force

@{
    Installed = $true
} | ConvertTo-Json | Out-File -Path $installInfoFile