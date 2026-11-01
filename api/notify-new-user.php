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
$typeRaw  = trim($data['type'] ?? 'reconnect');
$isGuest  = ($data['provider'] ?? '') === 'guest';
$isAccess = in_array($typeRaw, ['access', 'acceso', 'open', 'web'], true);
if (empty($data['email']) && !$isGuest && empty($data['id']) && !$isAccess) {
    http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Missing data']); exit;
}

// ── Configuración SMTP Hostinger ──────────────────────────────────────
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465);                      // SSL
define('SMTP_USER', 'info@ajedrezia.com');
define('SMTP_PASS', 'Hostinguer.1993');
define('SMTP_FROM', 'info@ajedrezia.com');
define('SMTP_NAME', 'AjedrezIA');
define('NOTIFY_TO', 'info@ajedrezia.com');

function notify_mail_to(): string {
    $to = strtolower(trim(NOTIFY_TO));
    $dead = ['ajedrezia@gmail.com', 'ajedrezia.com@gmail.com', 'ev3c.android@gmail.com'];
    if ($to === '' || in_array($to, $dead, true)) {
        return 'info@ajedrezia.com';
    }
    return NOTIFY_TO;
}

// ── Datos del usuario ─────────────────────────────────────────────────
$typeMap  = [
    'new'       => 'new',
    'nuevo'     => 'new',
    'reconnect' => 'reconnect',
    'login'     => 'reconnect',
    'open'      => 'access',
    'access'    => 'access',
    'acceso'    => 'access',
    'web'       => 'access',
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
$osRaw        = ajz_client_os((string) ($data['os'] ?? ''), (string) ($data['ua'] ?? ''));
$os           = htmlspecialchars($osRaw, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
if ($os === '') $os = 'desconocido';
$screenRaw    = ajz_client_screen((string) ($data['screen'] ?? ''));
$screen       = htmlspecialchars($screenRaw, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
if ($screen === '') $screen = 'desconocida';
$ts       = date('d/m/Y H:i:s');
$ip       = notify_client_ip();
$country  = notify_country_from_ip($ip);

$messages = [
    'new' => [
        'subject' => 'Nueva conexión en AjedrezIA',
        'intro'   => 'Se ha conectado un NUEVO usuario en AjedrezIA.',
    ],
    'reconnect' => [
        'subject' => 'Reconexión en AjedrezIA',
        'intro'   => 'Un usuario registrado se ha vuelto a conectar en AjedrezIA.',
    ],
    'access' => [
        'subject' => 'Acceso a la web',
        'intro'   => 'Alguien ha abierto AjedrezIA.',
    ],
    'logout' => [
        'subject' => 'Sesión cerrada en AjedrezIA',
        'intro'   => 'Un usuario ha cerrado sesión en AjedrezIA.',
    ],
];
$subjectTxt = $messages[$type]['subject'];
$introTxt   = $messages[$type]['intro'];

$hasSession = ($email !== '' || $uid !== '' || $provider !== '');
$body  = $introTxt . "\n\n";
$body .= "────────────────────────────────\n";
$body .= "Sesión            : " . ($hasSession ? 'iniciada' : 'no iniciada') . "\n";
$body .= "E-mail registrado : " . ($email !== '' ? $email : '—') . "\n";
$body .= "Nombre completo   : " . ($name !== '' ? $name : '—') . "\n";
$body .= "Proveedor OAuth   : " . ($provider !== '' ? strtoupper($provider) : '—') . "\n";
$body .= "ID de usuario     : " . ($uid !== '' ? $uid : '—') . "\n";
$body .= "Fecha y hora      : {$ts}\n";
$body .= "IP de origen      : {$ip}\n";
$body .= "País de origen    : {$country}\n";
$body .= "Sistema operativo : {$os}\n";
$body .= "Pantalla          : {$screen}\n";
if ($type === 'access') {
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

function notify_client_ip(): string {
    $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($xff !== '') {
        foreach (array_map('trim', explode(',', $xff)) as $candidate) {
            if (filter_var($candidate, FILTER_VALIDATE_IP)) return $candidate;
        }
    }
    $remote = $_SERVER['REMOTE_ADDR'] ?? '';
    return filter_var($remote, FILTER_VALIDATE_IP) ? $remote : 'desconocida';
}

function notify_country_label(string $code, string $fallback = ''): string {
    $code = strtoupper(trim($code));
    if ($code === '' || $code === 'XX' || $code === 'T1') {
        return $fallback !== '' ? $fallback : '';
    }
    $name = $fallback;
    if (class_exists('Locale')) {
        $disp = Locale::getDisplayRegion('und_' . $code, 'es');
        if (is_string($disp) && $disp !== '' && strtoupper($disp) !== $code) {
            $name = $disp;
        }
    }
    if ($name === '') $name = $code;
    return $name . ' (' . $code . ')';
}

function notify_country_from_ip(string $ip): string {
    $cf = strtoupper(trim($_SERVER['HTTP_CF_IPCOUNTRY'] ?? ''));
    $fromCf = notify_country_label($cf);
    if ($fromCf !== '') return $fromCf;

    if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
        return 'local / desconocido';
    }

    $ctx = stream_context_create([
        'http' => ['timeout' => 2, 'ignore_errors' => true],
        'ssl'  => ['verify_peer' => true],
    ]);
    $json = @file_get_contents('https://get.geojs.io/v1/ip/geo/' . rawurlencode($ip) . '.json', false, $ctx);
    if (!is_string($json) || $json === '') return 'desconocido';
    $data = json_decode($json, true);
    if (!is_array($data)) return 'desconocido';
    $label = notify_country_label(
        (string) ($data['country'] ?? ''),
        (string) ($data['country_name'] ?? $data['name'] ?? '')
    );
    return $label !== '' ? $label : 'desconocido';
}

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
    $s('RCPT TO:<'  . notify_mail_to() . '>'); $r();
    $s('DATA'); $r();

    $msg  = 'From: ' . SMTP_NAME . ' <' . SMTP_FROM . ">\r\n";
    $msg .= 'To: ' . notify_mail_to() . "\r\n";
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
