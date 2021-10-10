#!/usr/bin/pwsh
'Updating server...' | Out-Host

$REQUREMENTS_LOCK_FILE = 'requirements.txt'

$reqirementsLockFilePath = Join-Path '.' $REQUREMENTS_LOCK_FILE

if (Test-Path -PathType Leaf -Path $reqirementsLockFilePath) {
    "Removing requirements-lock file $REQUREMENTS_LOCK_FILE..." | Out-Host
    Remove-Item -Path $reqirementsLockFilePath
}

$venvInfo = Get-Content 'venv.json' | ConvertFrom-Json
$venvName = $IsWindows ? $venvInfo.nameOnWindows : $venvInfo.name
$venvPath = (Join-Path '.' $venvName)

if (Test-Path -PathType Container -Path $venvPath) {
    "Removing venv $venvName..." | Out-Host
    Remove-Item -Recurse -Path $venvPath
}

& (Join-Path '.' 'install.ps1')

'done.' | Out-Host
