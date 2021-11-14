#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Deploying...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$deployConfiguration = Get-Content (Join-Path 'config' $environment 'deploy.json') | ConvertFrom-Json

$remoteHostName = $deployConfiguration.host
$remotePort = $deployConfiguration.port
$remoteUserName = $deployConfiguration.user
$remotePath = $deployConfiguration.path

$remotePortArg = $remotePort ? @{ '-Port' = $remotePort } : @{}
$remoteUserNameArg = $remoteUserName ? @{ '-UserName' = $remoteUserName } : @{}

"Connecting to $remoteHostName..." | Out-Host
$session = New-PSSession -SSHTransport -HostName $remoteHostName @remotePortArg @remoteUserNameArg
"connected." | Out-Host

Invoke-Command -Session $session -ScriptBlock {
    Set-Location $Using:remotePath
    & (Join-Path '.' 'upgrade.ps1')
}

Remove-PSSession $session

'done.' | Out-Host
