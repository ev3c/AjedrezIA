# Genera games/FCE/ a partir de los PGN de la Federació Catalana d'Escacs
$srcRoot = "D:\KINGSTON-Quim Fons\fce"
$dstRoot = "H:\Mi unidad\AI code\games\AjedrezIA\games\FCE"
$indexFile = "$dstRoot\index.json"

function Get-PlayerId([string]$name) {
    $s = $name.Trim().ToLowerInvariant()
    $normalized = $s.Normalize([Text.NormalizationForm]::FormD)
    $sb = New-Object System.Text.StringBuilder
    foreach ($c in $normalized.ToCharArray()) {
        if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($c) -ne 'NonSpacingMark') {
            [void]$sb.Append($c)
        }
    }
    $s = $sb.ToString() -replace '[^a-z0-9]+', '-' -replace '(^-+|-+$)', ''
    if (-not $s) { $s = 'unknown' }
    return $s
}

function Split-PGN([string]$raw) {
    return ($raw -split '(?=\[Event\s+")') |
        ForEach-Object { $_.Trim() } |
        Where-Object { $_.StartsWith('[Event') }
}

function Get-PGNHeader([string]$pgn, [string]$header) {
    if ($pgn -match "(?m)^\[$header\s+`"([^`"]*)`"\]") { return $matches[1].Trim() }
    return ''
}

function Get-GameKey([string]$pgn) {
    $w = Get-PGNHeader $pgn 'White'
    $b = Get-PGNHeader $pgn 'Black'
    $d = Get-PGNHeader $pgn 'Date'
    $r = Get-PGNHeader $pgn 'Round'
    $e = Get-PGNHeader $pgn 'Event'
    return "$e|$w|$b|$d|$r"
}

function Add-GameToPlayer([hashtable]$players, [string]$playerName, [string]$pgn, [string]$gameKey) {
    if (-not $playerName -or $playerName -eq '?' -or $playerName -eq '-') { return }
    $id = Get-PlayerId $playerName
    if (-not $players.ContainsKey($id)) {
        $players[$id] = @{
            id = $id
            name = $playerName
            keys = @{}
            games = New-Object System.Collections.Generic.List[string]
        }
    }
    $entry = $players[$id]
    if (-not $entry.name -or $entry.name.Length -lt $playerName.Length) {
        $entry.name = $playerName
    }
    if ($entry.keys.ContainsKey($gameKey)) { return }
    $entry.keys[$gameKey] = $true
    $entry.games.Add($pgn)
}

if (-not (Test-Path $dstRoot)) {
    New-Item -ItemType Directory -Path $dstRoot | Out-Null
} else {
    Get-ChildItem $dstRoot -Directory | Remove-Item -Recurse -Force
}

$players = @{}
$pgnFiles = Get-ChildItem $srcRoot -Filter "*.pgn" | Sort-Object Name
$totalGames = 0
$duplicates = 0
$globalKeys = @{}

Write-Host "Procesando $($pgnFiles.Count) archivos PGN..." -ForegroundColor Cyan

foreach ($file in $pgnFiles) {
    Write-Host "  + $($file.Name)" -ForegroundColor Gray
    $raw = Get-Content $file.FullName -Raw -Encoding Default
    $games = Split-PGN $raw
    foreach ($pgn in $games) {
        $key = Get-GameKey $pgn
        if ($globalKeys.ContainsKey($key)) {
            $duplicates++
            continue
        }
        $globalKeys[$key] = $true
        $totalGames++

        $white = Get-PGNHeader $pgn 'White'
        $black = Get-PGNHeader $pgn 'Black'
        Add-GameToPlayer $players $white $pgn $key
        Add-GameToPlayer $players $black $pgn $key
    }
}

Write-Host "`nPartidas únicas: $totalGames (duplicadas omitidas: $duplicates)" -ForegroundColor Green
Write-Host "Jugadores: $($players.Count)" -ForegroundColor Green
Write-Host "Escribiendo archivos..." -ForegroundColor Cyan

$index = New-Object System.Collections.Generic.List[object]
foreach ($id in ($players.Keys | Sort-Object)) {
    $entry = $players[$id]
    $playerDir = Join-Path $dstRoot $id
    New-Item -ItemType Directory -Path $playerDir -Force | Out-Null
    $outFile = Join-Path $playerDir 'games.pgn'
    $content = ($entry.games -join "`n`n")
    [System.IO.File]::WriteAllText($outFile, $content, (New-Object System.Text.UTF8Encoding $false))
    $sizeMB = [math]::Round((Get-Item $outFile).Length / 1MB, 2)
    $index.Add([pscustomobject]@{
        id = $id
        name = $entry.name
        file = "$id/games.pgn"
        gameCount = $entry.games.Count
        sizeMB = $sizeMB
    })
}

$index | Sort-Object name | ConvertTo-Json -Depth 3 | Set-Content $indexFile -Encoding UTF8
Write-Host "`n=== Completado ===" -ForegroundColor Green
Write-Host "Jugadores: $($players.Count)"
Write-Host "Partidas:  $totalGames"
Write-Host "Salida:    $dstRoot"
