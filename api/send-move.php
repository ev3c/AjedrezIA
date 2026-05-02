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
    $isFirstMove = empty(trim((string)$game['moves']));

    // ── Reloj ────────────────────────────────────────────────────────────
    // Se descuenta tiempo al jugador que mueve por el tiempo transcurrido
    // desde last_move_at (excepto en el primer movimiento, donde el reloj
    // arranca recién ahora). Tras descontar, se suma el incremento.
    $whiteMs   = (int)$game['white_time_ms'];
    $blackMs   = (int)$game['black_time_ms'];
    $incrMs    = (int)$game['increment'] * 1000;
    $timeoutLoss = false;
    if (!$isFirstMove && $game['last_move_at']) {
        // Diferencia en ms con precisión de milisegundos
        $elapsedRow = $pdo->prepare("SELECT TIMESTAMPDIFF(MICROSECOND, ?, NOW(3)) AS us");
        $elapsedRow->execute([$game['last_move_at']]);
        $elapsedMs = (int)floor(((int)$elapsedRow->fetch(PDO::FETCH_ASSOC)['us']) / 1000);
        if ($game['current_turn'] === 'white') {
            $remaining = $whiteMs - $elapsedMs;
            if ($remaining <= 0) {
                $whiteMs = 0;
                $timeoutLoss = true;
            } else {
                $whiteMs = $remaining + $incrMs;
            }
        } else {
            $remaining = $blackMs - $elapsedMs;
            if ($remaining <= 0) {
                $blackMs = 0;
                $timeoutLoss = true;
            } else {
                $blackMs = $remaining + $incrMs;
            }
        }
    }

    // Estado opcional (jaque mate / tablas reportado por el cliente, o timeout detectado por servidor)
    $finalStatus  = 'active';
    $finalReason  = '';
    if ($timeoutLoss) {
        // El que acaba de mover se ha quedado sin tiempo
        $finalStatus = ($game['current_turn'] === 'white') ? 'black_wins' : 'white_wins';
        $finalReason = 'timeout';
    } elseif (!empty($d['result'])) {
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
        SET moves = ?, current_turn = ?, status = ?, result_reason = ?, ended_at = ?,
            white_time_ms = ?, black_time_ms = ?, last_move_at = NOW(3)
        WHERE id = ?
    ");
    $upd->execute([
        $moves,
        $newTurn,
        $finalStatus,
        $finalReason,
        ($finalStatus === 'active') ? null : date('Y-m-d H:i:s'),
        $whiteMs,
        $blackMs,
        (int)$d['game_id']
    ]);

    $pdo->commit();
    echo json_encode([
        'ok' => true,
        'total_moves'   => count(explode(' ', $moves)),
        'status'        => $finalStatus,
        'white_time_ms' => $whiteMs,
        'black_time_ms' => $blackMs,
    ]);
} catch (PDOException $e) {
    if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
