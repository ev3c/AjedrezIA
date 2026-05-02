<?php
require __DIR__ . '/_db.php';
ai_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }
$d = json_decode(file_get_contents('php://input'), true);
if (empty($d['game_id']) || empty($d['user_id']) || !isset($d['delta'])) {
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Missing fields']); exit;
}

try {
    $pdo = ai_pdo();
    ai_ensure_elo_log_table($pdo);

    // INSERT IGNORE garantiza idempotencia: si ya se aplicó el ELO para esta partida+usuario, no hace nada.
    $stmt = $pdo->prepare("
        INSERT IGNORE INTO ajedrezia_elo_log (game_id, user_id, delta, applied_at)
        VALUES (?, ?, ?, NOW())
    ");
    $stmt->execute([(int)$d['game_id'], $d['user_id'], (int)$d['delta']]);

    if ($stmt->rowCount() === 0) {
        echo json_encode(['ok'=>true,'skipped'=>true]); exit;
    }

    $pdo->prepare("UPDATE ajedrezia_users SET elo = GREATEST(100, elo + ?) WHERE id = ?")
        ->execute([(int)$d['delta'], $d['user_id']]);

    echo json_encode(['ok'=>true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok'=>false]);
}
