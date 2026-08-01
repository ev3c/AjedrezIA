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
$isGuest = ($data['provider'] ?? '') === 'guest';
if (!$data || (empty($data['email']) && !$isGuest && empty($data['id']))) {
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Missing data']); exit;
}

// ── Configuración SMTP Hostinger ──────────────────────────────────────
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465);                      // SSL
define('SMTP_USER', 'info@ajedrezia.com');
define('SMTP_PASS', 'Hostinguer.1993');
define('SMTP_FROM', 'info@ajedrezia.com');
define('SMTP_NAME', 'AjedrezIA');
define('NOTIFY_TO', 'ajedrezia@gmail.com');

// ── Datos del usuario ─────────────────────────────────────────────────
$typeRaw  = trim($data['type'] ?? 'reconnect');
$typeMap  = [
    'new'       => 'new',
    'nuevo'     => 'new',
    'reconnect' => 'reconnect',
    'login'     => 'reconnect',
    'open'      => 'open',
    'logout'    => 'logout',
];
$type     = $typeMap[$typeRaw] ?? 'reconnect';
$email    = filter_var(trim($data['email']    ?? ''), FILTER_SANITIZE_EMAIL);
$name     = htmlspecialchars(trim($data['name']     ?? ''), ENT_QUOTES, 'UTF-8');
$provider = htmlspecialchars(trim($data['provider'] ?? ''), ENT_QUOTES, 'UTF-8');
$uid      = htmlspecialchars(trim($data['id']       ?? ''), ENT_QUOTES, 'UTF-8');
$originType   = htmlspecialchars(trim($data['origin_type']   ?? ''), ENT_QUOTES, 'UTF-8');
$originDetail = htmlspecialchars(trim($data['origin_detail'] ?? ''), ENT_QUOTES, 'UTF-8');
$originUrl    = htmlspecialchars(trim($data['origin_url']    ?? ''), ENT_QUOTES, 'UTF-8');
$ts       = date('d/m/Y H:i:s');
$ip       = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'desconocida';

$messages = [
    'new' => [
        'subject' => 'Nueva conexión en AjedrezIA',
        'intro'   => 'Se ha conectado un NUEVO usuario en AjedrezIA.',
    ],
    'reconnect' => [
        'subject' => 'Reconexión en AjedrezIA',
        'intro'   => 'Un usuario registrado se ha vuelto a conectar en AjedrezIA.',
    ],
    'open' => [
        'subject' => 'Abrir AjedrezIA',
        'intro'   => 'Un usuario con una sesión ya registrada ha vuelto a abrir AjedrezIA.',
    ],
    'logout' => [
        'subject' => 'Sesión cerrada en AjedrezIA',
        'intro'   => 'Un usuario ha cerrado sesión en AjedrezIA.',
    ],
];
$subjectTxt = $messages[$type]['subject'];
$introTxt   = $messages[$type]['intro'];

$body  = $introTxt . "\n\n";
$body .= "────────────────────────────────\n";
$body .= "E-mail registrado : {$email}\n";
$body .= "Nombre completo   : {$name}\n";
$body .= "Proveedor OAuth   : " . strtoupper($provider) . "\n";
$body .= "ID de usuario     : {$uid}\n";
$body .= "Fecha y hora      : {$ts}\n";
$body .= "IP de origen      : {$ip}\n";
if ($type === 'open') {
    $body .= "Tipo de enlace    : " . ($originType !== '' ? $originType : 'www.ajedrezia.com') . "\n";
    if ($originDetail !== '') {
        $body .= "Detalle enlace    : {$originDetail}\n";
    }
    if ($originUrl !== '') {
        $body .= "URL de origen     : {$originUrl}\n";
    }
}
$body .= "────────────────────────────────\n\n";
$body .= "AjedrezIA — https://www.ajedrezia.com/\n";

// ── Envío SMTP ────────────────────────────────────────────────────────
function smtp_send(string $subject, string $body): bool {
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
    $s('RCPT TO:<'  . NOTIFY_TO  . '>'); $r();
    $s('DATA'); $r();

    $msg  = 'From: ' . SMTP_NAME . ' <' . SMTP_FROM . ">\r\n";
    $msg .= 'To: ' . NOTIFY_TO . "\r\n";
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

$sent = smtp_send($subjectTxt, $body);
echo json_encode(['ok' => $sent, 'method' => 'smtp']);
