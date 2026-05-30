<?php
/*
 * Landing de compartir con tarjeta enriquecida (Open Graph / Twitter Card).
 *
 * Los robots de Facebook, X (Twitter) y WhatsApp NO ejecutan JavaScript: leen
 * el HTML crudo. Este archivo genera las metaetiquetas og:/twitter: en el
 * servidor para que la tarjeta muestre la imagen del tablero y el título.
 *
 * A las personas se las redirige a la app real (index.html con el mismo
 * parámetro) en una fracción de segundo.
 *
 *   share.php?master=opera   -> tarjeta de "La Partida de la Ópera"
 */

// Base detectada automáticamente desde la petición: funciona en producción
// (https://www.ajedrezia.com/) y también en local (http://localhost:8000/).
$scheme = (!empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off') ? 'https' : 'http';
$host   = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'www.ajedrezia.com';
$dir    = rtrim(str_replace('\\', '/', dirname(isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : '/')), '/');
$base   = $scheme . '://' . $host . $dir . '/';

$master = isset($_GET['master']) ? preg_replace('/[^a-z0-9\-]/', '', $_GET['master']) : '';

// $appUrl   -> destino real (la app) al que se redirige a las personas.
// $shareUrl -> URL canónica de la TARJETA (este mismo share.php). IMPORTANTE:
//              og:url debe apuntar aquí, no a la app: Facebook usa og:url como
//              URL canónica del objeto y re-rastrea esa página para la imagen.
//              Si apuntara a la app (index.html, sin og tags), la tarjeta de
//              Facebook saldría vacía aunque WhatsApp/X sí la muestren.
$title    = 'AjedrezIA — Juega y aprende ajedrez';
$desc     = 'Juega contra la IA, resuelve problemas y estudia aperturas y partidas maestras.';
$image    = $base . 'share-img/default.png';
$appUrl   = $base;
$shareUrl = $base . 'share.php';
$imageW   = '1200';
$imageH   = '630';

if ($master !== '') {
    $games = @include __DIR__ . '/share-data.php';
    if (is_array($games) && isset($games[$master])) {
        $g        = $games[$master];
        $title    = $g['title'] . ' — AjedrezIA';
        $desc     = $g['desc'];
        $image    = $base . 'share-img/master-' . rawurlencode($master) . '.png';
        $appUrl   = $base . '?master=' . rawurlencode($master);
        $shareUrl = $base . 'share.php?master=' . rawurlencode($master);
        $imageW   = '1200';
        $imageH   = '630';
    } else {
        // Clave desconocida: abrir la app igualmente con el parámetro recibido
        $appUrl   = $base . '?master=' . rawurlencode($master);
        $shareUrl = $base . 'share.php?master=' . rawurlencode($master);
    }
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
<meta property="og:image:width" content="<?= h($imageW) ?>">
<meta property="og:image:height" content="<?= h($imageH) ?>">
<meta property="og:image:alt" content="<?= h($title) ?>">
<meta property="og:url" content="<?= h($shareUrl) ?>">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= h($title) ?>">
<meta name="twitter:description" content="<?= h($desc) ?>">
<meta name="twitter:image" content="<?= h($image) ?>">

<!-- Redirección para visitantes humanos -->
<meta http-equiv="refresh" content="0; url=<?= h($appUrl) ?>">
<link rel="canonical" href="<?= h($shareUrl) ?>">
<script>window.location.replace(<?= json_encode($appUrl) ?>);</script>
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
