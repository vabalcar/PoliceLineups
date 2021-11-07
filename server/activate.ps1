#!/usr/bin/pwsh
$venvInfo = Get-Content 'venv.json' | ConvertFrom-Json
$venvName = $IsWindows ? $venvInfo.nameOnWindows : $venvInfo.nameOnLinux
$activationScript = $IsWindows ? (Join-Path '.' $venvName 'Scripts' 'Activate.ps1') : (Join-Path '.' $venvName 'bin' 'Activate.ps1')

if (!(Test-Path -PathType Leaf $activationScript)) {
    "Creating virtual environment '$venvName'..." | Out-Host
    $pythonExecutable = $IsWindows ? 'python' : 'python3.9'
    & $pythonExecutable -m venv $venvName
}

& $activationScript
