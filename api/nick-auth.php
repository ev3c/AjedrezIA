<?php
// nick-auth.php — Registro / login de usuarios con nickname + contraseña.
// POST { nick, password, user_id }
// Respuestas:
//   { ok:true,  is_new:bool, user_id, name }
//   { ok:false, error:'wrong_password'|'invalid_nick'|'missing_data'|... }

require_once __DIR__ . '/_db.php';
ai_cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

$nick    = trim($data['nick']     ?? '');
$pwd     = $data['password']      ?? '';   // puede ser cadena vacía
$user_id = trim($data['user_id']  ?? '');

if (!$nick || !$user_id) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'missing_data']);
    exit;
}

if (!preg_match('/^[A-Za-z0-9_.\\-]{3,20}$/', $nick)) {
    echo json_encode(['ok' => false, 'error' => 'invalid_nick']);
    exit;
}

try {
    $pdo = ai_pdo();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'db_error']);
    exit;
}

// Asegurar columna password_hash en ajedrezia_users
try {
    $pdo->exec("ALTER TABLE ajedrezia_users ADD COLUMN password_hash VARCHAR(255) DEFAULT NULL");
} catch (PDOException $e) { /* ya existe */ }

$email = $nick . '@nickname.local';

// Buscar si ya existe un usuario con ese nick (email)
$stmt = $pdo->prepare(
    "SELECT id, password_hash FROM ajedrezia_users WHERE email = ? AND provider = 'nickname' LIMIT 1"
);
$stmt->execute([$email]);
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existing === false) {
    // ── Usuario nuevo ────────────────────────────────────────────────────────
    $hash = ($pwd !== '') ? password_hash($pwd, PASSWORD_DEFAULT) : null;
    $now  = date('Y-m-d H:i:s');
    $ip   = substr($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '', 0, 45);

    $pdo->prepare("
        INSERT INTO ajedrezia_users
            (id, provider, email, name, first_login, last_login, login_count, last_ip, password_hash)
        VALUES (?, 'nickname', ?, ?, ?, ?, 1, ?, ?)
        ON DUPLICATE KEY UPDATE
            last_login    = VALUES(last_login),
            login_count   = login_count + 1,
            last_ip       = VALUES(last_ip),
            name          = VALUES(name),
            password_hash = COALESCE(password_hash, VALUES(password_hash))
    ")->execute([$user_id, $email, $nick, $now, $now, $ip, $hash]);

    echo json_encode(['ok' => true, 'is_new' => true, 'user_id' => $user_id, 'name' => $nick]);
    exit;
}

// ── Usuario existente ────────────────────────────────────────────────────────
$storedHash = $existing['password_hash'];

if ($storedHash === null || $storedHash === '') {
    // No tenía contraseña: si ahora envía una, la guardamos; si no, dejamos vacía.
    if ($pwd !== '') {
        $newHash = password_hash($pwd, PASSWORD_DEFAULT);
        $pdo->prepare(
            "UPDATE ajedrezia_users SET password_hash = ? WHERE email = ? AND provider = 'nickname'"
        )->execute([$newHash, $email]);
    }
    echo json_encode(['ok' => true, 'is_new' => false, 'user_id' => $existing['id'], 'name' => $nick]);
    exit;
}

// Tiene contraseña: verificar
if (!password_verify($pwd, $storedHash)) {
    echo json_encode(['ok' => false, 'error' => 'wrong_password']);
    exit;
}

echo json_encode(['ok' => true, 'is_new' => false, 'user_id' => $existing['id'], 'name' => $nick]);
