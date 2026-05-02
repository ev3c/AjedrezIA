<?php
header('Content-Type: application/json; charset=utf-8');

$allowedOrigins = ['https://www.ajedrezia.com', 'http://localhost:8000', 'http://127.0.0.1:8000'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Access-Control-Allow-Origin: ' . (in_array($origin, $allowedOrigins, true) ? $origin : 'https://www.ajedrezia.com'));
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

$uid = substr(trim($data['id']), 0, 128);
$elo = isset($data['elo']) ? (int)$data['elo'] : 1200;

$pdo->prepare("
    UPDATE ajedrezia_users SET last_seen = NOW(), elo = ? WHERE id = ?
")->execute([$elo, $uid]);

echo json_encode(['ok' => true]);
