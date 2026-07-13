# Regenera los PGN de los 24 jugadores que estaban limitados a 3000 partidas
# Ahora sin límite de partidas, siempre stripeando anotaciones para controlar tamaño.

$srcRoot   = "D:\KINGSTON-Quim Fons\Jugadors Recop partides"
$dstRoot   = "H:\Mi unidad\AI code\games\AjedrezIA\games\jugadors"
$indexFile = "$dstRoot\index.json"

# Función: strip anotaciones (comentarios, variantes, NAGs)
function Strip-Annotations($text) {
    # Quitar comentarios { ... }
    $text = [regex]::Replace($text, '\{[^}]*\}', '')
    # Quitar variaciones ( ... ) anidadas (hasta 5 niveles)
    for ($i = 0; $i -lt 5; $i++) {
        $text = [regex]::Replace($text, '\([^()]*\)', '')
    }
    # Quitar NAGs ($N)
    $text = [regex]::Replace($text, '\$\d+', '')
    # Limpiar espacios múltiples
    $text = [regex]::Replace($text, '[ \t]{2,}', ' ')
    $text = [regex]::Replace($text, '\r?\n[ \t]+', "`n")
    $text = [regex]::Replace($text, '\r?\n{3,}', "`n`n")
    return $text.Trim()
}

# Función: dividir PGN en partidas individuales
function Split-PGN($raw) {
    return ($raw -split '(?=\[Event\s+")') | ForEach-Object { $_.Trim() } | Where-Object { $_.StartsWith('[Event') }
}

# Función: clave de deduplicación
function Game-Key($pgn) {
    $w = if ($pgn -match '\[White\s+"([^"]+)"\]') { $matches[1] } else { '?' }
    $b = if ($pgn -match '\[Black\s+"([^"]+)"\]') { $matches[1] } else { '?' }
    $d = if ($pgn -match '\[Date\s+"([^"]+)"\]')  { $matches[1] } else { '?' }
    $r = if ($pgn -match '\[Round\s+"([^"]+)"\]') { $matches[1] } else { '?' }
    return "$w|$b|$d|$r"
}

# Mapeo: id en games/jugadors -> fuente(s)
# Cada entrada: id, srcDirs (subcarpetas), srcFiles (archivos raíz)
$players = @(
    @{ id='carlsen';               name='Carlsen, Magnus';          srcDirs=@('CARLSEN') ;        srcFiles=@() }
    @{ id='kasparov';              name='Kasparov, Garry';           srcDirs=@('KASPAROV');         srcFiles=@() }
    @{ id='karpov';                name='Karpov, Anatoly';           srcDirs=@('Karpov');           srcFiles=@() }
    @{ id='kramnik';               name='Kramnik, Vladimir';         srcDirs=@('KRAMNIK');          srcFiles=@() }
    @{ id='anand';                 name='Anand, Viswanathan';        srcDirs=@('ANAND');            srcFiles=@() }
    @{ id='tal';                   name='Tal, Mikhail';              srcDirs=@('TAL');              srcFiles=@() }
    @{ id='fischer';               name='Fischer, Robert James';     srcDirs=@('FISCHER');          srcFiles=@() }
    @{ id='korchnoi';              name='Korchnoi, Viktor';          srcDirs=@('Korchnoi');         srcFiles=@() }
    @{ id='alekhine';              name='Alekhine, Alexander';       srcDirs=@('ALEKHINE');         srcFiles=@() }
    @{ id='petrosian';             name='Petrosian, Tigran';         srcDirs=@('PETROSIAN');        srcFiles=@() }
    @{ id='keres';                 name='Keres, Paul';               srcDirs=@('KERES');            srcFiles=@() }
    @{ id='spassky';               name='Spassky, Boris';            srcDirs=@('SPASSKY');          srcFiles=@() }
    @{ id='topalov';               name='Topalov, Veselin';          srcDirs=@('Topalov');          srcFiles=@() }
    @{ id='nakamura';              name='Nakamura';                  srcDirs=@();                   srcFiles=@('Nakamura, 8727 games.pgn') }
    @{ id='nepomniachtchi';        name='Nepomniachtchi';            srcDirs=@();                   srcFiles=@('Nepomniachtchi, 4388 games.pgn') }
    @{ id='grischuk';              name='Grischuk';                  srcDirs=@();                   srcFiles=@('Grischuk, 5918 games.pgn') }
    @{ id='aronian';               name='Aronian';                   srcDirs=@();                   srcFiles=@("Aronian, 5107 games.pgn","Aronian's Beauty of Chess.pgn") }
    @{ id='caruana';               name='Caruana';                   srcDirs=@();                   srcFiles=@('Caruana, 5341 games.pgn') }
    @{ id='firouzja';              name='Firouzja';                  srcDirs=@();                   srcFiles=@('Firouzja, 4204 games.pgn','Firouzja 180 Games.pgn') }
    @{ id='erigaisi';              name='Erigaisi';                  srcDirs=@();                   srcFiles=@('Erigaisi, 3385 games.pgn','Erigaisi Chess Notes 235 Games.pgn') }
    @{ id='hort';                  name='Hort';                      srcDirs=@();                   srcFiles=@('Hort, 3152 games.pgn') }
    @{ id='gligoric-svetosar';     name='Gligoric Svetosar';         srcDirs=@();                   srcFiles=@('Gligoric Svetosar (YUG) 3034 Games.PGN') }
    @{ id='ivanchuk-annotated-games'; name='Ivanchuk Annotated Games'; srcDirs=@();                srcFiles=@('Ivanchuk Annotated Games.pgn') }
    @{ id='wesley-so';             name='Wesley So';                 srcDirs=@();                   srcFiles=@('Wesley So, 4440 games.pgn') }
)

