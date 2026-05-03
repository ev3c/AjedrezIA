<?php
header('Content-Type: application/json; charset=utf-8');

$allowedOrigins = [
    'https://www.ajedrezia.com',
    'https://ajedrezia.com',
    'http://www.ajedrezia.com',
    'http://ajedrezia.com',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Access-Control-Allow-Origin: ' . (in_array($origin, $allowedOrigins, true) ? $origin : 'https://www.ajedrezia.com'));
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method not allowed']); exit; }

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data || empty($data['id']) || empty($data['email'])) {
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Missing data']); exit;
}

// ── Conexión BD ───────────────────────────────────────────────────────
try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=u375553826_lichess_puzzle;charset=utf8mb4',
        'u375553826_root',
        'Ev3c.1993',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500); echo json_encode(['ok'=>false,'error'=>'DB connection failed']); exit;
}

// ── Crear tablas si no existen ────────────────────────────────────────
$pdo->exec("
    CREATE TABLE IF NOT EXISTS ajedrezia_users (
        id           VARCHAR(128)  NOT NULL PRIMARY KEY,
        provider     VARCHAR(20)   NOT NULL,
        email        VARCHAR(255)  NOT NULL,
        name         VARCHAR(255)  DEFAULT '',
        first_login  DATETIME      NOT NULL,
        last_login   DATETIME      NOT NULL,
        last_seen    DATETIME      NULL,
        login_count  INT UNSIGNED  DEFAULT 1,
        elo          SMALLINT      DEFAULT 1200,
        last_ip      VARCHAR(45)   DEFAULT '',
        INDEX idx_email    (email),
        INDEX idx_provider (provider),
        INDEX idx_last_seen (last_seen)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
");

// Añadir columnas nuevas si la tabla ya existía sin ellas
foreach (['ALTER TABLE ajedrezia_users ADD COLUMN last_seen DATETIME NULL',
          'ALTER TABLE ajedrezia_users ADD COLUMN elo SMALLINT DEFAULT 1200',
          'ALTER TABLE ajedrezia_users ADD INDEX idx_last_seen (last_seen)'] as $alter) {
    try { $pdo->exec($alter); } catch (PDOException $e) { /* columna/índice ya existe */ }
}

$pdo->exec("
    CREATE TABLE IF NOT EXISTS ajedrezia_login_history (
        id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id    VARCHAR(128) NOT NULL,
        email      VARCHAR(255) NOT NULL,
        provider   VARCHAR(20)  NOT NULL,
        login_at   DATETIME     NOT NULL,
        ip         VARCHAR(45)  DEFAULT '',
        INDEX idx_user    (user_id),
        INDEX idx_time    (login_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
");

// ── Datos del usuario ─────────────────────────────────────────────────
$uid      = substr(trim($data['id']       ?? ''), 0, 128);
$provider = substr(trim($data['provider'] ?? ''), 0, 20);
$email    = substr(filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL), 0, 255);
$name     = substr(trim($data['name']     ?? ''), 0, 255);
$now      = date('Y-m-d H:i:s');
$ip       = substr($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '', 0, 45);

// ── Comprobar si el usuario ya existe ─────────────────────────────────
$check = $pdo->prepare('SELECT login_count FROM ajedrezia_users WHERE id = ?');
$check->execute([$uid]);
$existing = $check->fetch(PDO::FETCH_ASSOC);
$is_new   = ($existing === false);

// ── Upsert usuario ────────────────────────────────────────────────────
$pdo->prepare("
    INSERT INTO ajedrezia_users (id, provider, email, name, first_login, last_login, login_count, last_ip)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    ON DUPLICATE KEY UPDATE
        last_login  = VALUES(last_login),
        login_count = login_count + 1,
        last_ip     = VALUES(last_ip),
        name        = VALUES(name)
")->execute([$uid, $provider, $email, $name, $now, $now, $ip]);

// ── Registrar en historial ────────────────────────────────────────────
$pdo->prepare("
    INSERT INTO ajedrezia_login_history (user_id, email, provider, login_at, ip)
    VALUES (?, ?, ?, ?, ?)
")->execute([$uid, $email, $provider, $now, $ip]);

echo json_encode([
    'ok'     => true,
    'is_new' => $is_new,
]);
