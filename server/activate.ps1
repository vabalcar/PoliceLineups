#!/usr/bin/pwsh
$packageInfo = Get-Content 'virtualenv.json' | ConvertFrom-Json

$venvName = $IsWindows ? $packageInfo.venvNameWindows : $packageInfo.venvName
$activationScript = $IsWindows ? (Join-Path '.' $venvName 'Scripts' 'Activate.ps1') : (Join-Path '.' $venvName 'bin' 'Activate.ps1')

if(!(Test-Path -PathType Leaf $activationScript)) {
    "Creating virtual environment '$venvName'" | Out-Host
    & virtualenv $venvName
}

& $activationScript