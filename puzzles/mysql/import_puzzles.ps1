<#
.SYNOPSIS
  Crea la base, importa lichess_db_puzzle.csv con LOAD DATA LOCAL INFILE y crea índices.

.PARAMETER CsvPath
  Ruta al archivo lichess_db_puzzle.csv (absoluta o relativa).

.PARAMETER MysqlExe
  Ejecutable mysql (por defecto "mysql" en PATH).

.PARAMETER MySqlPassword
  Si está vacío, se omite -p (MySQL pedirá contraseña en consola si hace falta).
#>
param(
  [Parameter(Mandatory = $true)]
  [string] $CsvPath,

  [string] $MysqlExe = "mysql",
  [string] $MySqlUser = "root",
  [string] $MySqlHost = "127.0.0.1",
  [string] $MySqlPassword = "",
  [switch] $SkipSchema,
  [switch] $SkipIndexes
)

$ErrorActionPreference = "Stop"
$CsvPath = (Resolve-Path -LiteralPath $CsvPath).Path
$sqlPath = ($CsvPath -replace "\\", "/")

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$schema = Join-Path $here "01_schema.sql"
$loadTpl = Join-Path $here "02_load_data.sql"
$indexes = Join-Path $here "03_indexes.sql"

$loadSql = (Get-Content -LiteralPath $loadTpl -Raw -Encoding UTF8).Replace("__CSV_PATH__", $sqlPath)

$tmpLoad = Join-Path $env:TEMP ("lichess_load_{0}.sql" -f [guid]::NewGuid().ToString("N"))
Set-Content -LiteralPath $tmpLoad -Value $loadSql -Encoding UTF8

$mysqlArgs = @(
  "--local-infile=1",
  "-h", $MySqlHost,
  "-u", $MySqlUser
)
if ($MySqlPassword) {
  $mysqlArgs += "-p$MySqlPassword"
}

function Invoke-MysqlFile {
  param([string] $SqlFile)
  Get-Content -LiteralPath $SqlFile -Raw -Encoding UTF8 | & $MysqlExe @mysqlArgs
  if ($LASTEXITCODE -ne 0) {
    throw "mysql terminó con código $LASTEXITCODE (archivo: $SqlFile)"
  }
}

try {
  if (-not $SkipSchema) {
    Write-Host "Ejecutando esquema..."
    Invoke-MysqlFile $schema
  }

  Write-Host "Importando CSV (puede tardar muchos minutos)..."
  Invoke-MysqlFile $tmpLoad

  if (-not $SkipIndexes) {
    Write-Host "Creando índices..."
    Invoke-MysqlFile $indexes
  }

  Write-Host "Listo. Base: lichess_puzzles, tabla: lichess_puzzles"
  Write-Host ""
  Write-Host "Exportar para Hostinger (ejemplo, comprimido):"
  Write-Host "  mysqldump -h $MySqlHost -u $MySqlUser -p lichess_puzzles lichess_puzzles | gzip > lichess_puzzles.sql.gz"
}
finally {
  if (Test-Path -LiteralPath $tmpLoad) { Remove-Item -LiteralPath $tmpLoad -Force }
}

<#
--- Hostinger y MySQL ---

1) En tu PC: ejecuta este script con la ruta al CSV (requiere cliente mysql y local_infile).
   En el servidor MySQL debe permitirse: SET GLOBAL local_infile = 1; (según permisos).

2) Sube a Hostinger el volcado, no el CSV de 1 GB, salvo que importes por SSH:
   mysqldump -u USER -p lichess_puzzles lichess_puzzles | gzip > lichess_puzzles.sql.gz

3) En Hostinger: hPanel > Bases de datos > phpMyAdmin o SSH:
   mysql -u USER -p NOMBRE_BD < lichess_puzzles.sql
   (si está comprimido: gunzip -c lichess_puzzles.sql.gz | mysql -u USER -p NOMBRE_BD)

4) phpMyAdmin a menudo no aguanta dumps enormes; SSH o import por fragmentos es más fiable.
#>
