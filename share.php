<?php
/*
 * Landing de compartir con tarjeta enriquecida (Open Graph / Twitter Card)
 * para CUALQUIER contenido: partidas, aperturas, problemas y partidas maestras.
 *
 * Los robots de Facebook, X (Twitter) y WhatsApp NO ejecutan JavaScript: leen
 * el HTML crudo. Este archivo genera las metaetiquetas og:/twitter: en el
 * servidor (con la imagen del tablero servida por board-image.php) y redirige
 * a las PERSONAS a la app real (index.html con los parámetros adecuados).
 *
 * Parámetros genéricos:
 *   fen, flip, kind, t (título), s (subtítulo), mv (última jugada UCI)  -> imagen + textos
 *   moves | opening | puzzle | p | master                              -> a dónde abrir la app
 *
 * Compatibilidad: share.php?master=opera  sigue funcionando (enlaces antiguos).
 */

// Base detectada automáticamente: producción (https://www.ajedrezia.com/) y
// local (http://localhost:8000/).
$scheme = (!empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off') ? 'https' : 'http';
$host   = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'www.ajedrezia.com';
$dir    = rtrim(str_replace('\\', '/', dirname(isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : '/')), '/');
$base   = $scheme . '://' . $host . $dir . '/';

// ---- Lectura/saneado de parámetros ---------------------------------------
function gp($k) { return isset($_GET[$k]) ? (string)$_GET[$k] : ''; }

$fen   = gp('fen');
$flip  = gp('flip') === '1' ? '1' : '';
$kind  = preg_replace('/[^a-z]/', '', strtolower(gp('kind')));
$t     = trim(gp('t'));
$s     = trim(gp('s'));
$mv    = preg_replace('/[^a-h1-8]/', '', strtolower(gp('mv')));

$moves   = preg_replace('/[^a-h1-8nbrqkNBRQKO=,\-]/', '', gp('moves'));
$opening = preg_replace('/[^A-Za-z0-9_\-]/', '', gp('opening'));
$puzzle  = preg_replace('/[^A-Za-z0-9_\-]/', '', gp('puzzle'));
$ppay    = preg_replace('/[^A-Za-z0-9_\-\.]/', '', gp('p'));
$master  = preg_replace('/[^a-z0-9\-]/', '', gp('master'));

$KIND_LABEL = [
    'partida'  => 'Partida',
    'apertura' => 'Apertura',
    'problema' => 'Problema de ajedrez',
    'maestra'  => 'Partida maestra',
];

// ---- ¿Robot de redes sociales? (no se le redirige) -----------------------
$ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
$isBot = (bool) preg_match(
    '/facebookexternalhit|Facebot|Twitterbot|WhatsApp|LinkedInBot|TelegramBot|Slackbot|Discordbot|Pinterest|redditbot|Google-?Bot|bingbot|Embedly|SkypeUriPreview|vkShare|W3C_Validator/i',
    $ua
);

// ---- Valores por defecto --------------------------------------------------
$title    = 'AjedrezIA — Juega y aprende ajedrez';
$desc     = 'Juega contra la IA, resuelve problemas y estudia aperturas y partidas maestras.';
$image    = $base . 'share-img/default.png';
$appUrl   = $base;
$shareUrl = $base . 'share.php';

// Construye la URL del destino real (la app) a partir del parámetro presente.
function buildAppUrl($base, $moves, $opening, $puzzle, $ppay, $master) {
    if ($moves !== '')   return $base . '?moves='  . rawurlencode($moves);
    if ($opening !== '') return $base . '?opening='. rawurlencode($opening);
    if ($puzzle !== '')  return $base . '?puzzle=' . rawurlencode($puzzle);
    if ($ppay !== '')    return $base . '?p='      . rawurlencode($ppay);
    if ($master !== '')  return $base . '?master=' . rawurlencode($master);
    return $base;
}

// Reconstruye la query original (sin valores vacíos) para og:url canónica.
function buildShareQuery($params) {
    $parts = [];
    foreach ($params as $k => $v) {
        if ($v !== '' && $v !== null) $parts[] = $k . '=' . rawurlencode($v);
    }
    return $parts ? ('?' . implode('&', $parts)) : '';
}

$genericParams = [
    'fen' => $fen, 'flip' => $flip, 'kind' => $kind, 't' => $t, 's' => $s, 'mv' => $mv,
    'moves' => $moves, 'opening' => $opening, 'puzzle' => $puzzle, 'p' => $ppay, 'master' => $master,
];

if ($fen !== '' || $t !== '') {
    // -- Modo genérico (partida / apertura / problema / maestra en tiempo real) --
    $kindLabel = isset($KIND_LABEL[$kind]) ? $KIND_LABEL[$kind] : 'Ajedrez';
    $title = ($t !== '' ? $t : $kindLabel) . ' — AjedrezIA';
    $desc  = $s !== '' ? $s : ($kindLabel . ' en AjedrezIA. Juega y aprende ajedrez.');

    $imgParams = [
        'fen' => $fen, 'flip' => $flip, 'kind' => $kind, 't' => $t, 's' => $s, 'mv' => $mv,
    ];
    $image    = $base . 'board-image.php' . buildShareQuery($imgParams);
    $appUrl   = buildAppUrl($base, $moves, $opening, $puzzle, $ppay, $master);
    $shareUrl = $base . 'share.php' . buildShareQuery($genericParams);
} elseif ($master !== '') {
    // -- Compatibilidad: enlaces antiguos share.php?master=clave --------------
    $games = @include __DIR__ . '/share-data.php';
    if (is_array($games) && isset($games[$master])) {
        $g     = $games[$master];
        $title = $g['title'] . ' — AjedrezIA';
        $desc  = $g['desc'];
        $image = $base . 'share-img/master-' . rawurlencode($master) . '.png';
    }
    $appUrl   = $base . '?master=' . rawurlencode($master);
    $shareUrl = $base . 'share.php?master=' . rawurlencode($master);
}

function h($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }

header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= h($title) ?></title>
<meta name="description" content="<?= h($desc) ?>">

<!-- Open Graph (Facebook, WhatsApp, LinkedIn...) -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="AjedrezIA">
<meta property="og:title" content="<?= h($title) ?>">
<meta property="og:description" content="<?= h($desc) ?>">
<meta property="og:image" content="<?= h($image) ?>">
<meta property="og:image:secure_url" content="<?= h($image) ?>">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="<?= h($title) ?>">
<meta property="og:url" content="<?= h($shareUrl) ?>">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= h($title) ?>">
<meta name="twitter:description" content="<?= h($desc) ?>">
<meta name="twitter:image" content="<?= h($image) ?>">

<link rel="canonical" href="<?= h($shareUrl) ?>">
<?php if (!$isBot): ?>
<!-- Redirección SOLO para visitantes humanos (los robots de redes se quedan
     aquí para leer las etiquetas Open Graph y montar la tarjeta). -->
<meta http-equiv="refresh" content="0; url=<?= h($appUrl) ?>">
<script>window.location.replace(<?= json_encode($appUrl) ?>);</script>
<?php endif; ?>
<style>
  body{font-family:Arial,Helvetica,sans-serif;background:#1f1b18;color:#e7e0d8;
       display:flex;min-height:100vh;margin:0;align-items:center;justify-content:center;text-align:center}
  a{color:#7fb069}
</style>
</head>
<body>
  <div>
    <p style="font-size:1.3rem">&#9822; <strong>AjedrezIA</strong></p>
    <p><?= h($title) ?></p>
    <p>Abriendo&hellip; si no se abre, <a href="<?= h($appUrl) ?>">pulsa aquí</a>.</p>
  </div>
</body>
</html>
