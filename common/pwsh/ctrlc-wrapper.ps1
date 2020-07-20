using namespace System

Param (
    [Parameter(Mandatory = $true)] [System.Diagnostics.Process] $proc
)

[Console]::TreatControlCAsInput = $true

try {

    do {
        
        $Host.UI.RawUI.FlushInputBuffer()
        $keyPress = $Host.UI.RawUI.ReadKey("AllowCtrlC,IncludeKeyDown,NoEcho")

    } while (!($keyPress.Character -eq "`u{0003}"))
    
    $Host.UI.RawUI.FlushInputBuffer()
    [Console]::TreatControlCAsInput = $false

} catch [NotImplementedException] {

    [Console]::TreatControlCAsInput = $false
    $proc.WaitForExit()

}

& taskkill /t /f /PID $proc.Id