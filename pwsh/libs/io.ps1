using namespace System.Management.Automation

function Wait-AnyKeyPress {
    [CmdletBinding()]
    param (
        [string] $Purpose = 'continue'
    )
    try {
        Write-Host -NoNewline "Press any key to $Purpose..."
        $Host.UI.RawUI.Flushinputbuffer()
        $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown') | Out-Null
        $Host.UI.RawUI.Flushinputbuffer()
        Write-Host
    } catch [MethodInvocationException] {
        'error - waiting for any keypress is not supported on this platforms/terminal.' | Out-Host
        Write-Host -NoNewline "Press enter to $Purpose..."
        Read-Host
    }
}