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
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://www.ajedrezia.com');
}
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method not allowed']); exit; }

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) $data = [];

$errorText   = trim($data['error']  ?? '');
$improveText = trim($data['mejora'] ?? '');
$pageUrl     = trim($data['url']    ?? '');
$os = ajz_client_os((string) ($data['os'] ?? ''), (string) ($data['ua'] ?? ''));
$os = htmlspecialchars($os, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
if ($os === '') $os = 'desconocido';
$screen = ajz_client_screen((string) ($data['screen'] ?? ''));
$screen = htmlspecialchars($screen, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
if ($screen === '') $screen = 'desconocida';

if ($errorText === '' && $improveText === '') {
    http_response_code(400);
    echo json_encode(['ok'=>false,'error'=>'Missing data']);
    exit;
}

// ── Configuración SMTP Hostinger ──────────────────────────────────────
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465);                      // SSL
define('SMTP_USER', 'info@ajedrezia.com');
define('SMTP_PASS', 'Hostinguer.1993');
define('SMTP_FROM', 'info@ajedrezia.com');
define('SMTP_NAME', 'AjedrezIA');
define('FEEDBACK_TO', 'info@ajedrezia.com');

function feedback_mail_to(): string {
    $to = strtolower(trim(FEEDBACK_TO));
    $dead = ['ajedrezia@gmail.com', 'ajedrezia.com@gmail.com', 'ev3c.android@gmail.com'];
    if ($to === '' || in_array($to, $dead, true)) {
        return 'info@ajedrezia.com';
    }
    return FEEDBACK_TO;
}

$ts = date('d/m/Y H:i:s');
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'desconocida';

$body  = "Se ha recibido un nuevo informe de error/mejora desde AjedrezIA.\n\n";
$body .= "────────────────────────────────\n";
$body .= "error:  " . ($errorText   !== '' ? $errorText   : '(sin especificar)') . "\n\n";
$body .= "mejora: " . ($improveText !== '' ? $improveText : '(sin especificar)') . "\n";
$body .= "────────────────────────────────\n";
$body .= "Página     : {$pageUrl}\n";
$body .= "Fecha y hora : {$ts}\n";
$body .= "IP de origen : {$ip}\n";
$body .= "Sistema operativo : {$os}\n";
$body .= "Pantalla          : {$screen}\n";
$body .= "────────────────────────────────\n\n";
$body .= "AjedrezIA — https://www.ajedrezia.com/\n";

// ── Envío SMTP ────────────────────────────────────────────────────────
function smtp_send_feedback(string $subject, string $body): bool {
    $fp = @fsockopen('ssl://' . SMTP_HOST, SMTP_PORT, $errno, $errstr, 15);
    if (!$fp) return false;

    $r = fn() => fgets($fp, 512);
    $s = fn(string $cmd) => fputs($fp, $cmd . "\r\n");

    $r();                                        // 220 greeting
    $s('EHLO ajedrezia.com');    while (($l = $r()) && substr($l, 3, 1) === '-');
    $s('AUTH LOGIN');             $r();
    $s(base64_encode(SMTP_USER)); $r();
    $s(base64_encode(SMTP_PASS)); $r();
    $s('MAIL FROM:<' . SMTP_FROM . '>'); $r();
    $s('RCPT TO:<'  . feedback_mail_to() . '>'); $r();
    $s('DATA'); $r();

    $msg  = 'From: ' . SMTP_NAME . ' <' . SMTP_FROM . ">\r\n";
    $msg .= 'To: ' . feedback_mail_to() . "\r\n";
    $msg .= 'Subject: =?UTF-8?B?' . base64_encode($subject) . "?=\r\n";
    $msg .= "MIME-Version: 1.0\r\n";
    $msg .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $msg .= "\r\n" . $body . "\r\n.\r\n";

    fputs($fp, $msg);
    $r();           // 250 OK
    $s('QUIT'); $r();
    fclose($fp);
    return true;
}

$sent = smtp_send_feedback('AjedrezIA - Informe de error/mejora', $body);
echo json_encode(['ok' => $sent, 'method' => 'smtp']);

function ajz_os_from_ua(string $ua, string $platformHint = ''): string {
    $hint = trim($platformHint, "\"' \t");
    if (preg_match('/Windows NT 10/i', $ua)) return 'Windows 10/11';
    if (preg_match('/Windows NT 6\.3/i', $ua)) return 'Windows 8.1';
    if (preg_match('/Windows NT 6\.2/i', $ua)) return 'Windows 8';
    if (preg_match('/Windows NT 6\.1/i', $ua)) return 'Windows 7';
    if (preg_match('/Windows/i', $ua) || strcasecmp($hint, 'Windows') === 0) return 'Windows';
    if (preg_match('/Android ([\d.]+)/i', $ua, $m)) return 'Android ' . $m[1];
    if (preg_match('/Android/i', $ua) || strcasecmp($hint, 'Android') === 0) return 'Android';
    if (preg_match('/iPad/i', $ua) || strcasecmp($hint, 'iPadOS') === 0) {
        if (preg_match('/OS (\d+)[._](\d+)/', $ua, $m)) return 'iPadOS ' . $m[1] . '.' . $m[2];
        return 'iPadOS';
    }
    if (preg_match('/iPhone|iPod/i', $ua) || strcasecmp($hint, 'iOS') === 0) {
        if (preg_match('/OS (\d+)[._](\d+)/', $ua, $m)) return 'iOS ' . $m[1] . '.' . $m[2];
        return 'iOS';
    }
    if (preg_match('/CrOS/i', $ua) || strcasecmp($hint, 'Chrome OS') === 0) return 'Chrome OS';
    if (preg_match('/Mac OS X (\d+)[._](\d+)/', $ua, $m)) return 'macOS ' . $m[1] . '.' . $m[2];
    if (preg_match('/Mac OS X|Macintosh/i', $ua) || strcasecmp($hint, 'macOS') === 0) return 'macOS';
    if (preg_match('/Linux/i', $ua) || strcasecmp($hint, 'Linux') === 0) return 'Linux';
    if ($hint !== '') return $hint;
    return '';
}

function ajz_client_screen(string $posted): string {
    $posted = trim((string) (preg_replace('/[\x00-\x1F\x7F]/u', '', $posted) ?? ''));
    $posted = preg_replace('/[^\d×xX\s\(\)\.,@]/u', '', $posted) ?? '';
    $posted = trim(preg_replace('/\s+/', ' ', $posted) ?? '');
    if (function_exists('mb_substr')) {
        $posted = mb_substr($posted, 0, 80);
    } else {
        $posted = substr($posted, 0, 80);
    }
    $blank = ($posted === '' || $posted === '-' || $posted === '--' || $posted === '—');
    return $blank ? '' : $posted;
}

function ajz_client_os(string $posted, string $postedUa = ''): string {
    $posted = trim((string) (preg_replace('/[\x00-\x1F\x7F]/u', '', $posted) ?? ''));
    if (function_exists('mb_substr')) {
        $posted = mb_substr($posted, 0, 80);
    } else {
        $posted = substr($posted, 0, 80);
    }
    $blank = ($posted === '' || $posted === '-' || $posted === '--' || $posted === '—');
    if (!$blank) return $posted;

    $ua = trim($postedUa);
    if ($ua === '') {
        $ua = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
    }
    $hint = (string) ($_SERVER['HTTP_SEC_CH_UA_PLATFORM'] ?? '');
    $label = ajz_os_from_ua($ua, $hint);
    if ($label === '') $label = 'desconocido';
    return $label;
}
