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
 *   fen, flip, kind, t (título), s (subtítulo), meta, mv (última jugada UCI) -> imagen + textos
 *   m | moves | opening | puzzle | p | master                          -> a dónde abrir la app
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

$fen   = substr(gp('fen'), 0, 100);
$flip  = gp('flip') === '1' ? '1' : '';
$kind  = preg_replace('/[^a-z]/', '', strtolower(gp('kind')));
$t     = mb_substr(trim(gp('t')), 0, 220);
$s     = mb_substr(trim(gp('s')), 0, 120);
$meta  = mb_substr(trim(gp('meta')), 0, 420);
$mv    = substr(preg_replace('/[^a-h1-8]/', '', strtolower(gp('mv'))), 0, 4);
$cb    = substr(preg_replace('/[^A-Za-z0-9_\-]/', '', gp('cb')), 0, 40);

$packedMoves = preg_replace('/[^A-Za-z0-9_\-]/', '', gp('m'));
$moves   = preg_replace('/[^a-h1-8nbrqkNBRQKO=,\-]/', '', gp('moves'));
$opening = preg_replace('/[^A-Za-z0-9_\-]/', '', gp('opening'));
$puzzle  = preg_replace('/[^A-Za-z0-9_\-]/', '', gp('puzzle'));
$ppay    = preg_replace('/[^A-Za-z0-9_\-\.]/', '', gp('p'));
$master  = preg_replace('/[^a-z0-9\-]/', '', gp('master'));

$langParam = strtolower(gp('lang'));
$acceptLang = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? strtolower($_SERVER['HTTP_ACCEPT_LANGUAGE']) : 'es';
$shareLangs = ['es', 'en', 'ca', 'de', 'fr', 'it', 'pt', 'zh', 'ru', 'ar', 'ja', 'hi', 'ko'];
if (in_array($langParam, $shareLangs, true)) {
    $shareLang = $langParam;
} else {
    $shareLang = 'en';
    $aliases = ['cat' => 'ca', 'jp' => 'ja', 'kr' => 'ko', 'cn' => 'zh'];
    foreach ($aliases as $alias => $code) {
        if (strpos($acceptLang, $alias) === 0) { $shareLang = $code; break; }
    }
    if ($shareLang === 'en') {
        foreach ($shareLangs as $code) {
            if (strpos($acceptLang, $code) === 0) { $shareLang = $code; break; }
        }
    }
}

