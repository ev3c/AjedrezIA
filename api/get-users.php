<?php
header('Content-Type: application/json; charset=utf-8');

$allowedOrigins = ['https://www.ajedrezia.com', 'http://localhost:8000', 'http://127.0.0.1:8000'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Access-Control-Allow-Origin: ' . (in_array($origin, $allowedOrigins, true) ? $origin : 'https://www.ajedrezia.com'));
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

// Online = last_seen dentro de los últimos 90 segundos
$rows = $pdo->query("
    SELECT
        id,
        email,
        name,
        elo,
        last_login,
        CASE WHEN last_seen >= DATE_SUB(NOW(), INTERVAL 90 SECOND) THEN 1 ELSE 0 END AS online
    FROM ajedrezia_users
    ORDER BY online DESC, elo DESC
")->fetchAll(PDO::FETCH_ASSOC);

$users = array_map(function($r) {
    $nick = strstr($r['email'], '@', true) ?: $r['name'] ?: '?';
    return [
        'id'         => $r['id'],
        'nick'       => $nick,
        'name'       => $r['name'],
        'elo'        => (int)$r['elo'],
        'online'     => (bool)$r['online'],
        'last_login' => $r['last_login'],
    ];
}, $rows);

// ── Usuarios demo (offline) para mostrar el listado más poblado ────────
// Solo aparecen en el modal de jugadores; al estar offline no son invitables.
$demoUsers = [
    ['id'=>'demo1',  'nick'=>'jugador_demo',     'elo'=>1450],
    ['id'=>'demo2',  'nick'=>'ajedrez_fan',      'elo'=>1320],
    ['id'=>'demo3',  'nick'=>'magnus_junior',    'elo'=>1180],
    ['id'=>'demo4',  'nick'=>'caballo_loco',     'elo'=>1675],
    ['id'=>'demo5',  'nick'=>'reina_blanca',     'elo'=>1890],
    ['id'=>'demo6',  'nick'=>'gambit_master',    'elo'=>2100],
    ['id'=>'demo7',  'nick'=>'peoncito',         'elo'=>980],
    ['id'=>'demo8',  'nick'=>'torre_negra',      'elo'=>1540],
    ['id'=>'demo9',  'nick'=>'alfil_rapido',     'elo'=>1265],
    ['id'=>'demo10', 'nick'=>'enroque_corto',    'elo'=>1410],
    ['id'=>'demo11', 'nick'=>'jaque_mate_99',    'elo'=>1750],
    ['id'=>'demo12', 'nick'=>'capablanca_ii',    'elo'=>2250],
    ['id'=>'demo13', 'nick'=>'tablero_loco',     'elo'=>1120],
    ['id'=>'demo14', 'nick'=>'siciliana_pro',    'elo'=>1830],
    ['id'=>'demo15', 'nick'=>'rey_solitario',    'elo'=>1050],
    ['id'=>'demo16', 'nick'=>'dama_furiosa',     'elo'=>1620],
    ['id'=>'demo17', 'nick'=>'pasapeon',         'elo'=>1370],
    ['id'=>'demo18', 'nick'=>'al_passant',       'elo'=>1495],
    ['id'=>'demo19', 'nick'=>'fianchetto',       'elo'=>1985],
    ['id'=>'demo20', 'nick'=>'novato_2026',      'elo'=>880],
    ['id'=>'demo21', 'nick'=>'gran_maestro',     'elo'=>2400],
    ['id'=>'demo22', 'nick'=>'apertura_inglesa', 'elo'=>1710],
    ['id'=>'demo23', 'nick'=>'defensa_francesa', 'elo'=>1565],
    ['id'=>'demo24', 'nick'=>'mate_pastor',      'elo'=>1230],
    ['id'=>'demo25', 'nick'=>'bobby_fan',        'elo'=>1920],
];
foreach ($demoUsers as $d) {
    $users[] = [
        'id'         => $d['id'],
        'nick'       => $d['nick'],
        'name'       => 'Demo',
        'elo'        => $d['elo'],
        'online'     => false,
        'last_login' => null,
    ];
}

// Reordenar: online primero, luego por ELO desc (mantener consistencia)
usort($users, function($a, $b) {
    if ($a['online'] !== $b['online']) return $b['online'] - $a['online'];
    return $b['elo'] - $a['elo'];
});

echo json_encode(['ok' => true, 'users' => $users]);
