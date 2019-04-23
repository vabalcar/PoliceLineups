using namespace System
using namespace System.Collections.Generic
using namespace System.IO
using namespace System.Text

function Add-SemicolonIfMissing {
    [OutputType([string])]
    param()

    process {
        [string] $string = $_
        if ($string.Length -gt 0) {
            if ($string[$string.Length - 1] -ne ';') {
                "$string;" | Write-Output
            } else {
                $string | Write-Output
            }
        } else {
            ';' | Write-Output
        }
    }
}

function Get-TerminatedMysqlStmt {
    [OutputType([string])]
    param (
        [Parameter(Mandatory=$true)] [string] $stmt
    )

    $stmt | Add-SemicolonIfMissing | Write-Output
}

function Get-MysqlScriptStmt {
    [OutputType([string])]
    param (
        [Parameter(Mandatory=$true)] [string] $script
    )
    [string] $prevLine | Out-Null
    [bool] $firstNonEmptyLine = $true
    Get-Content -Path $script | ForEach-Object {
        [string] $trimmedCurLine = $_.Trim()
        if ($trimmedCurLine.Length -gt 0) {
            if (!$firstNonEmptyLine) {
                $prevLine | Write-Output
            } else {
                $firstNonEmptyLine = $false
            }
            $prevLine = $trimmedCurLine   
        }
    }
    
    $prevLine | Add-SemicolonIfMissing | Write-Output
}

function Get-CSVImportMysqlStmt {
    Param(
        [Parameter(Mandatory=$true)] [string] $csv,
        [Parameter(Mandatory=$true)] [string] $table,
        [string] $delimiter = (Get-Culture).TextInfo.ListSeparator
    )

    [string] $header | Out-Null
    [List[string]] $headerCells = [List[string]]::new()
    [StringBuilder] $sb = [StringBuilder]::new()

    Import-Csv -Path $csv -Delimiter $delimiter -Encoding 'utf8BOM' | ForEach-Object {
        if ($null -eq $header) {
            $_ | Get-Member -MemberType NoteProperty | ForEach-Object {
                $headerCells.Add($_.name)
            }
            $sb.Append('(') | Out-Null
            for($i = 0; $i -lt $headerCells.Count; ++$i) {
                if ($i -ne 0) {
                    $sb.Append(', ') | Out-Null
                }
                $sb.Append("``$($headerCells[$i])``") | Out-Null
            }
            $sb.Append(')') | Out-Null
            $header = $sb.ToString()
            $sb.Clear() | Out-Null
        }

        $sb.Append('(') | Out-Null
        for($i = 0; $i -lt $headerCells.Count; ++$i) {
            if ($i -ne 0) {
                $sb.Append(', ') | Out-Null
            }
            $sb.Append("'$($_."$($headerCells[$i])")'") | Out-Null
        }
        $sb.Append(')') | Out-Null
        $row = $sb.ToString()
        $sb.Clear() | Out-Null
        
        "INSERT INTO ``$table`` $header VALUES $row;" | Write-Output
    }
}

class IMysqlStmt {
    [hashtable] GetStmtDescription() {
        throw [NotImplementedException]::new()
    }

    [scriptblock] GetStmtProvider() {
        throw [NotImplementedException]::new()
    }
}

class MysqlStmt : IMysqlStmt {
    hidden [string] $stmt
    
    MysqlStmt([string] $stmt) {
        $this.stmt = $stmt
    }
    
    [hashtable] GetStmtDescription() {
        return @{   
            Stmt = $this.stmt
        }
    }

    [scriptblock] GetStmtProvider() {
        return ${function:Get-TerminatedMysqlStmt}
    }
}

class MysqlScript : IMysqlStmt {
    hidden [string] $script

    MysqlScript([string] $script) {
        $this.script = $script
    }

    [hashtable] GetStmtDescription() {
        return @{
            Script = $this.script
        }
    }

    [scriptblock] GetStmtProvider() {
        return ${function:Get-MysqlScriptStmt}
    }
}

class MysqlCsvImport : IMysqlStmt {
    hidden [string] $csv
    hidden [string] $table
    hidden [string] $delimiter

    MysqlCsvImport([string] $csv, [string] $table, [string] $delimiter) {
        $this.csv = $csv
        $this.table = $table
        $this.delimiter = $delimiter
    }

    MysqlCsvImport([string] $csv, [string] $table) {
        MysqlCsvImport($csv, $table, (Get-Culture).TextInfo.ListSeparator)
    }
    
    [hashtable] GetStmtDescription() {
        return @{
            CSV = $this.csv;
            Table = $this.table;
            Delimiter = $this.delimiter
        }
    }

    [scriptblock] GetStmtProvider() {
        return ${function:Get-CSVImportMysqlStmt}
    }
}

