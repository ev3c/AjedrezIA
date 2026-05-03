<?php
require __DIR__ . '/_db.php';
ai_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }
$d = json_decode(file_get_contents('php://input'), true);
if (empty($d['game_id']) || empty($d['user_id']) || empty($d['action'])) {
    http_response_code(400); echo json_encode(['ok'=>false]); exit;
}

$action = ($d['action'] === 'accept') ? 'accept' : 'reject';

try {
    $pdo = ai_pdo();
    ai_ensure_games_table($pdo);

    $pdo->beginTransaction();
    $stmt = $pdo->prepare("SELECT * FROM ajedrezia_games WHERE id = ? FOR UPDATE");
    $stmt->execute([(int)$d['game_id']]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$game) { $pdo->rollBack(); http_response_code(404); echo json_encode(['ok'=>false]); exit; }
    if ($game['status'] !== 'active') { $pdo->rollBack(); echo json_encode(['ok'=>false,'error'=>'game_over']); exit; }
    if (empty($game['draw_offer'])) { $pdo->rollBack(); echo json_encode(['ok'=>false,'error'=>'no_offer']); exit; }

    // El que responde no puede ser el mismo que ofreció
    $responderColor = null;
    if ($game['white_id'] === $d['user_id']) $responderColor = 'white';
    elseif ($game['black_id'] === $d['user_id']) $responderColor = 'black';
    if ($responderColor === $game['draw_offer']) {
        $pdo->rollBack(); echo json_encode(['ok'=>false,'error'=>'cannot_respond_own_offer']); exit;
    }

    if ($action === 'accept') {
        $pdo->prepare("
            UPDATE ajedrezia_games
            SET status = 'draw', result_reason = 'draw_agreed', ended_at = NOW(),
                draw_offer = '', draw_offer_at = NULL
            WHERE id = ?
        ")->execute([(int)$d['game_id']]);
        $pdo->commit();
        echo json_encode(['ok' => true, 'result' => 'draw']);
    } else {
        $pdo->prepare("UPDATE ajedrezia_games SET draw_offer = '', draw_offer_at = NULL WHERE id = ?")
            ->execute([(int)$d['game_id']]);
        $pdo->commit();
        echo json_encode(['ok' => true, 'result' => 'rejected']);
    }
} catch (PDOException $e) {
    if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
