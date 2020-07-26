using namespace System.IO

param (
    [Parameter(Mandatory = $true)] [string] $Script
)

. (Join-Path $PSScriptRoot 'io.ps1')

try{
    if ([Path]::IsPathRooted($Script)) {
        & $Script
    } else {
        & (Join-Path '.' $Script)
    }
} finally {
    Wait-AnyKeyPress -Purpose 'close this window'
}