function Invoke-Mysql {
    [CmdletBinding(DefaultParameterSetName='DBConfigFromJson')]
    Param(
        [Parameter(Mandatory = $true, ParameterSetName = 'DBConfigFromJson')] 
        [string] $DBConfigFile,

        [Parameter(Mandatory = $true, ParameterSetName = 'DBConfigFromParams')]
        [string] $mysqlHost,

        [Parameter(Mandatory = $true, ParameterSetName = 'DBConfigFromParams')]
        [string] $mysqlUser,

        [Parameter(Mandatory = $true, ParameterSetName = 'DBConfigFromParams')]
        [securestring] $password,

        [Parameter(Mandatory = $true, ParameterSetName = 'DBConfigFromParams')]
        [int] $port,

        [Parameter(Mandatory = $true, ParameterSetName = 'DBConfigFromParams')]
        [string] $database,

        [switch] $force,
        [switch] $omitCreation,

        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [IMysqlStmt] $stmt
    )

    begin {
        switch ($PSCmdlet.ParameterSetName) {
            'DBConfigFromJson' {
                $dbConfig = Get-Content -Path $DBConfigFile | ConvertFrom-Json
                $mysqlHost = $dbConfig.host
                $mysqlUser = $dbConfig.user
                $decodedPassword = $dbConfig.password
                $port = $dbConfig.port
                $database = $dbConfig.db
            }
            'DBConfigFromParams' {
                $decodedPassword = ConvertFrom-SecureString $password
            }
        }
        
        $mysqlArgs = @(
            '-B',
            '-h', $mysqlhost,
            '-u', $mysqlUser,
            "-p$decodedPassword",
            '-P', $port
        )

        $stmts = @()

        if ($force) {
            $stmts += [MysqlStmt]::new("DROP DATABASE IF EXISTS ``$database``")
        }
        if (!$omitCreation) {
            $stmts += [MysqlStmt]::new("CREATE DATABASE IF NOT EXISTS ``$database``")
        }
        $stmts += [MysqlStmt]::new("USE ``$database``")
    }
    process {
        $stmts += $stmt
    }
    end {
        $stmts | ForEach-Object { 
            $description = $_.GetStmtDescription()
            & $_.GetStmtProvider() @description
        } | & 'mysql' @mysqlArgs
    }
}

function ConvertTo-Encoding {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)] [string] $path,
        [Parameter(Mandatory=$true)] [string] $inEncoding,
        [Parameter(Mandatory=$true)] [string] $outEncoding
    )

    if (![Path]::IsPathRooted($path)) {
        $path = Join-Path (Get-Location) $path
    }
    $wd = Split-Path -Parent -Path $path
    $fileName = Split-Path -Leaf -Path $path
    $tmpFileName = "__tmp-$fileName"
    $tmpFile = Join-Path $wd $tmpFileName

    Rename-Item -Path $path -NewName $tmpFileName
    Get-Content -Encoding $inEncoding -Path $tmpFile | Out-File -Encoding $outEncoding -Path $path
    Remove-Item -Force -Path $tmpFile
}

function ConvertTo-MysqlPath {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [string] $path
    )
    begin {
        $wd = Get-Location
    }
    process {
        if (![Path]::IsPathRooted($path)) {
            $path = Join-Path $wd $path
        }
        $path -replace '\\', '\\\\'
    }
}

function Export-MysqlTable {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)] [string] $DBConfigFile,
        [Parameter(Mandatory=$true)] [string] $table,
        [Parameter(Mandatory=$true)] [string] $path,
        [string] $delimiter = (Get-Culture).TextInfo.ListSeparator,
        [string] $encoding = 'utf8BOM'
    )
    
    $pathHeader = "$path-header.csv"
    $pathData = "$path-data.csv"

    Remove-Item -Force -Path $path *> $null
    Remove-Item -Force -Path $pathHeader *> $null
    Remove-Item -Force -Path $pathData *> $null

    $mysqlPathHeader = $pathHeader | ConvertTo-MysqlPath
    $mysqlPathData = $pathData | ConvertTo-MysqlPath

    $libImport = [MysqlScript]::new((Join-Path '.' 'scripts' 'export-table.sql'))
    $call = [MysqlStmt]::new("CALL ExportTable('$table','$delimiter','$mysqlPathHeader','$mysqlPathData')")
    $libImport, $call | Invoke-Mysql -DBConfigFile $DBConfigFile
    
    if ((Test-Path -Path $pathHeader) -and (Test-Path -Path $pathData)) {
        [StringBuilder] $sb = [StringBuilder]::new()
        [bool] $firstLine = $true
        Get-Content -Path $pathHeader | ForEach-Object {
            if (!$firstLine) {
                $sb.Append($delimiter) | Out-Null
            } else {
                $firstLine = $false
            }
            $sb.Append($_) | Out-Null
        }
        $sb.ToString() | Out-File -Path $path -Encoding $encoding

        Get-Content -Path $pathData | Out-File -Append -Encoding $encoding -Path $path
        
        Remove-Item -Force -Path $pathHeader
        Remove-Item -Force -Path $pathData
    }
}