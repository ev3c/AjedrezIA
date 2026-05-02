<?php
require __DIR__ . '/_db.php';
ai_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }
$d = json_decode(file_get_contents('php://input'), true);
if (empty($d['from_id']) || empty($d['to_id'])) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Missing data']); exit; }

try {
    $pdo = ai_pdo();
    ai_ensure_invites_table($pdo);

    // Cancelar invitaciones previas pendientes del mismo emisor
    $pdo->prepare("UPDATE ajedrezia_invites SET status='cancelled' WHERE from_id=? AND status='pending'")
        ->execute([$d['from_id']]);

    $stmt = $pdo->prepare("
        INSERT INTO ajedrezia_invites
            (from_id, from_nick, from_elo, to_id, from_color, time_control, time_label, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    ");
    $stmt->execute([
        substr($d['from_id'],   0, 128),
        substr($d['from_nick'] ?? '', 0, 64),
        (int)($d['from_elo']  ?? 1200),
        substr($d['to_id'],     0, 128),
        in_array($d['from_color'] ?? 'random', ['white','black','random']) ? $d['from_color'] : 'random',
        substr($d['time_control'] ?? '5+0', 0, 16),
        substr($d['time_label']   ?? '',     0, 64),
    ]);

    echo json_encode(['ok' => true, 'invite_id' => (int)$pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'DB error']);
}