$KIND_LABELS = [
    'en' => [
        'partida'  => 'Game',
        'apertura' => 'Opening',
        'problema' => 'Chess puzzle and 30 more',
        'maestra'  => 'Master game',
        'chess'    => 'Chess',
        'title'    => 'AjedrezIA — Play and learn chess',
        'desc'     => 'Play against the AI, solve puzzles and study openings and master games.',
        'suffix'   => ' on AjedrezIA. Play and learn chess.',
    ],
    'ca' => [
        'partida'  => 'Partida',
        'apertura' => 'Obertura',
        'problema' => 'Problema d\'escacs i 30 més',
        'maestra'  => 'Partida mestra',
        'chess'    => 'Escacs',
        'title'    => 'AjedrezIA — Juga i aprèn escacs',
        'desc'     => 'Juga contra la IA, resol problemes i estudia obertures i partides mestres.',
        'suffix'   => ' a AjedrezIA. Juga i aprèn escacs.',
    ],
    'es' => [
        'partida'  => 'Partida',
        'apertura' => 'Apertura',
        'problema' => 'Problema de ajedrez y 30 más',
        'maestra'  => 'Partida maestra',
        'chess'    => 'Ajedrez',
        'title'    => 'AjedrezIA — Juega y aprende ajedrez',
        'desc'     => 'Juega contra la IA, resuelve problemas y estudia aperturas y partidas maestras.',
        'suffix'   => ' en AjedrezIA. Juega y aprende ajedrez.',
    ],
    'de' => [
        'partida'  => 'Partie',
        'apertura' => 'Eröffnung',
        'problema' => 'Schachaufgabe und 30 weitere',
        'maestra'  => 'Meisterpartie',
        'chess'    => 'Schach',
        'title'    => 'AjedrezIA — Spiele und lerne Schach',
        'desc'     => 'Spiele gegen die KI, löse Aufgaben und studiere Eröffnungen und Meisterpartien.',
        'suffix'   => ' auf AjedrezIA. Spiele und lerne Schach.',
    ],
    'fr' => [
        'partida'  => 'Partie',
        'apertura' => 'Ouverture',
        'problema' => 'Problème d\'échecs et 30 de plus',
        'maestra'  => 'Partie de maître',
        'chess'    => 'Échecs',
        'title'    => 'AjedrezIA — Joue et apprends les échecs',
        'desc'     => 'Joue contre l\'IA, résous des problèmes et étudie les ouvertures et les parties de maîtres.',
        'suffix'   => ' sur AjedrezIA. Joue et apprends les échecs.',
    ],
    'it' => [
        'partida'  => 'Partita',
        'apertura' => 'Apertura',
        'problema' => 'Problema di scacchi e altri 30',
        'maestra'  => 'Partita magistrale',
        'chess'    => 'Scacchi',
        'title'    => 'AjedrezIA — Gioca e impara gli scacchi',
        'desc'     => 'Gioca contro l\'IA, risolvi problemi e studia aperture e partite magistrali.',
        'suffix'   => ' su AjedrezIA. Gioca e impara gli scacchi.',
    ],
    'pt' => [
        'partida'  => 'Partida',
        'apertura' => 'Abertura',
        'problema' => 'Problema de xadrez e mais 30',
        'maestra'  => 'Partida de mestre',
        'chess'    => 'Xadrez',
        'title'    => 'AjedrezIA — Joga e aprende xadrez',
        'desc'     => 'Joga contra a IA, resolve problemas e estuda aberturas e partidas de mestres.',
        'suffix'   => ' no AjedrezIA. Joga e aprende xadrez.',
    ],
    'zh' => [
        'partida'  => '对局',
        'apertura' => '开局',
        'problema' => '象棋谜题及另外30题',
        'maestra'  => '名局',
        'chess'    => '国际象棋',
        'title'    => 'AjedrezIA — 下棋并学习国际象棋',
        'desc'     => '与人工智能对弈、解题，并学习开局与名局。',
        'suffix'   => '，尽在 AjedrezIA。下棋并学习国际象棋。',
    ],
    'ru' => [
        'partida'  => 'Партия',
        'apertura' => 'Дебют',
        'problema' => 'Шахматная задача и ещё 30',
        'maestra'  => 'Партия мастера',
        'chess'    => 'Шахматы',
        'title'    => 'AjedrezIA — Играй и учись шахматам',
        'desc'     => 'Играй против ИИ, решай задачи и изучай дебюты и партии мастеров.',
        'suffix'   => ' на AjedrezIA. Играй и учись шахматам.',
    ],
    'ar' => [
        'partida'  => 'مباراة',
        'apertura' => 'افتتاح',
        'problema' => 'لغز شطرنج و30 أخرى',
        'maestra'  => 'مباراة أستاذ',
        'chess'    => 'شطرنج',
        'title'    => 'AjedrezIA — العب وتعلّم الشطرنج',
        'desc'     => 'العب ضد الذكاء الاصطناعي، حل الألغاز وادرس الافتتاحات ومباريات الأساتذة.',
        'suffix'   => ' على AjedrezIA. العب وتعلّم الشطرنج.',
    ],
    'ja' => [
        'partida'  => '対局',
        'apertura' => 'オープニング',
        'problema' => 'チェスの問題とさらに30問',
        'maestra'  => '名局',
        'chess'    => 'チェス',
        'title'    => 'AjedrezIA — チェスを指して学ぶ',
        'desc'     => 'AIと対局し、問題を解き、オープニングと名局を学びましょう。',
        'suffix'   => ' — AjedrezIA。チェスを指して学ぶ。',
    ],
    'hi' => [
        'partida'  => 'खेल',
        'apertura' => 'ओपनिंग',
        'problema' => 'शतरंज पहेली और 30 और',
        'maestra'  => 'मास्टर गेम',
        'chess'    => 'शतरंज',
        'title'    => 'AjedrezIA — शतरंज खेलें और सीखें',
        'desc'     => 'AI से खेलें, पहेलियाँ हल करें और ओपनिंग व मास्टर खेलों का अध्ययन करें।',
        'suffix'   => ' AjedrezIA पर। शतरंज खेलें और सीखें।',
    ],
    'ko' => [
        'partida'  => '대국',
        'apertura' => '오프닝',
        'problema' => '체스 퍼즐과 30개 더',
        'maestra'  => '명국',
        'chess'    => '체스',
        'title'    => 'AjedrezIA — 체스를 두고 배우기',
        'desc'     => 'AI와 대국하고, 퍼즐을 풀며, 오프닝과 명국을 공부하세요.',
        'suffix'   => ' — AjedrezIA. 체스를 두고 배우기.',
    ],
];
$KIND_LABEL = isset($KIND_LABELS[$shareLang]) ? $KIND_LABELS[$shareLang] : $KIND_LABELS['en'];

