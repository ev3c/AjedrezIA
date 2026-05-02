<?php
require __DIR__ . '/_db.php';
ai_cors();

$id      = (int)($_GET['game_id']     ?? 0);
$user_id = $_GET['user_id']           ?? '';
$since   = (int)($_GET['since_count'] ?? 0);
if (!$id) { http_response_code(400); echo json_encode(['ok'=>false]); exit; }

try {
    $pdo = ai_pdo();
    ai_ensure_games_table($pdo);

    // Marcar presencia del usuario
    if ($user_id) {
        $col = null;
        $check = $pdo->prepare("SELECT white_id, black_id FROM ajedrezia_games WHERE id = ?");
        $check->execute([$id]);
        $r = $check->fetch(PDO::FETCH_ASSOC);
        if ($r) {
            if ($r['white_id'] === $user_id) $col = 'white_seen';
            elseif ($r['black_id'] === $user_id) $col = 'black_seen';
            if ($col) $pdo->prepare("UPDATE ajedrezia_games SET {$col} = NOW() WHERE id = ?")->execute([$id]);
        }
    }

    $stmt = $pdo->prepare("SELECT * FROM ajedrezia_games WHERE id = ?");
    $stmt->execute([$id]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$game) { http_response_code(404); echo json_encode(['ok'=>false,'error'=>'not_found']); exit; }

    $movesArr   = $game['moves'] ? explode(' ', trim($game['moves'])) : [];
    $totalMoves = count($movesArr);
    $newMoves   = ($since > 0 && $since <= $totalMoves) ? array_slice($movesArr, $since) : $movesArr;

    echo json_encode([
        'ok'             => true,
        'id'             => (int)$game['id'],
        'white_id'       => $game['white_id'],
        'black_id'       => $game['black_id'],
        'white_nick'     => $game['white_nick'],
        'black_nick'     => $game['black_nick'],
        'white_elo'      => (int)$game['white_elo'],
        'black_elo'      => (int)$game['black_elo'],
        'time_per_player'=> (int)$game['time_per_player'],
        'increment'      => (int)$game['increment'],
        'time_control'   => $game['time_control'],
        'current_turn'   => $game['current_turn'],
        'status'         => $game['status'],
        'result_reason'  => $game['result_reason'],
        'total_moves'    => $totalMoves,
        'new_moves'      => $newMoves,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
