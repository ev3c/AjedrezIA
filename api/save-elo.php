<?php
require __DIR__ . '/_db.php';
ai_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$d = json_decode(file_get_contents('php://input'), true);
if (empty($d['id']) || !isset($d['elo'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing data']);
    exit;
}

$uid = substr(trim($d['id']), 0, 128);
$elo = (int)$d['elo'];
if ($elo < 100) $elo = 100;
if ($elo > 4000) $elo = 4000;

try {
    $pdo = ai_pdo();
    $stmt = $pdo->prepare('UPDATE ajedrezia_users SET elo = ? WHERE id = ?');
    $stmt->execute([$elo, $uid]);
    echo json_encode(['ok' => true, 'elo' => $elo]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
