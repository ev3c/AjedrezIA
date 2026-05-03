<?php
require __DIR__ . '/_db.php';
ai_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }
$d = json_decode(file_get_contents('php://input'), true);
if (empty($d['game_id']) || empty($d['user_id'])) { http_response_code(400); echo json_encode(['ok'=>false]); exit; }

try {
    $pdo = ai_pdo();
    ai_ensure_games_table($pdo);

    $stmt = $pdo->prepare("SELECT * FROM ajedrezia_games WHERE id = ?");
    $stmt->execute([(int)$d['game_id']]);
    $game = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$game) { http_response_code(404); echo json_encode(['ok'=>false]); exit; }
    if ($game['status'] !== 'active') { echo json_encode(['ok'=>false,'error'=>'game_over']); exit; }

    // Determinar el color del que ofrece
    $offerColor = null;
    if ($game['white_id'] === $d['user_id']) $offerColor = 'white';
    elseif ($game['black_id'] === $d['user_id']) $offerColor = 'black';
    if (!$offerColor) { echo json_encode(['ok'=>false,'error'=>'not_a_player']); exit; }

    // No permitir doble oferta del mismo jugador
    if ($game['draw_offer'] === $offerColor) { echo json_encode(['ok'=>true,'already'=>true]); exit; }

    $pdo->prepare("UPDATE ajedrezia_games SET draw_offer = ?, draw_offer_at = NOW() WHERE id = ?")
        ->execute([$offerColor, (int)$d['game_id']]);

    echo json_encode(['ok' => true, 'draw_offer' => $offerColor]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
