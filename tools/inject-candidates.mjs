/**
 * tools/inject-candidates.mjs
 * Inserta las 56 partidas del Candidates 2026 en FAMOUS_GAMES dentro de app.js
 * v2: escapa comillas simples dentro de strings JS
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const appPath  = path.join(__dir, '../app.js');
const htmlPath = path.join(__dir, '../famosas/FIDE Candidates 2026 Cyprus GM Axel Bachmann · Course.html');

const html = readFileSync(htmlPath, 'utf8');
const start = html.indexOf('const COURSE = {');
const end   = html.indexOf('\n// Build lid');
const course = JSON.parse(html.slice(start + 'const COURSE = '.length, end));
const vars = course.chapters.flatMap(ch => ch.variations || []);
console.log(`Total variaciones: ${vars.length}`);

function esc(s) {
    // Escapa backslashes, comillas simples y saltos de línea reales para strings JS
    return String(s || '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\r\n/g, '\\n')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\n');
}

function buildPGN(v) {
    const data = v.game.data.filter(m => m.san);
    const lines = [];
    lines.push(`[Event "${v.event || 'FIDE Candidates Tournament 2026'}"]`);
    lines.push(`[Site "${v.site || 'Larnaca, Cyprus'}"]`);
    lines.push(`[Date "${v.date || '2026.??.??'}"]`);
    lines.push(`[Round "${v.round || '?'}"]`);
    lines.push(`[White "${v.white}"]`);
    lines.push(`[Black "${v.black}"]`);
    lines.push(`[Result "${v.result}"]`);
    if (v.whiteElo) lines.push(`[WhiteElo "${v.whiteElo}"]`);
    if (v.blackElo) lines.push(`[BlackElo "${v.blackElo}"]`);
    lines.push('');
    const moveParts = [];
    data.forEach(m => {
        if (m.col === 'w') moveParts.push(`${m.move}.${m.san}`);
        else moveParts.push(m.san);
    });
    moveParts.push(v.result);
    lines.push(moveParts.join(' '));
    // Unir con literal \n y escapar comillas simples
    return esc(lines.join('\n'));
}

function makeKey(v) {
    const w = v.white.split(',')[0].trim().toLowerCase().replace(/[^a-z]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
    const b = v.black.split(',')[0].trim().toLowerCase().replace(/[^a-z]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
    const r = (v.title.match(/^R(\d+)/) || ['', '0'])[1];
    return `cand26-${w}-${b}-r${r}`;
}

function makeName(v) {
    const r = (v.title.match(/^R(\d+)/) || ['', '?'])[1];
    return esc(`${v.white} vs ${v.black} — Candidates 2026, R${r} (${v.result})`);
}

const entries = vars.map(v => {
    const key = makeKey(v);
    const name = makeName(v);
    const pgn  = buildPGN(v);
    return `    '${key}': {\n        name: '${name}',\n        pgn: '${pgn}'\n    }`;
});

// ── Rever si ya están ────────────────────────────────────────────────────────
let app = readFileSync(appPath, 'utf8');

// Eliminar bloque previo si existe (entre el comentario de inserción y el cierre)
const BLOCK_START = ',\n    // ── FIDE Candidates 2026 Cyprus ─────────────────────────────────────\n';
const ANCHOR      = '\n};\n\nconst OPENING_TRAINING';
if (app.includes(BLOCK_START)) {
    const bIdx = app.indexOf(BLOCK_START);
    const aIdx = app.indexOf(ANCHOR);
    app = app.slice(0, bIdx) + app.slice(aIdx);
    console.log('Bloque previo eliminado.');
}

// Insertar bloque correcto
const entriesBlock = entries.join(',\n');
const insertion = BLOCK_START + entriesBlock;
const anchorIdx = app.indexOf(ANCHOR);
if (anchorIdx === -1) { console.error('ANCHOR NOT FOUND'); process.exit(1); }

app = app.slice(0, anchorIdx) + insertion + app.slice(anchorIdx);
writeFileSync(appPath, app, 'utf8');
console.log(`Insertadas ${vars.length} partidas en app.js`);

// Verificar count
const count = (app.match(/'cand26-/g) || []).length;
console.log(`Entradas cand26- en app.js: ${count}`);
