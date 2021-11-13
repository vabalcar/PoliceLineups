#!/usr/bin/pwsh
param (
    [switch] $Debug
)

$srcDir = 'src'
$distDir = 'dist'

New-Item -ItemType Directory -Path $distDir -ErrorAction Ignore -Verbose | Out-Null

if ((Get-ChildItem -Path $distDir | Measure-Object).Count -gt 0) {
    Remove-Item -Recurse -Force -Path (Join-Path $distDir '*') -Verbose
}

Copy-Item -Recurse -Force -Path (Join-Path $srcDir '*') -Destination $distDir -Verbose

Get-ChildItem -Recurse -Path $distDir -Include '__pycache__'
| Remove-Item -Recurse -Force -Verbose
