using namespace System.Net
using namespace System.Net.Sockets
using namespace System.Text
using namespace System.Diagnostics

Param(
    [Parameter(Mandatory = $true)] [string] $script,
    [string] $wd = '.',
    [int] $port = -1
)

$originalWd = Get-Location
Set-Location $wd
& (Join-Path '.' $script)
Set-Location $originalWd

if ($port -lt 0) {
    $curDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $buildConfig = Get-Content (Join-Path $curDir '..' '..' 'config' 'build.json') | ConvertFrom-Json
    $port = $buildConfig.port
}
$sw = [Stopwatch]::StartNew()
do {
    try {
        $client = [TcpClient]::new('localhost', $port)
        break
    }
    catch {
        [System.Threading.Thread]::Sleep(100)
    }
} while ($sw.ElapsedMilliseconds -le (30 * 1000))
$sw.Stop()
$stream = $client.GetStream()
$bytes = [Encoding]::UTF8.GetBytes($script)
$stream.Write($bytes, 0, $bytes.Length)
$client.Dispose()