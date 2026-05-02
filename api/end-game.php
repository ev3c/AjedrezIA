<?php
require __DIR__ . '/_db.php';
ai_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }
$d = json_decode(file_get_contents('php://input'), true);
if (empty($d['game_id']) || empty($d['user_id']) || empty($d['reason'])) { http_response_code(400); echo json_encode(['ok'=>false]); exit; }

$reason = $d['reason']; // resign, timeout, draw_agreed, abort

try {
    $pdo = ai_pdo();
    ai_ensure_games_table($pdo);

    $stmt = $pdo->prepare("SELECT * FROM ajedrezia_games WHERE id = ?");
    $stmt->execute([(int)$d['game_id']]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$game) { http_response_code(404); echo json_encode(['ok'=>false]); exit; }
    if ($game['status'] !== 'active') { echo json_encode(['ok'=>true,'status'=>$game['status']]); exit; }

    $finalStatus = 'aborted';
    if ($reason === 'resign') {
        // El que abandona pierde
        if ($d['user_id'] === $game['white_id']) $finalStatus = 'black_wins';
        elseif ($d['user_id'] === $game['black_id']) $finalStatus = 'white_wins';
    } elseif ($reason === 'timeout') {
        if ($d['user_id'] === $game['white_id']) $finalStatus = 'black_wins';
        elseif ($d['user_id'] === $game['black_id']) $finalStatus = 'white_wins';
    } elseif ($reason === 'draw_agreed') {
        $finalStatus = 'draw';
    }

    $pdo->prepare("UPDATE ajedrezia_games SET status = ?, result_reason = ?, ended_at = NOW() WHERE id = ?")
        ->execute([$finalStatus, substr($reason, 0, 32), (int)$d['game_id']]);

    echo json_encode(['ok' => true, 'status' => $finalStatus]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
