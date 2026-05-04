<?php
require __DIR__ . '/_db.php';
ai_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }
$d = json_decode(file_get_contents('php://input'), true);
if (empty($d['game_id']) || empty($d['user_id']) || !isset($d['message'])) {
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'missing']); exit;
}

$message = trim((string)$d['message']);
if ($message === '') { echo json_encode(['ok'=>false,'error'=>'empty']); exit; }
if (mb_strlen($message) > 500) $message = mb_substr($message, 0, 500);

$gameId = (int)$d['game_id'];
$userId = substr(trim((string)$d['user_id']), 0, 128);
$nick   = substr(trim((string)($d['nick'] ?? '')), 0, 64);
$now    = date('Y-m-d H:i:s');

try {
    $pdo = ai_pdo();
    ai_ensure_games_table($pdo);
    ai_ensure_chat_table($pdo);

    // Verificar que el usuario pertenece a la partida (evita spam entre desconocidos)
    $stmt = $pdo->prepare("SELECT white_id, black_id FROM ajedrezia_games WHERE id = ?");
    $stmt->execute([$gameId]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$game) { http_response_code(404); echo json_encode(['ok'=>false,'error'=>'game_not_found']); exit; }
    if ($game['white_id'] !== $userId && $game['black_id'] !== $userId) {
        http_response_code(403); echo json_encode(['ok'=>false,'error'=>'not_a_player']); exit;
    }

    // Rate-limit sencillo: máximo 1 mensaje por segundo por usuario
    $rl = $pdo->prepare("SELECT COUNT(*) FROM ajedrezia_chat WHERE game_id = ? AND user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 SECOND)");
    $rl->execute([$gameId, $userId]);
    if ((int)$rl->fetchColumn() > 0) { echo json_encode(['ok'=>false,'error'=>'too_fast']); exit; }

    $ins = $pdo->prepare("INSERT INTO ajedrezia_chat (game_id, user_id, nick, message, created_at) VALUES (?, ?, ?, ?, ?)");
    $ins->execute([$gameId, $userId, $nick, $message, $now]);

    echo json_encode([
        'ok'         => true,
        'id'         => (int)$pdo->lastInsertId(),
        'created_at' => $now,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok'=>false,'error'=>'db']);
}
