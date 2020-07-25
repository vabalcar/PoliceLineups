using namespace System.IO
using namespace System.Management.Automation

param (
    [Parameter(Mandatory = $true)] [string] $Script
)

try{
    if ([Path]::IsPathRooted($Script)) {
        & $Script
    } else {
        & (Join-Path '.' $Script)
    }
} finally {
    try {
        [Console]::Write('Press any key to close this window...')
        $Host.UI.RawUI.Flushinputbuffer()
        $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown') | Out-Null
        $Host.UI.RawUI.Flushinputbuffer()
        Write-Host
    } catch [MethodInvocationException] {
        'error - waiting for any keypress is not supported on this platforms/terminal.' | Out-Host
        [Console]::Write('Press enter to close this window...')
        Read-Host
    }
}