<?php
/*
 * Generador dinámico de la imagen de tarjeta (Open Graph) para CUALQUIER
 * posición: partidas, aperturas, problemas y partidas maestras.
 *
 * Devuelve un PNG 1200x630 (formato tarjeta de Facebook / X / WhatsApp) con el
 * tablero a la izquierda y un panel de texto a la derecha.
 *
 * Parámetros (GET):
 *   fen   posición (FEN; basta el campo de piezas).   Obligatorio.
 *   flip  1 = tablero desde el punto de vista de las negras.
 *   kind  partida | apertura | problema | maestra      (etiqueta de la línea 2)
 *   t     título (se ajusta a varias líneas)
 *   s     subtítulo (jugadores / nombre de apertura / etc.)
 *   mv    última jugada en UCI (ej. e2e4) para resaltar las casillas.
 *
 * Las piezas se componen desde share-img/pieces/*.png (sprites cburnett
 * generados con tools/build-piece-sprites.js, porque GD no rasteriza SVG).
 */

// ---- Lienzo y geometría ---------------------------------------------------
$W = 1200; $H = 630;
$BOARD = 540; $BX = 48; $BY = (int)(($H - $BOARD) / 2);
$SQ = $BOARD / 8.0;

// ---- Parámetros -----------------------------------------------------------
$fen  = isset($_GET['fen'])  ? substr((string)$_GET['fen'], 0, 100) : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
$flip = isset($_GET['flip']) && $_GET['flip'] === '1';
$kind = isset($_GET['kind']) ? preg_replace('/[^a-z]/', '', strtolower($_GET['kind'])) : '';
$t    = isset($_GET['t']) ? mb_substr(trim((string)$_GET['t']), 0, 120) : '';
$s    = isset($_GET['s']) ? mb_substr(trim((string)$_GET['s']), 0, 120) : '';
$mv   = isset($_GET['mv']) ? substr(preg_replace('/[^a-h1-8]/', '', strtolower($_GET['mv'])), 0, 4) : '';

$placement = explode(' ', trim($fen))[0];

$KIND_LABEL = [
    'partida'  => 'Partida',
    'apertura' => 'Apertura',
    'problema' => 'Problema de ajedrez y 30 más',
    'maestra'  => 'Partida maestra',
];
$kindLabel = isset($KIND_LABEL[$kind]) ? $KIND_LABEL[$kind] : 'Ajedrez';

// ---- Utilidades -----------------------------------------------------------
function fontFile($bold) {
    $c = $bold ? [
        __DIR__ . '/assets/fonts/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf',
        'C:/Windows/Fonts/arialbd.ttf',
    ] : [
        __DIR__ . '/assets/fonts/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/dejavu/DejaVuSans.ttf',
        'C:/Windows/Fonts/arial.ttf',
    ];
    foreach ($c as $f) { if (is_file($f)) return $f; }
    return null;
}

function fenToBoard($placement) {
    $rows = explode('/', $placement);
    $board = [];
    for ($r = 0; $r < 8; $r++) {
        $line = [];
        $src = isset($rows[$r]) ? $rows[$r] : '8';
        for ($i = 0, $n = strlen($src); $i < $n; $i++) {
            $ch = $src[$i];
            if ($ch >= '1' && $ch <= '8') {
                for ($k = 0; $k < (int)$ch; $k++) $line[] = null;
            } else {
                $line[] = $ch;
            }
        }
        while (count($line) < 8) $line[] = null;
        $board[] = array_slice($line, 0, 8);
    }
    while (count($board) < 8) $board[] = array_fill(0, 8, null);
    return $board; // board[0] = fila 8 (negras arriba), perspectiva de blancas
}

$FEN_TO_CODE = [
    'K' => 'wK', 'Q' => 'wQ', 'R' => 'wR', 'B' => 'wB', 'N' => 'wN', 'P' => 'wP',
    'k' => 'bK', 'q' => 'bQ', 'r' => 'bR', 'b' => 'bB', 'n' => 'bN', 'p' => 'bP',
];

