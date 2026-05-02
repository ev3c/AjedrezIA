<?php
require __DIR__ . '/_db.php';
ai_cors();

$user_id = $_GET['user_id'] ?? '';
if (!$user_id) { http_response_code(400); echo json_encode(['ok'=>false,'invites'=>[]]); exit; }

try {
    $pdo = ai_pdo();
    ai_ensure_invites_table($pdo);

    $stmt = $pdo->prepare("
        SELECT id, from_id, from_nick, from_elo, from_color, time_control, time_label, created_at
        FROM ajedrezia_invites
        WHERE to_id = ? AND status = 'pending'
        ORDER BY created_at ASC
    ");
    $stmt->execute([$user_id]);
    $invites = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['ok' => true, 'invites' => $invites]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'invites' => []]);
}
