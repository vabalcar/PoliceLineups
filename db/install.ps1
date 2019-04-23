using namespace System.Text
using namespace System.IO

Param(
    [switch] $force
)

. (Join-Path '.' 'mysql.ps1')

$mysqlStmts = @(
    #[MysqlScript]::new('create-tables.sql'),
    #[MysqlCsvImport]::new('users.csv', 'users')
)

#$mysqlStmts | Invoke-Mysql -DBConfigFile (Join-Path '..' 'config' 'db.json') -Force:$force
Export-MysqlTable -DBConfigFile (Join-Path '..' 'config' 'db.json') -Table 'users' -Path 'exported-users.csv' -Delimiter ';'
