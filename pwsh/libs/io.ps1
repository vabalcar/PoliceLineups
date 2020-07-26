using namespace System.Management.Automation

function Wait-AnyKeyPress {
    try {
        Write-Host -NoNewline 'Press any key to close this window...'
        $Host.UI.RawUI.Flushinputbuffer()
        $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown') | Out-Null
        $Host.UI.RawUI.Flushinputbuffer()
        Write-Host
    } catch [MethodInvocationException] {
        'error - waiting for any keypress is not supported on this platforms/terminal.' | Out-Host
        Write-Host -NoNewline 'Press enter to close this window...'
        Read-Host
    }
}