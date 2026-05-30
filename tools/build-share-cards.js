/*
 * Generador de tarjetas de compartir para partidas maestras (Open Graph).
 *
 * Reutiliza el MOTOR REAL del juego (chess-logic.js) para reproducir cada
 * partida de FAMOUS_GAMES hasta su posición final, y renderiza una imagen
 * PNG 1200x630 (formato tarjeta de Facebook / X / WhatsApp) con el tablero,
 * el título de la partida y los jugadores.
 *
 * Salida:
 *   - share-img/master-<clave>.png        (una imagen por partida)
 *   - share-data.php                       (mapa PHP clave -> metadatos + fen)
 *
 * Requisito (una sola vez): el módulo nativo @resvg/resvg-js se instala FUERA
 * de Google Drive ("Mi unidad"), porque ahí la extracción de binarios nativos
 * falla. Instálalo en la carpeta temporal del sistema:
 *
 *   mkdir %TEMP%\ajedrez-img && cd %TEMP%\ajedrez-img
 *   npm init -y && npm install @resvg/resvg-js
 *
 * Uso:  node tools/build-share-cards.js   (desde la raíz del proyecto)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');

// resvg se instala fuera de Google Drive (los módulos nativos fallan en "Mi unidad")
const RESVG_DIR = path.join(os.tmpdir(), 'ajedrez-img', 'node_modules', '@resvg', 'resvg-js');
const { Resvg } = require(RESVG_DIR);

// ---------------------------------------------------------------------------
// 1) Cargar el motor de ajedrez real (chess-logic.js) en un contexto aislado
// ---------------------------------------------------------------------------
const chessLogicSrc = fs.readFileSync(path.join(ROOT, 'chess-logic.js'), 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(chessLogicSrc + '\nthis.ChessGame = ChessGame;\nthis.PIECES = PIECES;', sandbox);
const ChessGame = sandbox.ChessGame;

// ---------------------------------------------------------------------------
// 2) Parser SAN -> coordenadas (port directo de parseSANMove de app.js)
// ---------------------------------------------------------------------------
function parseSANMove(san, gameState) {
    const color = gameState.currentTurn;
    san = san.replace(/[+#!?]/g, '');

    if (san === 'O-O' || san === '0-0') {
        const row = color === 'white' ? 7 : 0;
        return { fromRow: row, fromCol: 4, toRow: row, toCol: 6 };
    }
    if (san === 'O-O-O' || san === '0-0-0') {
        const row = color === 'white' ? 7 : 0;
        return { fromRow: row, fromCol: 4, toRow: row, toCol: 2 };
    }

    const files = 'abcdefgh';
    const pieceMap = { 'K': 'king', 'Q': 'queen', 'R': 'rook', 'B': 'bishop', 'N': 'knight' };

    let pieceType = 'pawn';
    let disambigFile = -1;
    let disambigRank = -1;
    let toFile, toRank;
    let promotion = null;
    let s = san;

    const promoMatch = s.match(/=?([QRBN])$/);
    if (promoMatch) { promotion = promoMatch[1]; s = s.replace(/=?[QRBN]$/, ''); }
    if (s[0] && pieceMap[s[0]]) { pieceType = pieceMap[s[0]]; s = s.substring(1); }
    s = s.replace('x', '');
    if (s.length < 2) return null;
    toFile = files.indexOf(s[s.length - 2]);
    toRank = 8 - parseInt(s[s.length - 1]);
    if (toFile < 0 || toRank < 0 || toRank > 7) return null;

    const disambig = s.substring(0, s.length - 2);
    for (const ch of disambig) {
        if (files.includes(ch)) disambigFile = files.indexOf(ch);
        else if (ch >= '1' && ch <= '8') disambigRank = 8 - parseInt(ch);
    }

    const promoMap = { 'Q': 'queen', 'R': 'rook', 'B': 'bishop', 'N': 'knight' };

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = gameState.getPiece(row, col);
            if (!piece || piece.color !== color || piece.type !== pieceType) continue;
            if (disambigFile >= 0 && col !== disambigFile) continue;
            if (disambigRank >= 0 && row !== disambigRank) continue;
            const validMoves = gameState.getValidMoves(row, col);
            if (validMoves.some(m => m.row === toRank && m.col === toFile)) {
                return { fromRow: row, fromCol: col, toRow: toRank, toCol: toFile,
                         promotion: promotion ? promoMap[promotion] : undefined };
            }
        }
    }
    return null;
}

// ---------------------------------------------------------------------------
// 3) Extraer FAMOUS_GAMES del app.js (sin ejecutar todo app.js)
// ---------------------------------------------------------------------------
function extractFamousGames() {
    const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
    const start = appSrc.indexOf('const FAMOUS_GAMES = {');
    if (start < 0) throw new Error('No se encontró FAMOUS_GAMES');
    const objStart = appSrc.indexOf('{', start);
    // El primer "\n};" tras el inicio cierra el objeto (los PGN no contienen "\n};")
    const end = appSrc.indexOf('\n};', objStart);
    const literal = appSrc.substring(objStart, end + 2); // incluye "}"
    return vm.runInNewContext('(' + literal + ')');
}

// ---------------------------------------------------------------------------
// 4) Reproducir un PGN hasta el final y devolver { fen, tags }
// ---------------------------------------------------------------------------
function parsePGNTags(pgn) {
    const tags = {};
    const re = /\[(\w+)\s+"([^"]*)"\]/g;
    let m;
    while ((m = re.exec(pgn)) !== null) tags[m[1]] = m[2];
    return tags;
}

function pgnMoveList(pgn) {
    // Quitar cabeceras [..], comentarios {..}, números de jugada y resultado
    let body = pgn.replace(/\[[^\]]*\]/g, ' ')
                  .replace(/\{[^}]*\}/g, ' ')
                  .replace(/\d+\.(\.\.)?/g, ' ')
                  .replace(/\b(1-0|0-1|1\/2-1\/2|\*)\b/g, ' ');
    return body.split(/\s+/).filter(Boolean);
}

function replayGame(pgn) {
    const game = new ChessGame();
    const moves = pgnMoveList(pgn);
    for (const san of moves) {
        const parsed = parseSANMove(san, game);
        if (!parsed) throw new Error('No se pudo parsear la jugada: ' + san);
        const res = game.makeMove(parsed.fromRow, parsed.fromCol, parsed.toRow, parsed.toCol, parsed.promotion);
        if (res === false) throw new Error('Jugada ilegal: ' + san);
    }
    return game;
}

// ---------------------------------------------------------------------------
// 5) Render de la imagen-tarjeta (1200x630) a partir del FEN
// ---------------------------------------------------------------------------
const PIECE_DIR = path.join(ROOT, 'pieces', 'cburnett');
const pieceCache = {};
function pieceInner(code) {
    // code: 'wK','bQ',... -> contenido interno del SVG cburnett (sin <svg> raíz)
    if (pieceCache[code] !== undefined) return pieceCache[code];
    const file = path.join(PIECE_DIR, code + '.svg');
    let svg = fs.readFileSync(file, 'utf8');
    svg = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    pieceCache[code] = svg;
    return svg;
}

const FEN_TO_CODE = {
    K: 'wK', Q: 'wQ', R: 'wR', B: 'wB', N: 'wN', P: 'wP',
    k: 'bK', q: 'bQ', r: 'bR', b: 'bB', n: 'bN', p: 'bP'
};

function fenToBoard(fen) {
    const rows = fen.split(' ')[0].split('/');
    const board = [];
    for (const row of rows) {
        const line = [];
        for (const ch of row) {
            if (ch >= '1' && ch <= '8') {
                for (let i = 0; i < parseInt(ch); i++) line.push(null);
            } else {
                line.push(ch);
            }
        }
        board.push(line);
    }
    return board; // board[0] = fila 8 (negras arriba), perspectiva blancas
}

function escapeXml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function wrapText(text, maxChars) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let cur = '';
    for (const w of words) {
        if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; }
        else cur = (cur + ' ' + w).trim();
    }
    if (cur) lines.push(cur);
    return lines;
}

const W = 1200, H = 630;
const BOARD = 540;
const BX = 48, BY = (H - BOARD) / 2;          // tablero a la izquierda, centrado vertical
const SQ = BOARD / 8;
const LIGHT = '#eadab5', DARK = '#b07a48';

function buildCardSVG(meta) {
    const board = fenToBoard(meta.fen);

    // Resaltado de la última jugada
    let lastFrom = null, lastTo = null;
    if (meta.lastMove && meta.lastMove.length >= 4) {
        const f = 'abcdefgh';
        lastFrom = { c: f.indexOf(meta.lastMove[0]), r: 8 - parseInt(meta.lastMove[1]) };
        lastTo   = { c: f.indexOf(meta.lastMove[2]), r: 8 - parseInt(meta.lastMove[3]) };
    }

    let squares = '';
    let pieces = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const x = BX + c * SQ, y = BY + r * SQ;
            const isLight = (r + c) % 2 === 0;
            squares += `<rect x="${x}" y="${y}" width="${SQ}" height="${SQ}" fill="${isLight ? LIGHT : DARK}"/>`;
            const hl = (lastFrom && lastFrom.r === r && lastFrom.c === c) ||
                       (lastTo && lastTo.r === r && lastTo.c === c);
            if (hl) squares += `<rect x="${x}" y="${y}" width="${SQ}" height="${SQ}" fill="#f6e07a" opacity="0.55"/>`;
            const code = board[r][c] && FEN_TO_CODE[board[r][c]];
            if (code) {
                pieces += `<svg x="${x}" y="${y}" width="${SQ}" height="${SQ}" viewBox="0 0 45 45">${pieceInner(code)}</svg>`;
            }
        }
    }

    // Panel de texto a la derecha
    const tx = BX + BOARD + 44;          // x inicio del texto
    const tw = W - tx - 48;              // ancho disponible
    const titleLines = wrapText(meta.title, 26).slice(0, 3);
    let titleSvg = '';
    let ty = 196;
    for (const ln of titleLines) {
        titleSvg += `<text x="${tx}" y="${ty}" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="#ffffff">${escapeXml(ln)}</text>`;
        ty += 48;
    }

    const vs = `${meta.white}  vs  ${meta.black}`;
    const sub = [meta.site, meta.year].filter(Boolean).join(' · ');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a3531"/>
      <stop offset="1" stop-color="#1f1b18"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="${BX - 8}" y="${BY - 8}" width="${BOARD + 16}" height="${BOARD + 16}" rx="8" fill="#11100e"/>
  ${squares}
  ${pieces}
  <text x="${tx}" y="96" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#7fb069" letter-spacing="1">&#9822; AjedrezIA</text>
  <text x="${tx}" y="140" font-family="Arial, sans-serif" font-size="22" fill="#c9c2ba">Partida maestra</text>
  ${titleSvg}
  <text x="${tx}" y="${ty + 16}" font-family="Arial, sans-serif" font-size="26" font-weight="600" fill="#f0d9b5">${escapeXml(vs)}</text>
  <text x="${tx}" y="${ty + 52}" font-family="Arial, sans-serif" font-size="22" fill="#a89f96">${escapeXml(sub)}</text>
  <text x="${tx}" y="${H - 40}" font-family="Arial, sans-serif" font-size="20" fill="#8a827a">ajedrezia.com</text>
</svg>`;
}

function renderCard(meta, outPath) {
    const svg = buildCardSVG(meta);
    const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: W },
        font: { loadSystemFonts: true },
        background: '#1f1b18'
    });
    fs.writeFileSync(outPath, resvg.render().asPng());
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
const FAMOUS_GAMES = extractFamousGames();
const keys = Object.keys(FAMOUS_GAMES);
console.log('Partidas maestras encontradas:', keys.length);

const OUT_IMG = path.join(ROOT, 'share-img');
fs.mkdirSync(OUT_IMG, { recursive: true });

let ok = 0, fail = 0;
const phpEntries = [];
for (const key of keys) {
    const g = FAMOUS_GAMES[key];
    try {
        const game = replayGame(g.pgn);
        const fen = game.toFEN();
        const placement = fen.split(' ')[0];
        const tags = parsePGNTags(g.pgn);
        const lastMove = game.moveHistoryUCI[game.moveHistoryUCI.length - 1] || '';
        const year = (tags.Date || '').slice(0, 4).replace(/[^\d]/g, '');
        const meta = {
            title: g.name,
            white: tags.White || '?',
            black: tags.Black || '?',
            site: tags.Site || '',
            year: year || '',
            fen: placement,
            lastMove
        };
        renderCard(meta, path.join(OUT_IMG, 'master-' + key + '.png'));

        // descripción para Open Graph
        const desc = `${meta.white} vs ${meta.black}` +
            (meta.site || meta.year ? ` (${[meta.site, meta.year].filter(Boolean).join(', ')})` : '') +
            '. Revívela jugada a jugada en AjedrezIA.';
        phpEntries.push(
            `  '${key}' => ['title' => ${phpStr(g.name)}, 'desc' => ${phpStr(desc)}, ` +
            `'white' => ${phpStr(meta.white)}, 'black' => ${phpStr(meta.black)}, 'year' => ${phpStr(meta.year)}],`
        );
        ok++;
        console.log('OK  ', key);
    } catch (e) {
        fail++;
        console.log('FAIL', key, e.message);
    }
}

// Imagen genérica de respaldo (posición inicial) para enlaces sin partida
try {
    renderCard({
        title: 'Juega y aprende ajedrez',
        white: 'Tú', black: 'AjedrezIA', site: '', year: '',
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', lastMove: ''
    }, path.join(OUT_IMG, 'default.png'));
    console.log('OK   default.png');
} catch (e) { console.log('FAIL default.png', e.message); }

// Mapa PHP usado por share.php (título/descripción por clave de partida)
function phpStr(s) { return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }
const phpOut = `<?php
// Generado por tools/build-share-cards.js — NO editar a mano.
// Metadatos de partidas maestras para las tarjetas de compartir (Open Graph).
return [
${phpEntries.join('\n')}
];
`;
fs.writeFileSync(path.join(ROOT, 'share-data.php'), phpOut);

console.log(`\nImágenes en: share-img/`);
console.log(`Datos PHP en: share-data.php`);
console.log(`Resumen: ${ok} OK, ${fail} FALLOS`);
