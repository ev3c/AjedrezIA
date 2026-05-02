<?php
require __DIR__ . '/_db.php';
ai_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }
$d = json_decode(file_get_contents('php://input'), true);
if (empty($d['invite_id']) || empty($d['action'])) { http_response_code(400); echo json_encode(['ok'=>false]); exit; }

$action = ($d['action'] === 'accept') ? 'accepted' : 'rejected';

try {
    $pdo = ai_pdo();
    ai_ensure_invites_table($pdo);
    ai_ensure_games_table($pdo);

    // Cargar la invitación
    $stmt = $pdo->prepare("SELECT * FROM ajedrezia_invites WHERE id = ? AND status = 'pending'");
    $stmt->execute([(int)$d['invite_id']]);
    $invite = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$invite) { echo json_encode(['ok'=>true, 'status'=>'not_pending']); exit; }

    $game_id = null;

    if ($action === 'accepted') {
        // Decidir colores
        $fc = $invite['from_color'];
        if ($fc === 'random') $fc = (mt_rand(0,1) === 0) ? 'white' : 'black';
        $white_id   = ($fc === 'white') ? $invite['from_id']   : $invite['to_id'];
        $black_id   = ($fc === 'white') ? $invite['to_id']     : $invite['from_id'];
        $white_nick = ($fc === 'white') ? $invite['from_nick'] : (substr($d['accepter_nick'] ?? '', 0, 64));
        $black_nick = ($fc === 'white') ? (substr($d['accepter_nick'] ?? '', 0, 64)) : $invite['from_nick'];
        $white_elo  = ($fc === 'white') ? (int)$invite['from_elo'] : (int)($d['accepter_elo'] ?? 1200);
        $black_elo  = ($fc === 'white') ? (int)($d['accepter_elo'] ?? 1200) : (int)$invite['from_elo'];

        $tc        = $invite['time_control'];
        $parts     = explode('+', $tc);
        $minutes   = (int)($parts[0] ?? 5);
        $increment = (int)($parts[1] ?? 0);

        // Tiempo inicial en milisegundos para cada jugador.
        // last_move_at = NULL hasta que se haga el primer movimiento (ningún reloj corre).
        $initialMs = $minutes * 60 * 1000;
        $ins = $pdo->prepare("
            INSERT INTO ajedrezia_games
                (white_id, black_id, white_nick, black_nick, white_elo, black_elo,
                 time_per_player, increment, time_control, current_turn, status, created_at,
                 white_time_ms, black_time_ms, last_move_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'white', 'active', NOW(), ?, ?, NULL)
        ");
        $ins->execute([$white_id, $black_id, $white_nick, $black_nick, $white_elo, $black_elo,
                       $minutes, $increment, $tc, $initialMs, $initialMs]);
        $game_id = (int)$pdo->lastInsertId();
    }

    $upd = $pdo->prepare("
        UPDATE ajedrezia_invites
        SET status = ?, responded_at = NOW(), game_id = ?
        WHERE id = ? AND status = 'pending'
    ");
    $upd->execute([$action, $game_id, (int)$d['invite_id']]);

    echo json_encode(['ok' => true, 'status' => $action, 'game_id' => $game_id]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'DB error']);
}
