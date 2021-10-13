#!/usr/bin/pwsh
'Updating server...' | Out-Host

$venvInfo = Get-Content 'venv.json' | ConvertFrom-Json
$requirementsLockFile = $venvInfo.requirementsLockFile

$reqirementsLockFilePath = Join-Path '.' $requirementsLockFile

if (Test-Path -PathType Leaf -Path $reqirementsLockFilePath) {
    "Removing requirements-lock file $requirementsLockFile..." | Out-Host
    Remove-Item -Path $reqirementsLockFilePath
}

$venvName = $IsWindows ? $venvInfo.nameOnWindows : $venvInfo.name
$venvPath = (Join-Path '.' $venvName)

if (Test-Path -PathType Container -Path $venvPath) {
    "Removing venv $venvName..." | Out-Host
    Remove-Item -Recurse -Path $venvPath
}

& (Join-Path '.' 'install.ps1') -RequirementsLockFile $requirementsLockFile

'done.' | Out-Host
