<?php
// Helpers de DB compartidos para los endpoints de invitaciones / online
function ai_cors() {
    $allowedOrigins = ['https://www.ajedrezia.com', 'http://localhost:8000', 'http://127.0.0.1:8000'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    header('Access-Control-Allow-Origin: ' . (in_array($origin, $allowedOrigins, true) ? $origin : 'https://www.ajedrezia.com'));
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=utf-8');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}

function ai_pdo(): PDO {
    return new PDO(
        'mysql:host=localhost;dbname=u375553826_lichess_puzzle;charset=utf8mb4',
        'u375553826_root', 'Ev3c.1993',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
}

function ai_ensure_invites_table(PDO $pdo): void {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS ajedrezia_invites (
            id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            from_id       VARCHAR(128) NOT NULL,
            from_nick     VARCHAR(64)  NOT NULL,
            from_elo      SMALLINT     DEFAULT 1200,
            to_id         VARCHAR(128) NOT NULL,
            from_color    ENUM('white','black','random') DEFAULT 'random',
            time_control  VARCHAR(16)  DEFAULT '5+0',
            time_label    VARCHAR(64)  DEFAULT '',
            status        ENUM('pending','accepted','rejected','cancelled','expired') DEFAULT 'pending',
            created_at    DATETIME     NOT NULL,
            responded_at  DATETIME     NULL,
            game_id       INT UNSIGNED NULL,
            INDEX idx_to (to_id, status),
            INDEX idx_from (from_id, status),
            INDEX idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    // Expirar invitaciones de más de 90s
    try { $pdo->exec("UPDATE ajedrezia_invites SET status='expired' WHERE status='pending' AND created_at < DATE_SUB(NOW(), INTERVAL 90 SECOND)"); } catch (PDOException $e) {}
}

function ai_ensure_elo_log_table(PDO $pdo): void {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS ajedrezia_elo_log (
            game_id    INT UNSIGNED  NOT NULL,
            user_id    VARCHAR(128)  NOT NULL,
            delta      SMALLINT      NOT NULL,
            applied_at DATETIME      NOT NULL,
            PRIMARY KEY (game_id, user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
}

function ai_ensure_games_table(PDO $pdo): void {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS ajedrezia_games (
            id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            white_id        VARCHAR(128) NOT NULL,
            black_id        VARCHAR(128) NOT NULL,
            white_nick      VARCHAR(64)  DEFAULT '',
            black_nick      VARCHAR(64)  DEFAULT '',
            white_elo       SMALLINT     DEFAULT 1200,
            black_elo       SMALLINT     DEFAULT 1200,
            time_per_player INT UNSIGNED DEFAULT 5,
            increment       INT UNSIGNED DEFAULT 0,
            time_control    VARCHAR(16)  DEFAULT '5+0',
            moves           MEDIUMTEXT   DEFAULT '',
            current_turn    ENUM('white','black') DEFAULT 'white',
            status          ENUM('active','white_wins','black_wins','draw','aborted') DEFAULT 'active',
            result_reason   VARCHAR(32)  DEFAULT '',
            white_seen      DATETIME     NULL,
            black_seen      DATETIME     NULL,
            created_at      DATETIME     NOT NULL,
            ended_at        DATETIME     NULL,
            white_time_ms   BIGINT       DEFAULT 0,
            black_time_ms   BIGINT       DEFAULT 0,
            last_move_at    DATETIME(3)  NULL,
            INDEX idx_white (white_id, status),
            INDEX idx_black (black_id, status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    // Compat: si la tabla ya existía sin las columnas de reloj o de oferta de tablas, añadirlas
    foreach ([
        'ALTER TABLE ajedrezia_games ADD COLUMN white_time_ms BIGINT DEFAULT 0',
        'ALTER TABLE ajedrezia_games ADD COLUMN black_time_ms BIGINT DEFAULT 0',
        'ALTER TABLE ajedrezia_games ADD COLUMN last_move_at DATETIME(3) NULL',
        "ALTER TABLE ajedrezia_games ADD COLUMN draw_offer VARCHAR(8) DEFAULT ''",
        'ALTER TABLE ajedrezia_games ADD COLUMN draw_offer_at DATETIME NULL',
    ] as $alter) {
        try { $pdo->exec($alter); } catch (PDOException $e) { /* ya existe */ }
    }
}
