<?php
header('Content-Type: application/json; charset=utf-8');

$allowedOrigins = [
    'https://www.ajedrezia.com',
    'https://ajedrezia.com',
    'http://www.ajedrezia.com',
    'http://ajedrezia.com',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Access-Control-Allow-Origin: ' . (in_array($origin, $allowedOrigins, true) ? $origin : 'https://www.ajedrezia.com'));
header('Vary: Origin');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=u375553826_lichess_puzzle;charset=utf8mb4',
        'u375553826_root', 'Ev3c.1993',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) { http_response_code(500); echo json_encode(['ok'=>false,'users'   =>[]]); exit; }

// Migración: añadir columna status si no existe aún
try {
    $pdo->exec("ALTER TABLE ajedrezia_users ADD COLUMN status VARCHAR(20) DEFAULT 'available'");
} catch (PDOException $e) { /* ya existe */ }

// Online = last_seen dentro de los últimos 90 segundos
$rows = $pdo->query("
    SELECT
        id,
        email,
        name,
        elo,
        last_login,
        CASE WHEN last_seen >= DATE_SUB(NOW(), INTERVAL 90 SECOND) THEN 1 ELSE 0 END AS online,
        COALESCE(status, 'available') AS status
    FROM ajedrezia_users
    ORDER BY online DESC, elo DESC
")->fetchAll(PDO::FETCH_ASSOC);

$users = array_map(function($r) {
    $nick   = strstr($r['email'], '@', true) ?: $r['name'] ?: '?';
    $online = (bool)$r['online'];
    // Si el heartbeat expiró el usuario ya no está online, status pasa a 'offline'
    $status = $online ? ($r['status'] ?: 'available') : 'offline';
    return [
        'id'         => $r['id'],
        'nick'       => $nick,
        'name'       => $r['name'],
        'elo'        => (int)$r['elo'],
        'online'     => $online,
        'status'     => $status,
        'last_login' => $r['last_login'],
    ];
}, $rows);

// ── Bots siempre online ─────────────────────────────────────────────────
// Jugadores sintéticos que aparecen siempre disponibles. El cliente
// detecta el prefijo "bot_" y arranca una partida contra la IA local
// con el nivel correspondiente al ELO del bot.
$bots = [
    ['id'=>'bot_400',  'nick'=>'Bot_400',  'elo'=>400 ],
    ['id'=>'bot_700',  'nick'=>'Bot_700',  'elo'=>700 ],
    ['id'=>'bot_1000', 'nick'=>'Bot_1000', 'elo'=>1000],
    ['id'=>'bot_1200', 'nick'=>'Bot_1200', 'elo'=>1200],
    ['id'=>'bot_1500', 'nick'=>'Bot_1500', 'elo'=>1500],
    ['id'=>'bot_1800', 'nick'=>'Bot_1800', 'elo'=>1800],
    ['id'=>'bot_2200', 'nick'=>'Bot_2200', 'elo'=>2200],
    ['id'=>'bot_2500', 'nick'=>'Bot_2500', 'elo'=>2500],
];
foreach ($bots as $b) {
    $users[] = [
        'id'         => $b['id'],
        'nick'       => $b['nick'],
        'name'       => 'Bot',
        'elo'        => $b['elo'],
        'online'     => true,
        'status'     => 'available',
        'last_login' => null,
        'isBot'      => true,
    ];
}

// ── 100 jugadores demo ────────────────────────────────────────────────
// Se asigna estado online/ocupado de forma aleatoria con semilla temporal
// para que el listado parezca vivo cada vez que se abre el modal.
$demoUsers = [
    ['id'=>'demo001','nick'=>'jugador_demo',      'elo'=>1450],
    ['id'=>'demo002','nick'=>'ajedrez_fan',       'elo'=>1320],
    ['id'=>'demo003','nick'=>'magnus_junior',     'elo'=>1180],
    ['id'=>'demo004','nick'=>'caballo_loco',      'elo'=>1675],
    ['id'=>'demo005','nick'=>'reina_blanca',      'elo'=>1890],
    ['id'=>'demo006','nick'=>'gambit_master',     'elo'=>2100],
    ['id'=>'demo007','nick'=>'peoncito',          'elo'=>980],
    ['id'=>'demo008','nick'=>'torre_negra',       'elo'=>1540],
    ['id'=>'demo009','nick'=>'alfil_rapido',      'elo'=>1265],
    ['id'=>'demo010','nick'=>'enroque_corto',     'elo'=>1410],
    ['id'=>'demo011','nick'=>'jaque_mate_99',     'elo'=>1750],
    ['id'=>'demo012','nick'=>'capablanca_ii',     'elo'=>2250],
    ['id'=>'demo013','nick'=>'tablero_loco',      'elo'=>1120],
    ['id'=>'demo014','nick'=>'siciliana_pro',     'elo'=>1830],
    ['id'=>'demo015','nick'=>'rey_solitario',     'elo'=>1050],
    ['id'=>'demo016','nick'=>'dama_furiosa',      'elo'=>1620],
    ['id'=>'demo017','nick'=>'pasapeon',          'elo'=>1370],
    ['id'=>'demo018','nick'=>'al_passant',        'elo'=>1495],
    ['id'=>'demo019','nick'=>'fianchetto',        'elo'=>1985],
    ['id'=>'demo020','nick'=>'novato_2026',       'elo'=>880],
    ['id'=>'demo021','nick'=>'gran_maestro',      'elo'=>2400],
    ['id'=>'demo022','nick'=>'apertura_inglesa',  'elo'=>1710],
    ['id'=>'demo023','nick'=>'defensa_francesa',  'elo'=>1565],
    ['id'=>'demo024','nick'=>'mate_pastor',       'elo'=>1230],
    ['id'=>'demo025','nick'=>'bobby_fan',         'elo'=>1920],
    ['id'=>'demo026','nick'=>'ataque_indio',      'elo'=>1480],
    ['id'=>'demo027','nick'=>'gambito_rey',       'elo'=>1355],
    ['id'=>'demo028','nick'=>'nimzo_defense',     'elo'=>1790],
    ['id'=>'demo029','nick'=>'grünfeld_pro',      'elo'=>2030],
    ['id'=>'demo030','nick'=>'caro_kann_fan',     'elo'=>1640],
    ['id'=>'demo031','nick'=>'peon_pasado',       'elo'=>1160],
    ['id'=>'demo032','nick'=>'torres_gemelas',    'elo'=>1520],
    ['id'=>'demo033','nick'=>'bishop_hunter',     'elo'=>1395],
    ['id'=>'demo034','nick'=>'zugzwang_king',     'elo'=>2180],
    ['id'=>'demo035','nick'=>'blitz_relámpago',   'elo'=>1870],
    ['id'=>'demo036','nick'=>'pio_xieco',         'elo'=>945],
    ['id'=>'demo037','nick'=>'ruy_lopez_fan',     'elo'=>1725],
    ['id'=>'demo038','nick'=>'italiana_clásica',  'elo'=>1580],
    ['id'=>'demo039','nick'=>'española_cerrada',  'elo'=>1440],
    ['id'=>'demo040','nick'=>'dragón_siciliano',  'elo'=>1960],
    ['id'=>'demo041','nick'=>'kan_siciliano',     'elo'=>1305],
    ['id'=>'demo042','nick'=>'scheveningue_fan',  'elo'=>1670],
    ['id'=>'demo043','nick'=>'berlin_defense',    'elo'=>2050],
    ['id'=>'demo044','nick'=>'petroff_draw',      'elo'=>1100],
    ['id'=>'demo045','nick'=>'escocesa_clásica',  'elo'=>1755],
    ['id'=>'demo046','nick'=>'cuatro_caballos',   'elo'=>1215],
    ['id'=>'demo047','nick'=>'vienna_gambit',     'elo'=>1600],
    ['id'=>'demo048','nick'=>'london_system',     'elo'=>1885],
    ['id'=>'demo049','nick'=>'catalan_abierto',   'elo'=>2140],
    ['id'=>'demo050','nick'=>'nimzovich_fan',     'elo'=>1340],
    ['id'=>'demo051','nick'=>'enroque_largo',     'elo'=>1465],
    ['id'=>'demo052','nick'=>'sacrificio_alfil',  'elo'=>1810],
    ['id'=>'demo053','nick'=>'tenedor_doble',     'elo'=>1130],
    ['id'=>'demo054','nick'=>'clavada_perfecta',  'elo'=>1690],
    ['id'=>'demo055','nick'=>'ataque_polgar',     'elo'=>2300],
    ['id'=>'demo056','nick'=>'defensa_pirc',      'elo'=>1550],
    ['id'=>'demo057','nick'=>'moderna_defense',   'elo'=>1420],
    ['id'=>'demo058','nick'=>'benko_gambit',      'elo'=>1780],
    ['id'=>'demo059','nick'=>'benoni_defense',    'elo'=>1970],
    ['id'=>'demo060','nick'=>'slav_defense',      'elo'=>1270],
    ['id'=>'demo061','nick'=>'holandesa_fan',     'elo'=>1625],
    ['id'=>'demo062','nick'=>'budapest_gambit',   'elo'=>2085],
    ['id'=>'demo063','nick'=>'budapest_trap',     'elo'=>1025],
    ['id'=>'demo064','nick'=>'botvinnik_fan',     'elo'=>1840],
    ['id'=>'demo065','nick'=>'tal_sacrificador',  'elo'=>2220],
    ['id'=>'demo066','nick'=>'karpov_defensor',   'elo'=>1500],
    ['id'=>'demo067','nick'=>'spassky_1972',      'elo'=>1360],
    ['id'=>'demo068','nick'=>'anand_rápido',      'elo'=>1935],
    ['id'=>'demo069','nick'=>'carlsen_endgame',   'elo'=>2350],
    ['id'=>'demo070','nick'=>'kasparov_ataque',   'elo'=>2260],
    ['id'=>'demo071','nick'=>'fischer_random',    'elo'=>1715],
    ['id'=>'demo072','nick'=>'kramnik_solido',    'elo'=>1590],
    ['id'=>'demo073','nick'=>'topalov_agresivo',  'elo'=>1845],
    ['id'=>'demo074','nick'=>'leko_defensivo',    'elo'=>1475],
    ['id'=>'demo075','nick'=>'giri_draws',        'elo'=>2015],
    ['id'=>'demo076','nick'=>'nepo_blitz',        'elo'=>1930],
    ['id'=>'demo077','nick'=>'ding_liren_fan',    'elo'=>2195],
    ['id'=>'demo078','nick'=>'pragg_joven',       'elo'=>1655],
    ['id'=>'demo079','nick'=>'so_wesley',         'elo'=>1820],
    ['id'=>'demo080','nick'=>'nakamura_speed',    'elo'=>2120],
    ['id'=>'demo081','nick'=>'mvl_francés',       'elo'=>1765],
    ['id'=>'demo082','nick'=>'aronian_creativo',  'elo'=>2045],
    ['id'=>'demo083','nick'=>'grischuk_blitz',    'elo'=>1605],
    ['id'=>'demo084','nick'=>'mamedyarov_sharp',  'elo'=>1385],
    ['id'=>'demo085','nick'=>'gelfand_solido',    'elo'=>1530],
    ['id'=>'demo086','nick'=>'ivanchuk_genio',    'elo'=>2170],
    ['id'=>'demo087','nick'=>'shirov_fuego',      'elo'=>1900],
    ['id'=>'demo088','nick'=>'polgar_dama',       'elo'=>2285],
    ['id'=>'demo089','nick'=>'hou_yifan',         'elo'=>1745],
    ['id'=>'demo090','nick'=>'ju_wenjun',         'elo'=>1625],
    ['id'=>'demo091','nick'=>'peon_d4',           'elo'=>1070],
    ['id'=>'demo092','nick'=>'peon_e4',           'elo'=>1145],
    ['id'=>'demo093','nick'=>'ajedrecista_99',    'elo'=>1320],
    ['id'=>'demo094','nick'=>'táctico_feroz',     'elo'=>1430],
    ['id'=>'demo095','nick'=>'posicional_puro',   'elo'=>1870],
    ['id'=>'demo096','nick'=>'estratega_mayor',   'elo'=>2095],
    ['id'=>'demo097','nick'=>'blunder_king',      'elo'=>860],
    ['id'=>'demo098','nick'=>'endgame_wizard',    'elo'=>1990],
    ['id'=>'demo099','nick'=>'opening_bookworm',  'elo'=>1560],
    ['id'=>'demo100','nick'=>'chess960_fan',      'elo'=>1705],
    // ── FIDE Candidates 2026 Cyprus ──────────────────────────────────────
    ['id'=>'demo101','nick'=>'Caruana',           'elo'=>2795],
    ['id'=>'demo102','nick'=>'Nakamura',          'elo'=>2810],
    ['id'=>'demo103','nick'=>'Sindarov',          'elo'=>2745],
    ['id'=>'demo104','nick'=>'Wei_Yi',            'elo'=>2754],
    ['id'=>'demo105','nick'=>'Praggnanandhaa',    'elo'=>2741],
    ['id'=>'demo106','nick'=>'Giri',              'elo'=>2753],
    ['id'=>'demo107','nick'=>'Bluebaum',          'elo'=>2698],
    ['id'=>'demo108','nick'=>'Esipenko',          'elo'=>2698],
    ['id'=>'demo109','nick'=>'Goryachkina',       'elo'=>2534],
    ['id'=>'demo110','nick'=>'Tan_Zhongyi',       'elo'=>2535],
    ['id'=>'demo111','nick'=>'Lagno',             'elo'=>2508],
    ['id'=>'demo112','nick'=>'Zhu_Jiner',         'elo'=>2578],
    ['id'=>'demo113','nick'=>'Assaubayeva',       'elo'=>2516],
    ['id'=>'demo114','nick'=>'Muzychuk_A',        'elo'=>2522],
    ['id'=>'demo115','nick'=>'Vaishali',          'elo'=>2470],
    ['id'=>'demo116','nick'=>'Divya_Deshmukh',   'elo'=>2497],
];

// Semilla aleatoria basada en la hora actual para que cambie en cada visita
// pero sea reproducible dentro de la misma llamada (consistencia visual).
mt_srand(intval(date('His')));

// Barajar y elegir 4 jugadores demo que aparecen como ocupados (jugando)
// El resto siempre offline — los jugadores falsos nunca se muestran como disponibles.
$indices = array_keys($demoUsers);
shuffle($indices);
$busyIndices = array_slice($indices, 0, 25);

foreach ($demoUsers as $i => $d) {
    $isBusy = in_array($i, $busyIndices, true);
    $users[] = [
        'id'         => $d['id'],
        'nick'       => $d['nick'],
        'name'       => 'Demo',
        'elo'        => $d['elo'],
        'online'     => $isBusy,          // solo aparecen online si están ocupados
        'status'     => $isBusy ? 'busy' : 'offline',
        'last_login' => null,
    ];
}

// Orden: online disponibles → ocupados → offline; dentro de cada grupo, alfabético
usort($users, function($a, $b) {
    $rankA = ($a['online'] && $a['status'] === 'available') ? 0
           : ($a['online'] && $a['status'] === 'busy'      ? 1 : 2);
    $rankB = ($b['online'] && $b['status'] === 'available') ? 0
           : ($b['online'] && $b['status'] === 'busy'      ? 1 : 2);
    if ($rankA !== $rankB) return $rankA - $rankB;
    return strcasecmp($a['nick'], $b['nick']);
});

echo json_encode(['ok' => true, 'users' => $users]);
