using namespace System.Net
using namespace System.Net.Sockets
using namespace System.Text

Param(
    [Parameter(Mandatory = $true)] [string] $script,
    [int] $port = -1
)

if ($port -lt 0) {
    $curDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $buildConfig = Get-Content (Join-Path $curDir '..' '..' 'config' 'build.json') | ConvertFrom-Json
    $port = $buildConfig.port
}

$server = [TcpListener]::new([ipaddress]::Loopback, $port)
$server.Start()
$buffer = [byte[]]::new($script.Length)

#Write-Host "Waiting for $script to complete..."

do {
    $client = $server.AcceptTcpClient()
    $stream = $client.GetStream()
    $stream.Read($buffer, 0, $buffer.Length) | Out-Null
    $readMsg = [Encoding]::UTF8.GetString($buffer)
    $client.Dispose()
} while ($readMsg -ne $script)

$server.Stop()

Write-Host "Waiting for $script to complete done."