param (
    [switch] $Debug,
    [switch] $NoConfigurationValidation,
    [switch] $PassThru
)

& docker info *> $null
if ($LASTEXITCODE -ne 0) {
    "Docker is not running, please start it and try again" | Out-Host
    if ($PassThru) {
        return $false
    }
    exit
}

$environment = $Debug ? 'debug' : 'production'
$dbConfigurationFile = Join-Path '..' 'config' $environment 'db.json'

$isDbConfigurationValid = $NoConfigurationValidation -or (& (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $dbConfigurationFile)
if (!$isDbConfigurationValid) {
    if ($PassThru) {
        return $false
    }
    exit
}

$dbConfiguration = Get-Content $dbConfigurationFile | ConvertFrom-Json

try {
    $env:POLICE_LINEUPS_DB_NAME = $dbConfiguration.db
    $env:POLICE_LINEUPS_DB_PORT = $dbConfiguration.port
    $env:POLICE_LINEUPS_DB_USER = $dbConfiguration.user
    $env:POLICE_LINEUPS_DB_PASSWORD = $dbConfiguration.password

    $dockerComposeArgs = @(
        'compose',
        '--file', 'compose.yaml',
        '--profile', ($Debug ? 'debug' : 'production'),
        'up',
        '--wait'
    )
    Start-Process -Wait -NoNewWindow -WorkingDirectory $PSScriptRoot -Path 'docker' -ArgumentList $dockerComposeArgs
}
finally {
    @(
        'POLICE_LINEUPS_DB_NAME',
        'POLICE_LINEUPS_DB_PORT',
        'POLICE_LINEUPS_DB_USER',
        'POLICE_LINEUPS_DB_PASSWORD'
    )
    | ForEach-Object {
        [Environment]::SetEnvironmentVariable($_, $null, "Process")
    }
}

if ($PassThru) {
    return $true
}
