#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoClean
)

'Deploying...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$deployConfigurationFile = Join-Path 'config' $environment 'deploy.json'
$isDeployConfigurationValid = & (Join-Path 'config' 'test.ps1') -PassThru -ConfigurationFile $deployConfigurationFile
if (!$isDeployConfigurationValid) {
    exit
}

$deployConfiguration = Get-Content $deployConfigurationFile | ConvertFrom-Json

$remoteHostName = $deployConfiguration.host
$remotePort = $deployConfiguration.port
$remoteUserName = $deployConfiguration.user
$remotePath = $deployConfiguration.path
$remotePathDelimiter = $deployConfiguration.isWindows ? '\' : '/'

$remotePortArgs = $remotePort ? @( '-p', $remotePort ) : @()
$noCleanArg = $NoClean ? '-NoClean' : ''

"Connecting to $remoteHostName..." | Out-Host

& ssh -t "$remoteUserName@$remoteHostName" @remotePortArgs "pwsh -WorkingDirectory $remotePath -File ${remotePath}${remotePathDelimiter}upgrade.ps1 $noCleanArg"

'Deployment completed' | Out-Host
