$package = Get-Content package-info.json | ConvertFrom-Json
$venvName = $package.venvName

Write-Output 'Installing global dependencies...'
Start-Process -nnw -Wait -Path 'pip' -Args 'install', 'virtualenv'
Write-Output 'done.'

if(!(Test-Path -PathType Container $venvName)) {
    
    Write-Output "Creating virtual environment ""$venvName""..."
    Start-Process -nnw -Wait -Path 'virtualenv' -Args $venvName
    Write-Output 'done.'
}

Write-Output 'Installing local dependencies...'
if ($IsWindows) {
    & (Join-Path $venvName Scripts activate.ps1)
} else {
    Start-Process -nnw -Wait -Path 'source' -Args (Join-Path $venvName bin activate)
}
foreach ($dep in ([string[]] $package.dependencies)) {
    Start-Process -nnw -Wait -Path 'pip' -Args 'install', $dep
}
& deactivate
Write-Output 'done.'