// ---- ¿Robot de redes sociales? (no se le redirige) -----------------------
$ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
$isBot = (bool) preg_match(
    '/facebookexternalhit|Facebot|Twitterbot|WhatsApp|LinkedInBot|TelegramBot|Slackbot|Discordbot|Pinterest|redditbot|Google-?Bot|bingbot|Embedly|SkypeUriPreview|vkShare|W3C_Validator/i',
    $ua
);

// ---- Valores por defecto --------------------------------------------------
$title    = $KIND_LABEL['title'];
$desc     = $KIND_LABEL['desc'];
$image    = $base . 'share-img/default.png';
$appUrl   = $base;
$shareUrl = $base . 'share.php';

// Construye la URL del destino real (la app) a partir del parámetro presente.
function buildAppUrl($base, $packedMoves, $moves, $opening, $puzzle, $ppay, $master) {
    if ($packedMoves !== '') return $base . '?m=' . rawurlencode($packedMoves);
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
    'fen' => $fen, 'flip' => $flip, 'kind' => $kind, 't' => $t, 's' => $s, 'meta' => $meta, 'mv' => $mv, 'cb' => $cb,
    'lang' => $shareLang,
    'm' => $packedMoves, 'moves' => $moves, 'opening' => $opening, 'puzzle' => $puzzle, 'p' => $ppay, 'master' => $master,
];

if ($fen !== '' || $t !== '' || $packedMoves !== '' || $moves !== '') {
    // -- Modo genérico (partida / apertura / problema / maestra en tiempo real) --
    $kindLabel = isset($KIND_LABEL[$kind]) ? $KIND_LABEL[$kind] : $KIND_LABEL['chess'];
    $title = ($t !== '' ? $t : $kindLabel) . ' — AjedrezIA';
    $desc  = $s !== '' ? $s : ($kindLabel . $KIND_LABEL['suffix']);

    $imgParams = [
        'fen' => $fen, 'flip' => $flip, 'kind' => $kind, 't' => $t, 's' => $s, 'meta' => $meta, 'mv' => $mv, 'cb' => $cb,
        'lang' => $shareLang,
    ];
    $image    = $base . 'board-image.php' . buildShareQuery($imgParams);
    $appUrl   = buildAppUrl($base, $packedMoves, $moves, $opening, $puzzle, $ppay, $master);
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
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
?>
<!DOCTYPE html>
<html lang="<?= htmlspecialchars($shareLang, ENT_QUOTES, 'UTF-8') ?>">
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
<meta property="og:image:url" content="<?= h($image) ?>">
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
