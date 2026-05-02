<?php
require __DIR__ . '/_db.php';
ai_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }
$d = json_decode(file_get_contents('php://input'), true);
if (empty($d['game_id']) || empty($d['user_id']) || empty($d['uci'])) { http_response_code(400); echo json_encode(['ok'=>false]); exit; }

// Validar UCI básico (4-5 caracteres alfanuméricos)
$uci = trim($d['uci']);
if (!preg_match('/^[a-h][1-8][a-h][1-8][qrbn]?$/', $uci)) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'bad_uci']); exit; }

try {
    $pdo = ai_pdo();
    ai_ensure_games_table($pdo);
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("SELECT * FROM ajedrezia_games WHERE id = ? FOR UPDATE");
    $stmt->execute([(int)$d['game_id']]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$game) { $pdo->rollBack(); http_response_code(404); echo json_encode(['ok'=>false]); exit; }
    if ($game['status'] !== 'active') { $pdo->rollBack(); echo json_encode(['ok'=>false,'error'=>'game_over']); exit; }

    // Verificar que es el turno del que envía
    $expected = ($game['current_turn'] === 'white') ? $game['white_id'] : $game['black_id'];
    if ($expected !== $d['user_id']) { $pdo->rollBack(); echo json_encode(['ok'=>false,'error'=>'not_your_turn']); exit; }

    $moves   = $game['moves'] ? trim($game['moves']) . ' ' . $uci : $uci;
    $newTurn = ($game['current_turn'] === 'white') ? 'black' : 'white';

    // Estado opcional (jaque mate / tablas reportado por el cliente)
    $finalStatus  = 'active';
    $finalReason  = '';
    if (!empty($d['result'])) {
        $r = $d['result'];
        if ($r === 'checkmate') {
            $finalStatus = ($game['current_turn'] === 'white') ? 'white_wins' : 'black_wins';
            $finalReason = 'checkmate';
        } elseif ($r === 'stalemate' || $r === 'threefold' || $r === 'fifty' || $r === 'insufficient') {
            $finalStatus = 'draw';
            $finalReason = $r;
        }
    }

    $upd = $pdo->prepare("
        UPDATE ajedrezia_games
        SET moves = ?, current_turn = ?, status = ?, result_reason = ?, ended_at = ?
        WHERE id = ?
    ");
    $upd->execute([
        $moves,
        $newTurn,
        $finalStatus,
        $finalReason,
        ($finalStatus === 'active') ? null : date('Y-m-d H:i:s'),
        (int)$d['game_id']
    ]);

    $pdo->commit();
    echo json_encode(['ok' => true, 'total_moves' => count(explode(' ', $moves)), 'status' => $finalStatus]);
} catch (PDOException $e) {
    if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
