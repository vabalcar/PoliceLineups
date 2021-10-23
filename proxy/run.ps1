#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Running proxy...' | Out-Host

$originalWD = Get-Location
Set-Location -Path 'src'

try {
    & dotnet run --project Proxy
}
finally {
    'stopped.' | Out-Host
    Set-Location -Path $originalWD
}
