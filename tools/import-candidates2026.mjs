/**
 * tools/import-candidates2026.mjs
 * Extrae las 56 partidas del HTML del curso Candidates 2026 de Bachmann
 * y genera el bloque JS para pegar en FAMOUS_GAMES (app.js).
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dir, '../famosas/FIDE Candidates 2026 Cyprus GM Axel Bachmann · Course.html');
const outPath  = path.join(__dir, '../famosas/candidates2026-famous-games.js');

const html = readFileSync(htmlPath, 'utf8');
const start = html.indexOf('const COURSE = {');
const end   = html.indexOf('\n// Build lid');
const course = JSON.parse(html.slice(start + 'const COURSE = '.length, end));
const vars = course.chapters.flatMap(ch => ch.variations || []);
console.log(`Total variaciones: ${vars.length}`);

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
    return lines.join('\\n');
}

function makeKey(v) {
    const w = v.white.split(',')[0].trim().toLowerCase().replace(/[^a-z]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
    const b = v.black.split(',')[0].trim().toLowerCase().replace(/[^a-z]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
    const r = (v.title.match(/^R(\d+)/) || ['', '0'])[1];
    return `cand26-${w}-${b}-r${r}`;
}

function makeName(v) {
    const r = (v.title.match(/^R(\d+)/) || ['', '?'])[1];
    return `${v.white} vs ${v.black} — Candidates 2026, R${r} (${v.result})`;
}

const entries = vars.map(v => {
    const key = makeKey(v);
    const name = makeName(v);
    const pgn = buildPGN(v);
    return `    '${key}': {\n        name: '${name}',\n        pgn: '${pgn}'\n    }`;
});

// Generar también bloque de jugadores para get-users.php
const players = new Map();
vars.forEach(v => {
    if (!players.has(v.white)) players.set(v.white, parseInt(v.whiteElo) || 2700);
    if (!players.has(v.black)) players.set(v.black, parseInt(v.blackElo) || 2700);
});

console.log('Jugadores únicos:');
players.forEach((elo, name) => console.log(`  ${name}: ${elo}`));

const output = `// ── FIDE Candidates 2026 Cyprus — Partidas Maestras ──────────────────────
// Generado automáticamente por tools/import-candidates2026.mjs
// Pegar dentro de FAMOUS_GAMES en app.js, bajo la clave de grupo.
// ${vars.length} partidas — ${new Date().toISOString().slice(0,10)}

${entries.join(',\n')}`;

writeFileSync(outPath, output, 'utf8');
console.log(`\nEscrito en: ${outPath}`);
console.log(`Entradas generadas: ${entries.length}`);

// Mostrar primeras 2 como muestra
console.log('\n--- Muestra (2 primeras entradas) ---');
entries.slice(0, 2).forEach(e => console.log(e.slice(0, 300) + '...\n'));