# Cargar index.json actual
$indexData = Get-Content $indexFile -Raw | ConvertFrom-Json
$indexMap  = @{}
foreach ($entry in $indexData) { $indexMap[$entry.id] = $entry }

$totalUpdated = 0

foreach ($p in $players) {
    Write-Host "`n=== $($p.id) ===" -ForegroundColor Cyan

    # Recoger todos los PGN raw de las fuentes
    $allRaw = @()

    foreach ($dir in $p.srcDirs) {
        $dirPath = "$srcRoot\$dir"
        if (-not (Test-Path $dirPath)) { Write-Host "  WARN: carpeta no encontrada: $dirPath" -ForegroundColor Yellow; continue }
        $pgnFiles = Get-ChildItem $dirPath -Recurse -Filter "*.pgn" | Sort-Object FullName
        foreach ($f in $pgnFiles) {
            Write-Host "  + $($f.Name) ($([math]::Round($f.Length/1MB,1)) MB)"
            $allRaw += Get-Content $f.FullName -Raw -Encoding Default
        }
    }

    foreach ($file in $p.srcFiles) {
        $fPath = "$srcRoot\$file"
        if (-not (Test-Path $fPath)) { Write-Host "  WARN: archivo no encontrado: $fPath" -ForegroundColor Yellow; continue }
        Write-Host "  + $file ($([math]::Round((Get-Item $fPath).Length/1MB,1)) MB)"
        $allRaw += Get-Content $fPath -Raw -Encoding Default
    }

    if ($allRaw.Count -eq 0) { Write-Host "  ERROR: sin fuentes" -ForegroundColor Red; continue }

    # Dividir en partidas y deduplicar
    $seen  = @{}
    $games = [System.Collections.Generic.List[string]]::new()
    foreach ($raw in $allRaw) {
        $parts = Split-PGN $raw
        foreach ($pgn in $parts) {
            $key = Game-Key $pgn
            if (-not $seen.ContainsKey($key)) {
                $seen[$key] = $true
                $games.Add($pgn)
            }
        }
    }
    Write-Host "  Total partidas (dedup): $($games.Count)" -ForegroundColor Green

    # Unir, stripear anotaciones siempre (mantener tamaños manejables)
    $merged = $games -join "`n`n"
    $stripped = Strip-Annotations $merged

    # Guardar
    $dstDir = "$dstRoot\$($p.id)"
    if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory $dstDir | Out-Null }
    $dstFile = "$dstDir\games.pgn"
    [System.IO.File]::WriteAllText($dstFile, $stripped, (New-Object System.Text.UTF8Encoding $false))
    $sizeMB = [math]::Round((Get-Item $dstFile).Length/1MB, 2)
    Write-Host "  Guardado: $dstFile ($sizeMB MB)"

    # Actualizar index
    if ($indexMap.ContainsKey($p.id)) {
        $indexMap[$p.id].gameCount = $games.Count
    } else {
        $indexMap[$p.id] = [pscustomobject]@{ id=$p.id; name=$p.name; gameCount=$games.Count }
    }
    $totalUpdated++
}

# Guardar index.json actualizado
$newIndex = $indexMap.Values | Sort-Object id
$newIndex | ConvertTo-Json -Depth 3 | Set-Content $indexFile -Encoding UTF8
Write-Host "`n=== Completado: $totalUpdated jugadores actualizados ===" -ForegroundColor Green
Write-Host "index.json actualizado."
