#!/usr/bin/pwsh
param (
    [string] $RequirementsLockFile
)

'Installing server...' | Out-Host

if (!$RequirementsLockFile) {
    $venvInfo = Get-Content 'venv.json' | ConvertFrom-Json
    $RequirementsLockFile = $venvInfo.RequirementsLockFile
}

& (Join-Path '.' 'activate.ps1')

if (Test-Path -PathType Leaf -Path (Join-Path '.' $RequirementsLockFile)) {
    "Installing requirements from requirements-lock file $RequirementsLockFile..." | Out-Host
    & python -m pip install -r $RequirementsLockFile
}
else {
    Get-ChildItem -Path (Join-Path '.' '*requirements.txt') -Exclude $RequirementsLockFile | ForEach-Object {
        "Installing requirements from $($_.Name)..." | Out-Host
        & python -m pip install -r $_
    }

    "Updating requirements-lock file $RequirementsLockFile..." | Out-Host
    & python -m pip freeze > $RequirementsLockFile
}

& deactivate

'Server installed' | Out-Host
