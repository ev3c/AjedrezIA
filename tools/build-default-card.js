/*
 * Genera share-img/default.png (tarjeta genérica de AjedrezIA 1200×630).
 *
 * Diseño:
 *   - Tablero más grande (600 px) con la posición inicial
 *   - Texto derecho:
 *       ♞ AjedrezIA  (verde)
 *       Aperturas · Problemas · Partidas maestras
 *       Juega y aprende ajedrez con IA
 *       ajedrezia.com
 *
 * Uso: node tools/build-default-card.js   (desde la raíz del proyecto)
 */
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const ROOT     = path.resolve(__dirname, '..');
const RESVG_DIR = path.join(os.tmpdir(), 'ajedrez-img', 'node_modules', '@resvg', 'resvg-js');
const { Resvg } = require(RESVG_DIR);

// ---- Geometría ------------------------------------------------------------
const W = 1200, H = 630;
const BOARD = 572;                          // ligeramente reducido para dejar margen a coords
const BX = 28, BY = (H - BOARD) / 2 - 8;  // margen izq 28px, subido 8px para margen inferior
const SQ = BOARD / 8;

// ---- Piezas ---------------------------------------------------------------
const PIECE_DIR = path.join(ROOT, 'pieces', 'staunty');
const pieceCache = {};
function pieceInner(code) {
    if (pieceCache[code]) return pieceCache[code];
    let svg = fs.readFileSync(path.join(PIECE_DIR, code + '.svg'), 'utf8');
    svg = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    return pieceCache[code] = svg;
}
const FEN_TO_CODE = {
    K:'wK',Q:'wQ',R:'wR',B:'wB',N:'wN',P:'wP',
    k:'bK',q:'bQ',r:'bR',b:'bB',n:'bN',p:'bP'
};
function fenToBoard(placement) {
    const rows = placement.split('/');
    return rows.map(row => {
        const line = [];
        for (const ch of row) {
            if (ch >= '1' && ch <= '8') for (let i = 0; i < +ch; i++) line.push(null);
            else line.push(ch);
        }
        return line;
    });
}
function escapeXml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ---- SVG ------------------------------------------------------------------
const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
const board = fenToBoard(FEN);
const LIGHT = '#eadab5', DARK = '#b07a48';

let squares = '', pieces = '', coords = '';
const CFS = Math.round(SQ * 0.22);   // ~16 px para SQ=71.5
const COORD_COLOR = '#c9c2ba';
const BOTTOM_MARGIN = H - (BY + BOARD);   // espacio bajo el tablero

for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
        const x = BX + c * SQ, y = BY + r * SQ;
        const isLight = (r + c) % 2 === 0;
        squares += `<rect x="${x}" y="${y}" width="${SQ}" height="${SQ}" fill="${isLight ? LIGHT : DARK}"/>`;
        const code = board[r][c] && FEN_TO_CODE[board[r][c]];
        if (code) {
            const ps = SQ * 0.85, po = (SQ - ps) / 2;
            pieces += `<svg x="${x + po}" y="${y + po}" width="${ps}" height="${ps}" viewBox="0 0 45 45">${pieceInner(code)}</svg>`;
        }
    }
}

// Coordenadas FUERA del tablero
for (let i = 0; i < 8; i++) {
    // Números (1-8): margen izquierdo, centrados verticalmente por fila
    const rank = String(8 - i);
    const ry = BY + i * SQ + SQ / 2 + CFS * 0.35;
    coords += `<text x="${BX / 2}" y="${ry}" font-family="Arial,sans-serif" font-size="${CFS}" font-weight="700" fill="${COORD_COLOR}" text-anchor="middle">${rank}</text>`;

    // Letras (a-h): margen inferior, centradas horizontalmente por columna
    const file = 'abcdefgh'[i];
    const fx = BX + i * SQ + SQ / 2;
    const fy = BY + BOARD + BOTTOM_MARGIN * 0.65 + CFS * 0.35;
    coords += `<text x="${fx}" y="${fy}" font-family="Arial,sans-serif" font-size="${CFS}" font-weight="700" fill="${COORD_COLOR}" text-anchor="middle">${file}</text>`;
}

const tx = BX + BOARD + 40;    // inicio del panel de texto
const LINES = [
    { y: 110, size: 34, weight: '700', fill: '#7fb069', text: '\u265E AjedrezIA', spacing: '1' },
    { y: 165, size: 21, weight: '400', fill: '#c9c2ba', text: 'Aperturas \u00b7 Problemas \u00b7 Partidas maestras' },
    { y: 240, size: 36, weight: '700', fill: '#ffffff',  text: 'Juega y aprende' },
    { y: 286, size: 36, weight: '700', fill: '#ffffff',  text: 'con AjedrezIA' },
    { y: 350, size: 22, weight: '400', fill: '#f0d9b5',  text: 'Partidas \u00b7 Aperturas \u00b7 Problemas' },
    { y: 390, size: 22, weight: '400', fill: '#f0d9b5',  text: 'Juega online \u00b7 Analiza \u00b7 Aprende' },
    { y: H - 36, size: 19, weight: '400', fill: '#8a827a', text: 'ajedrezia.com' },
];

let textSvg = '';
for (const l of LINES) {
    const extra = l.spacing ? ` letter-spacing="${l.spacing}"` : '';
    textSvg += `<text x="${tx}" y="${l.y}" font-family="Arial, sans-serif" font-size="${l.size}" font-weight="${l.weight}" fill="${l.fill}"${extra}>${escapeXml(l.text)}</text>\n`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a3531"/>
      <stop offset="1" stop-color="#1f1b18"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="${BX - 10}" y="${BY - 10}" width="${BOARD + 20}" height="${BOARD + 20}" rx="8" fill="#11100e"/>
  ${squares}
  ${pieces}
  ${coords}
  ${textSvg}
</svg>`;

// ---- Render ---------------------------------------------------------------
const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
    font: { loadSystemFonts: true },
    background: '#1f1b18'
});
const out = path.join(ROOT, 'share-img', 'default.png');
fs.writeFileSync(out, resvg.render().asPng());
console.log('OK  share-img/default.png');
