import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const FCE = 'games/FCE';
const SRC = 'D:/KINGSTON-Quim Fons/fce';
const CANON_ID = 'perez-perez-francisco-jose';
const RESTORE_ID = 'perez-garcia-francisco-jose';
const RESTORE_NAME = 'Perez Garcia, Francisco Jose';

function splitPgn(raw) {
  return raw.split(/(?=\[Event\s+")/).map(b => b.trim()).filter(b => b.startsWith('[Event'));
}

function getHeader(pgn, tag) {
  const m = pgn.match(new RegExp(`^\\[${tag}\\s+"([^"]*)"\\]`, 'm'));
  return m ? m[1].trim() : '';
}

function gameKey(pgn) {
  return [getHeader(pgn, 'Event'), getHeader(pgn, 'White'), getHeader(pgn, 'Black'), getHeader(pgn, 'Date'), getHeader(pgn, 'Round')].join('|');
}

function normalize(name) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isPerezGarcia(name) {
  const n = normalize(name);
  return n.includes('perez') && n.includes('garcia') && n.includes('francisco') && n.includes('jose');
}

function isPerezPerez(name) {
  const n = normalize(name);
  const parts = n.split(' ').filter(Boolean);
  const perezCount = parts.filter(p => p === 'perez').length;
  return perezCount >= 2 && n.includes('francisco') && n.includes('jose');
}

// 1) Rebuild Garcia folder from source PGNs
import { readdirSync } from 'fs';
const srcFiles = readdirSync(SRC).filter(f => f.toLowerCase().endsWith('.pgn'));
const garciaGames = [];
const garciaKeys = new Set();

for (const file of srcFiles) {
  const raw = readFileSync(join(SRC, file), 'latin1');
  for (const pgn of splitPgn(raw)) {
    const w = getHeader(pgn, 'White');
    const b = getHeader(pgn, 'Black');
    if (!isPerezGarcia(w) && !isPerezGarcia(b)) continue;
    const k = gameKey(pgn);
    if (!garciaKeys.has(k)) {
      garciaKeys.add(k);
      garciaGames.push(pgn);
    }
  }
}

console.log(`Partidas Perez Garcia en fuente: ${garciaGames.length}`);

const restoreDir = join(FCE, RESTORE_ID);
mkdirSync(restoreDir, { recursive: true });
const garciaOut = garciaGames.join('\n\n');
writeFileSync(join(restoreDir, 'games.pgn'), garciaOut, 'utf8');
const garciaSizeMB = Math.round((Buffer.byteLength(garciaOut, 'utf8') / 1048576) * 100) / 100;

// 2) Perez Perez folder unchanged (0 games were added in merge)
const canonPath = join(FCE, CANON_ID, 'games.pgn');
const canonRaw = readFileSync(canonPath, 'utf8');
const canonGames = splitPgn(canonRaw);
console.log(`Partidas Perez Perez (sin cambios): ${canonGames.length}`);

// 3) Update index.json
const indexPath = join(FCE, 'index.json');
const idx = JSON.parse(readFileSync(indexPath, 'utf8'));
const filtered = idx.filter(e => e.id !== RESTORE_ID);
const canonEntry = filtered.find(e => e.id === CANON_ID);
if (canonEntry) {
  canonEntry.gameCount = canonGames.length;
  canonEntry.sizeMB = Math.round((Buffer.byteLength(canonRaw, 'utf8') / 1048576) * 100) / 100;
}

filtered.push({
  id: RESTORE_ID,
  name: RESTORE_NAME,
  file: `${RESTORE_ID}/games.pgn`,
  gameCount: garciaGames.length,
  sizeMB: garciaSizeMB,
});

filtered.sort((a, b) => a.name.localeCompare(b.name, 'es'));
writeFileSync(indexPath, JSON.stringify(filtered, null, 2), 'utf8');

console.log('\n=== FUSIÓN DESHECHA ===');
console.log(`Restaurado: ${RESTORE_NAME} [${garciaGames.length}] → ${RESTORE_ID}/`);
console.log(`Mantenido: ${canonEntry?.name} [${canonGames.length}] → ${CANON_ID}/`);
console.log(`Jugadores totales: ${filtered.length}`);
