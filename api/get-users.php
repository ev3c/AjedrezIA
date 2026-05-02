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

echo json_encode(['ok' => true, 'users' => $users]);
