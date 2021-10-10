#!/usr/bin/pwsh
$venvInfo = Get-Content 'venv.json' | ConvertFrom-Json
$venvName = $IsWindows ? $venvInfo.nameOnWindows : $venvInfo.name
$activationScript = $IsWindows ? (Join-Path '.' $venvName 'Scripts' 'Activate.ps1') : (Join-Path '.' $venvName 'bin' 'Activate.ps1')

if (!(Test-Path -PathType Leaf $activationScript)) {
    "Creating virtual environment '$venvName'" | Out-Host
    & virtualenv $venvName
}

& $activationScript
