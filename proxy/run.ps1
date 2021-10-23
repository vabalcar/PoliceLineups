#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Running proxy...' | Out-Host

$originalWD = Get-Location
Set-Location -Path 'src'

try {
    & dotnet run --no-build --project Proxy
}
finally {
    Set-Location -Path $originalWD
}
