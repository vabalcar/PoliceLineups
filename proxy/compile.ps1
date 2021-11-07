#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Compiling proxy...' | Out-Host

$targetProjectFile = (Join-Path '.' 'src' 'Proxy' 'Proxy.csproj')
$commonBuildArgs = @(
    $targetProjectFile,
    '--nologo',
    '--no-restore'
)

if ($Debug) {
    & dotnet build @commonBuildArgs /property:GenerateFullPaths=true /consoleloggerparameters:NoSummary
}
else {
    & dotnet publish @commonBuildArgs --configuration Release
}

'done.' | Out-Host
