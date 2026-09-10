<?php
/*
 * Sirve una tarjeta PNG guardada por share-card-save.php.
 * Facebook / WhatsApp leen esta URL como og:image.
 */
$id = isset($_GET['id']) ? preg_replace('/[^a-f0-9]/', '', strtolower((string)$_GET['id'])) : '';
$file = __DIR__ . '/share-cache/' . $id . '.png';
if (strlen($id) !== 24 || !is_file($file)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Not found';
    exit;
}
header('Content-Type: image/png');
header('Cache-Control: public, max-age=1209600');
header('Content-Length: ' . filesize($file));
readfile($file);
