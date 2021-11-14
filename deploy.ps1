#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoClean
)

'Deploying...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$deployConfiguration = Get-Content (Join-Path 'config' $environment 'deploy.json') | ConvertFrom-Json

$remoteHostName = $deployConfiguration.host
$remotePort = $deployConfiguration.port
$remoteUserName = $deployConfiguration.user
$remotePath = $deployConfiguration.path
$remotePathDelimiter = $deployConfiguration.isWindows ? '\' : '/'

$remotePortArgs = $remotePort ? @( '-p', $remotePort ) : @()
$noCleanArg = $NoClean ? '-NoClean' : ''

"Connecting to $remoteHostName..." | Out-Host

& ssh -t "$remoteUserName@$remoteHostName" @remotePortArgs "pwsh -WorkingDirectory $remotePath -File ${remotePath}${remotePathDelimiter}upgrade.ps1 $noCleanArg"

'done.' | Out-Host
