<?php
require __DIR__ . '/_db.php';
ai_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }

$gameId  = isset($_GET['game_id'])  ? (int)$_GET['game_id']  : 0;
$sinceId = isset($_GET['since_id']) ? (int)$_GET['since_id'] : 0;
if ($gameId <= 0) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'missing_game_id']); exit; }

try {
    $pdo = ai_pdo();
    ai_ensure_chat_table($pdo);

    $stmt = $pdo->prepare("
        SELECT id, user_id, nick, message, created_at
        FROM ajedrezia_chat
        WHERE game_id = ? AND id > ?
        ORDER BY id ASC
        LIMIT 200
    ");
    $stmt->execute([$gameId, $sinceId]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $out = array_map(function($r) {
        return [
            'id'         => (int)$r['id'],
            'user_id'    => $r['user_id'],
            'nick'       => $r['nick'],
            'message'    => $r['message'],
            'created_at' => $r['created_at'],
        ];
    }, $messages);

    echo json_encode(['ok' => true, 'messages' => $out]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok'=>false,'error'=>'db']);
}
