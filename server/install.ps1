#!/usr/bin/pwsh
$executionPolicy = Get-ExecutionPolicy
if(("$executionPolicy" -eq 'Restricted') -or ("$executionPolicy" -eq 'AllSigned')) {
    $executionPolicySetter = (Join-Path . 'update-pwsh-execution-policy.ps1')
    Start-Process -Wait -Verb RunAs -Path 'pwsh' -Args '-NoLogo', '-Command', "& $executionPolicySetter"
}
Write-Host "PowerShell execution policy is set to ""$executionPolicy""."

$packageInfo = Get-Content package-info.json | ConvertFrom-Json
$venvName = $packageInfo.venvName

Write-Host 'Checking python environment...'
$virtualenvInstalled = $false
$pipLs = & 'pip' 'list' '--format' 'json' | ConvertFrom-Json
foreach($package in $pipLs) {
    if ($package.name -eq 'virtualenv') {
        $virtualenvInstalled = $true
        break
    }
}

if (!$virtualenvInstalled) {
    Write-Host 'Installing virtualenv...'
    $pipIOutFile = 'pip-i-virtualenv.out'
    New-Item -Force -Path "." -Type "File" -Name $pipIOutFile | Out-Null
    $virtualEnvInstallScript = (Join-Path '.' 'install-virtualenv.ps1')
    Start-Process -Wait -Verb RunAs -Path 'pwsh' -Args '-NoLogo', '-Command', "& $virtualEnvInstallScript -OutputFile $pipIOutFile"
    Get-Content $pipIOutFile
    Remove-Item -Path $pipIOutFile
} else {
    Write-Host 'Virtualenv is installed.'
}

$activationScript = $IsWindows ? (Join-Path $venvName 'Scripts' 'activate.ps1') : (Join-Path $venvName 'bin' 'activate.ps1')

if(!(Test-Path -PathType Leaf $activationScript)) {
    Write-Host "Creating virtual environment ""$venvName""..."
    & 'virtualenv' $venvName
} else {
    "Virtual environment ""$venvName"" exists."
}

Write-Host 'Installing local dependencies...'
& $activationScript
$deps = $packageInfo.dependencies
foreach ($dep in $deps) {
    & 'pip' 'install' $dep
}
& deactivate

Write-Host 'done.'