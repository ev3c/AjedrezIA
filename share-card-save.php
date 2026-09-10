<?php
/*
 * Guarda la PNG del modal de compartir (dibujada en el navegador, en el
 * idioma de la interfaz) para que Facebook pueda usarla como og:image.
 *
 * POST multipart: campo "image" (PNG, máx. 2 MB).
 * Respuesta JSON: { "id": "hex24" }
 */

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method']);
    exit;
}

$dir = __DIR__ . '/share-cache';
if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
    http_response_code(500);
    echo json_encode(['error' => 'mkdir']);
    exit;
}

$file = isset($_FILES['image']) ? $_FILES['image'] : null;
if (!$file || !isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
    http_response_code(400);
    echo json_encode(['error' => 'file']);
    exit;
}
if (!empty($file['error']) || ($file['size'] > 2 * 1024 * 1024)) {
    http_response_code(400);
    echo json_encode(['error' => 'size']);
    exit;
}

$raw = file_get_contents($file['tmp_name']);
if ($raw === false || strlen($raw) < 24 || substr($raw, 0, 8) !== "\x89PNG\r\n\x1a\n") {
    http_response_code(400);
    echo json_encode(['error' => 'png']);
    exit;
}

$info = @getimagesizefromstring($raw);
if (!$info || $info[0] < 200 || $info[1] < 200 || $info[0] > 2400 || $info[1] > 2400) {
    http_response_code(400);
    echo json_encode(['error' => 'dims']);
    exit;
}

try {
    $id = bin2hex(random_bytes(12));
} catch (Exception $e) {
    $id = bin2hex(openssl_random_pseudo_bytes(12));
}

$dest = $dir . '/' . $id . '.png';
if (@file_put_contents($dest, $raw) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'write']);
    exit;
}

$now = time();
$maxAge = 14 * 24 * 3600;
$kept = 0;
$files = glob($dir . '/*.png') ?: [];
usort($files, function ($a, $b) { return filemtime($b) - filemtime($a); });
foreach ($files as $old) {
    $kept++;
    if ($kept > 250 || ($now - filemtime($old)) > $maxAge) {
        if (basename($old) !== $id . '.png') @unlink($old);
    }
}

echo json_encode(['id' => $id]);