$spriteCache = [];
function sprite($code) {
    global $spriteCache;
    if (array_key_exists($code, $spriteCache)) return $spriteCache[$code];
    $f = __DIR__ . '/share-img/pieces/' . $code . '.png';
    $img = is_file($f) ? @imagecreatefrompng($f) : null;
    return $spriteCache[$code] = $img;
}

// Texto con varias líneas; devuelve la y tras la última línea.
function drawText($im, $size, $x, $y, $color, $bold, $text) {
    $font = fontFile($bold);
    if ($font) {
        imagettftext($im, $size, 0, $x, $y, $color, $font, $text);
        $bbox = imagettfbbox($size, 0, $font, $text);
        return $y + ($bbox[1] - $bbox[7]);
    }
    // Respaldo sin FreeType: fuente de mapa de bits de GD.
    imagestring($im, 5, $x, $y - 14, $text, $color);
    return $y;
}

// Respeta saltos de línea explícitos ('\n') como líneas independientes;
// dentro de cada una aplica word-wrap normal si excede $maxChars.
function wrapText($text, $maxChars) {
    $lines = [];
    foreach (preg_split('/\r\n|\r|\n/', $text) as $para) {
        $words = preg_split('/\s+/', trim($para));
        $cur = '';
        foreach ($words as $w) {
            if ($w === '') continue;
            $try = ($cur === '') ? $w : ($cur . ' ' . $w);
            if (mb_strlen($try) > $maxChars && $cur !== '') { $lines[] = $cur; $cur = $w; }
            else $cur = $try;
        }
        $lines[] = $cur;
    }
    return $lines;
}

// ---- GD disponible? -------------------------------------------------------
if (!function_exists('imagecreatetruecolor')) {
    // Sin GD: redirige a la imagen genérica para no romper la tarjeta.
    header('Location: share-img/default.png');
    exit;
}

$im = imagecreatetruecolor($W, $H);
imagealphablending($im, true);

// Fondo en degradado vertical (#3a3531 -> #1f1b18)
for ($y = 0; $y < $H; $y++) {
    $tt = $y / ($H - 1);
    $r = (int)round(0x3a + ($tt * (0x1f - 0x3a)));
    $g = (int)round(0x35 + ($tt * (0x1b - 0x35)));
    $b = (int)round(0x31 + ($tt * (0x18 - 0x31)));
    $col = imagecolorallocate($im, $r, $g, $b);
    imageline($im, 0, $y, $W, $y, $col);
}

// Marco oscuro tras el tablero
$frame = imagecolorallocate($im, 0x11, 0x10, 0x0e);
imagefilledrectangle($im, $BX - 10, $BY - 10, $BX + $BOARD + 10, $BY + $BOARD + 10, $frame);

$light = imagecolorallocate($im, 0xea, 0xda, 0xb5);
$dark  = imagecolorallocate($im, 0xb0, 0x7a, 0x48);
$hl    = imagecolorallocatealpha($im, 0xf6, 0xe0, 0x7a, 60); // resaltado última jugada

// Casillas a resaltar (última jugada en UCI)
$hlSquares = [];
if (strlen($mv) >= 4) {
    $files = 'abcdefgh';
    $fc = strpos($files, $mv[0]); $fr = 8 - (int)$mv[1];
    $tc = strpos($files, $mv[2]); $tr = 8 - (int)$mv[3];
    if ($fc !== false) $hlSquares[] = [$fr, $fc];
    if ($tc !== false) $hlSquares[] = [$tr, $tc];
}

$board = fenToBoard($placement);

