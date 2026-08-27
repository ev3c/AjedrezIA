<?php
require __DIR__ . '/_db.php';
ai_cors();

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method !== 'GET' && $method !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$uid = '';
if ($method === 'GET') {
    $uid = trim($_GET['id'] ?? '');
} else {
    $d = json_decode(file_get_contents('php://input'), true) ?: [];
    $uid = trim($d['id'] ?? '');
}
$uid = substr($uid, 0, 128);
if ($uid === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing id']);
    exit;
}

try {
    $pdo = ai_pdo();
    $stmt = $pdo->prepare('SELECT elo, name, email, provider FROM ajedrezia_users WHERE id = ?');
    $stmt->execute([$uid]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        echo json_encode(['ok' => false, 'error' => 'not_found']);
        exit;
    }
    echo json_encode([
        'ok'       => true,
        'elo'      => (int)($row['elo'] ?? 1200),
        'name'     => $row['name'] ?? '',
        'email'    => $row['email'] ?? '',
        'provider' => $row['provider'] ?? '',
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
