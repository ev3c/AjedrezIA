/*
 * Genera sprites PNG transparentes de las piezas cburnett para board-image.php
 * (PHP GD no sabe rasterizar SVG, así que necesita las piezas ya en PNG).
 *
 * Salida: share-img/pieces/{wK,wQ,wR,wB,wN,wP,bK,bQ,bR,bB,bN,bP}.png  (a SIZE px)
 *
 * Requisito (una sola vez): @resvg/resvg-js instalado fuera de Google Drive:
 *   mkdir %TEMP%\ajedrez-img && cd %TEMP%\ajedrez-img
 *   npm init -y && npm install @resvg/resvg-js
 *
 * Uso:  node tools/build-piece-sprites.js   (desde la raíz del proyecto)
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const RESVG_DIR = path.join(os.tmpdir(), 'ajedrez-img', 'node_modules', '@resvg', 'resvg-js');
const { Resvg } = require(RESVG_DIR);

const SIZE = 180; // resolución del sprite (el tablero usa ~135px/casilla en la tarjeta)
const SRC = path.join(ROOT, 'pieces', 'staunty');
const OUT = path.join(ROOT, 'share-img', 'pieces');
fs.mkdirSync(OUT, { recursive: true });

const CODES = ['wK','wQ','wR','wB','wN','wP','bK','bQ','bR','bB','bN','bP'];

let ok = 0;
for (const code of CODES) {
    const srcFile = path.join(SRC, code + '.svg');
    let svg = fs.readFileSync(srcFile, 'utf8');
    // Forzar tamaño y viewBox conocidos (cburnett usa viewBox 0 0 45 45).
    svg = svg.replace(/<svg([^>]*)>/, (m, attrs) => {
        let a = attrs
            .replace(/\swidth="[^"]*"/i, '')
            .replace(/\sheight="[^"]*"/i, '');
        if (!/viewBox=/i.test(a)) a += ' viewBox="0 0 45 45"';
        return `<svg${a} width="${SIZE}" height="${SIZE}">`;
    });
    const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: SIZE },
        font: { loadSystemFonts: false }
        // sin background -> PNG con transparencia
    });
    fs.writeFileSync(path.join(OUT, code + '.png'), resvg.render().asPng());
    ok++;
    console.log('OK', code);
}
console.log(`\n${ok} sprites en share-img/pieces/`);