for ($r = 0; $r < 8; $r++) {
    for ($c = 0; $c < 8; $c++) {
        // Coordenadas reales del modelo (perspectiva blancas)
        $mr = $flip ? 7 - $r : $r;
        $mc = $flip ? 7 - $c : $c;

        $x = (int)round($BX + $c * $SQ);
        $y = (int)round($BY + $r * $SQ);
        $x2 = (int)round($BX + ($c + 1) * $SQ) - 1;
        $y2 = (int)round($BY + ($r + 1) * $SQ) - 1;

        $isLight = (($mr + $mc) % 2) === 0;
        imagefilledrectangle($im, $x, $y, $x2, $y2, $isLight ? $light : $dark);

        foreach ($hlSquares as $sq) {
            if ($sq[0] === $mr && $sq[1] === $mc) {
                imagefilledrectangle($im, $x, $y, $x2, $y2, $hl);
            }
        }

        $piece = $board[$mr][$mc];
        if ($piece !== null && isset($FEN_TO_CODE[$piece])) {
            $sp = sprite($FEN_TO_CODE[$piece]);
            if ($sp) {
                $sw = imagesx($sp); $sh = imagesy($sp);
                $dw = (int)round($SQ * 0.85); $dh = (int)round($SQ * 0.85);
                $off = (int)round(($SQ - $SQ * 0.85) / 2);
                imagecopyresampled($im, $sp, $x + $off, $y + $off, 0, 0, $dw, $dh, $sw, $sh);
            }
        }

    }
}

// ---- Coordenadas FUERA del tablero ----------------------------------------
$coordFont = fontFile(false);
if ($coordFont) {
    $cfs   = (int)round($SQ * 0.22);   // tamaño fuente ~15 px para SQ=67
    $cCol  = imagecolorallocate($im, 0xc9, 0xc2, 0xba);
    $files = $flip ? ['h','g','f','e','d','c','b','a'] : ['a','b','c','d','e','f','g','h'];

    for ($i = 0; $i < 8; $i++) {
        // Números (1-8): margen izquierdo, centrados verticalmente en cada fila
        $rankLabel = (string)($flip ? ($i + 1) : (8 - $i));
        $bb  = imagettfbbox($cfs, 0, $coordFont, $rankLabel);
        $tw  = abs($bb[2] - $bb[0]);
        $th  = abs($bb[5] - $bb[1]);
        $rx  = (int)round(($BX - $tw) / 2);                    // centrado en margen izq
        $ry  = (int)round($BY + $i * $SQ + $SQ / 2 + $th / 2);
        imagettftext($im, $cfs, 0, $rx, $ry, $cCol, $coordFont, $rankLabel);

        // Letras (a-h): margen inferior, centradas horizontalmente en cada columna
        $fileLabel = $files[$i];
        $bb  = imagettfbbox($cfs, 0, $coordFont, $fileLabel);
        $tw  = abs($bb[2] - $bb[0]);
        $fx  = (int)round($BX + $i * $SQ + $SQ / 2 - $tw / 2);
        $fy  = (int)round($BY + $BOARD + ($H - $BY - $BOARD + $cfs) / 2);
        imagettftext($im, $cfs, 0, $fx, $fy, $cCol, $coordFont, $fileLabel);
    }
}

// ---- Panel de texto a la derecha -----------------------------------------
$tx = $BX + $BOARD + 44;
$green = imagecolorallocate($im, 0x7f, 0xb0, 0x69);
$white = imagecolorallocate($im, 0xff, 0xff, 0xff);
$cream = imagecolorallocate($im, 0xf0, 0xd9, 0xb5);
$grey  = imagecolorallocate($im, 0xc9, 0xc2, 0xba);
$grey2 = imagecolorallocate($im, 0xa8, 0x9f, 0x96);
$grey3 = imagecolorallocate($im, 0x8a, 0x82, 0x7a);

drawText($im, 26, $tx, 92,  $green, true, "\xE2\x99\x9E AjedrezIA"); // ♞
drawText($im, 18, $tx, 134, $grey,  false, $kindLabel);

$ty = 196;
if ($t !== '') {
    foreach (array_slice(wrapText($t, 24), 0, 3) as $ln) {
        drawText($im, 30, $tx, $ty, $white, true, $ln);
        $ty += 46;
    }
} else {
    $ty = 220;
}

if ($s !== '') {
    $ty += 14;
    foreach (array_slice(wrapText($s, 30), 0, 2) as $ln) {
        drawText($im, 21, $tx, $ty, $cream, false, $ln);
        $ty += 34;
    }
}

drawText($im, 17, $tx, $H - 40, $grey3, false, 'ajedrezia.com');

// ---- Salida ---------------------------------------------------------------
header('Content-Type: image/png');
header('Cache-Control: public, max-age=86400');
imagepng($im);
imagedestroy($im);
