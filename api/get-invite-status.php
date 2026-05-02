<?php
require __DIR__ . '/_db.php';
ai_cors();

$id = (int)($_GET['invite_id'] ?? 0);
if (!$id) { http_response_code(400); echo json_encode(['ok'=>false]); exit; }

try {
    $pdo = ai_pdo();
    ai_ensure_invites_table($pdo);

    $stmt = $pdo->prepare("SELECT status, game_id FROM ajedrezia_invites WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'ok'      => true,
        'status'  => $row ? $row['status'] : 'not_found',
        'game_id' => $row && $row['game_id'] ? (int)$row['game_id'] : null,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
