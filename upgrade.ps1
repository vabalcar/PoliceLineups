#!/usr/bin/pwsh
param (
    [switch] $Locally,
    [switch] $NoClean
)

function Test-UpgradeAvailable {
    if (& git status -s) {
        'Repository contains uncommited changes, upgrade is not possible.' | Out-Host
        return $false
    }

    & git fetch *> $null

    $gitStatus = & git status -uno
    $isLocalAheadRemote = ($gitStatus | Select-String -SimpleMatch -Pattern '"git push"' | Measure-Object).Count -ne 0
    $isLocalBehindRemote = ($gitStatus | Select-String -SimpleMatch -Pattern '"git pull"' | Measure-Object).Count -ne 0

    if ($isLocalAheadRemote) {
        'Local repository is ahead the remote, push new commits and try again.' | Out-Host
        return $false
    }

    if (!$isLocalBehindRemote) {
        'No upgrade is available' | Out-Host
        return $false
    }

    'Upgrade is available' | Out-Host
    return $true
}

if (!(Test-UpgradeAvailable)) {
    exit
}

'Upgrading...' | Out-Host

$isLocalUpgrade = $IsWindows -or $Locally
$serviceName = 'police-lineups'

if ($isLocalUpgrade) {
    & (Join-Path '.' 'stop.ps1')
}
else {
    & sudo service $serviceName stop
}

& git pull

if ($NoClean) {
    & (Join-Path '.' 'build.ps1')
}
else {
    & (Join-Path '.' 'rebuild.ps1')
}

if ($isLocalUpgrade) {
    & (Join-Path '.' 'start.ps1')
}
else {
    & sudo service $serviceName start
}
