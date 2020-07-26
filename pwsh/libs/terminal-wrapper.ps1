using namespace System.IO

param (
    [Parameter(Mandatory = $true)] [string] $Script,
    [array] $ArgumentList
)

. (Join-Path $PSScriptRoot 'io.ps1')

try{
    if ([Path]::IsPathRooted($Script)) {
        & $Script @ArgumentList
    } else {
        & (Join-Path '.' $Script) @ArgumentList
    }
} finally {
    Wait-AnyKeyPress -Purpose 'close this window'
}