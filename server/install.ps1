#!/usr/bin/pwsh
& (Join-Path '.' 'activate.ps1')

$REQUREMENTS_LOCK_FILE = 'requirements.txt'

'Installing server...' | Out-Host

if (Test-Path -PathType Leaf -Path (Join-Path '.' $REQUREMENTS_LOCK_FILE)) {
    "Installing requirements from requirements-lock file $REQUREMENTS_LOCK_FILE..." | Out-Host
    & pip install -r $REQUREMENTS_LOCK_FILE
}

Get-ChildItem -Path (Join-Path '.' '*requirements.txt') -Exclude $REQUREMENTS_LOCK_FILE | ForEach-Object {
    "Installing requirements from $($_.Name)..." | Out-Host
    & pip install -r $_
}

"Updating requirements-lock file $REQUREMENTS_LOCK_FILE..." | Out-Host
& pip freeze > $REQUREMENTS_LOCK_FILE

'done.' | Out-Host
& deactivate
