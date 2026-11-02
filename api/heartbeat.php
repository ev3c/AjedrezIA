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
$originAllowed = in_array($origin, $allowedOrigins, true)
    || preg_match('#^http://(127\.0\.0\.1|localhost)(:\d+)?$#', $origin);
header('Access-Control-Allow-Origin: ' . ($originAllowed ? $origin : 'https://www.ajedrezia.com'));
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['ok'=>false]); exit; }

$data = json_decode(file_get_contents('php://input'), true);
if (empty($data['id'])) { http_response_code(400); echo json_encode(['ok'=>false]); exit; }

try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=u375553826_lichess_puzzle;charset=utf8mb4',
        'u375553826_root', 'Ev3c.1993',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) { http_response_code(500); echo json_encode(['ok'=>false]); exit; }

// Migración: añadir columna status si no existe
try {
    $pdo->exec("ALTER TABLE ajedrezia_users ADD COLUMN status VARCHAR(20) DEFAULT 'available'");
} catch (PDOException $e) { /* ya existe */ }

$uid      = substr(trim($data['id']), 0, 128);
$busy     = !empty($data['busy']);
$offline  = !empty($data['offline']);
$status   = $offline ? 'offline' : ($busy ? 'busy' : 'available');
$name     = substr(trim($data['name'] ?? ''), 0, 255);
$provider = substr(trim($data['provider'] ?? ''), 0, 20);

if ($offline) {
    $pdo->prepare("UPDATE ajedrezia_users SET last_seen = NULL, status = 'offline' WHERE id = ?")->execute([$uid]);
    echo json_encode(['ok' => true]);
    exit;
}

$upd = $pdo->prepare("
    UPDATE ajedrezia_users SET last_seen = NOW(), status = ? WHERE id = ?
");
$upd->execute([$status, $uid]);

if ($upd->rowCount() === 0 && strpos($uid, 'guest-') === 0) {
    $now = date('Y-m-d H:i:s');
    $pdo->prepare("
        INSERT INTO ajedrezia_users
            (id, provider, email, name, first_login, last_login, last_seen, login_count, last_ip, elo, status)
        VALUES (?, ?, '', ?, ?, ?, ?, 1, '', 1200, ?)
    ")->execute([
        $uid,
        $provider !== '' ? $provider : 'guest',
        $name,
        $now,
        $now,
        $now,
        $status,
    ]);
}

echo json_encode(['ok' => true]);
