<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// ── Configuración BD ─────────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_USER', 'u375553826_root');
define('DB_PASS', 'Ev3c.1993');
define('DB_NAME', 'u375553826_lichess_puzzle');

// ── Mapa temas app → temas Lichess ───────────────────────────────────
const THEME_MAP = [
    'mate1'       => ['mateIn1'],
    'mate2'       => ['mateIn2'],
    'mate3'       => ['mateIn3'],
    'mate4'       => ['mateIn4'],
    'mate5'       => ['mateIn5'],
    'fork'        => ['fork'],
    'pin'         => ['pin'],
    'sacrifice'   => ['sacrifice'],
    'endgame'     => ['endgame'],
    'attack'      => ['attack', 'crushing'],
    'defense'     => ['defensiveMove', 'zugzwang'],
    'center'      => ['advantage'],
    'capture'     => ['capturingDefender', 'hangingPiece'],
    'development' => ['opening'],
    'tactic'      => ['backRankMate', 'discoveredAttack', 'doubleCheck', 'skewer', 'trappedPiece'],
    'other'       => ['clearance', 'interference', 'attraction', 'deflection', 'quietMove',
                      'exposedKing', 'advancedPawn', 'rookEndgame', 'pawnEndgame', 'operaMate',
                      'kingsideAttack', 'queensideAttack', 'underPromotion', 'promotion',
                      'coercion', 'equality', 'master'],
];

// ── Dificultad estimada por número de jugadas en la solución ─────────
function solutionToDifficulty(array $moves): int {
    $n = count($moves);
    if ($n <= 1) return 1;
    if ($n <= 3) return 2;
    if ($n <= 5) return 3;
    return 4;
}

// ── Parámetros ───────────────────────────────────────────────────────
$theme  = $_GET['theme']  ?? 'all';
$limit  = min((int)($_GET['limit']  ?? 10), 50);
$offset = (int)($_GET['offset'] ?? 0);

// ── Conexión ─────────────────────────────────────────────────────────
try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}

// ── Construcción de consulta ──────────────────────────────────────────
$where  = [];
$params = [];

if ($theme !== 'all' && isset(THEME_MAP[$theme])) {
    $like = [];
    foreach (THEME_MAP[$theme] as $i => $t) {
        // Whole-word match: añadimos espacios al campo y al patrón para evitar
        // que 'attack' coincida con 'kingsideAttack' o 'discoveredAttack'
        $like[]           = "CONCAT(' ', themes, ' ') LIKE :theme$i";
        $params[":theme$i"] = "% $t %";
    }
    $where[] = '(' . implode(' OR ', $like) . ')';
}

$whereStr = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$sql = "SELECT puzzle_id, fen, moves, themes, opening_tags
        FROM lichess_puzzles
        $whereStr
        ORDER BY RAND()
        LIMIT $limit OFFSET $offset";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
    exit;
}

// ── Transformar al formato app ────────────────────────────────────────
$puzzles = [];
foreach ($rows as $row) {
    $allMoves = array_values(array_filter(explode(' ', trim($row['moves']))));
    // En Lichess el primer movimiento es el pre-move de la IA, los siguientes son la solución
    $preMoves = array_slice($allMoves, 0, 1);
    $solution = array_slice($allMoves, 1);

    if (empty($solution)) continue;

    $diff  = solutionToDifficulty($solution);
    $tags  = trim($row['opening_tags'] ?? '');
    $title = $tags ? ucwords(str_replace('_', ' ', explode(' ', $tags)[0])) : ucfirst($theme === 'all' ? 'Táctica' : $theme);

    $puzzles[] = [
        'id'         => $row['puzzle_id'],
        'fen'        => $row['fen'],
        'preMoves'   => $preMoves,
        'solution'   => $solution,
        'theme'      => $theme === 'all' ? 'tactic' : $theme,
        'difficulty' => $diff,
        'title'      => $title,
    ];
}

echo json_encode(['puzzles' => $puzzles, 'total' => count($puzzles)]);
