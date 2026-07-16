import { readFileSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const FCE = 'games/FCE';
const CANON_ID = 'abarca-garcia-xavier';
const OTHER_ID = 'abarca-garcia-x';

function splitPgn(raw) {
  return raw.split(/(?=\[Event\s+")/).map(b => b.trim()).filter(b => b.startsWith('[Event'));
}

function gameKey(pgn) {
  const h = (tag) => {
    const m = pgn.match(new RegExp(`^\\[${tag}\\s+"([^"]*)"\\]`, 'm'));
    return m ? m[1].trim() : '';
  };
  return [h('Event'), h('White'), h('Black'), h('Date'), h('Round')].join('|');
}

const canonPath = join(FCE, CANON_ID, 'games.pgn');
const otherPath = join(FCE, OTHER_ID, 'games.pgn');
const seen = new Set();
const games = [];

for (const pgn of splitPgn(readFileSync(canonPath, 'utf8'))) {
  const k = gameKey(pgn);
  if (!seen.has(k)) { seen.add(k); games.push(pgn); }
}

let added = 0;
for (const pgn of splitPgn(readFileSync(otherPath, 'utf8'))) {
  const k = gameKey(pgn);
  if (!seen.has(k)) { seen.add(k); games.push(pgn); added++; }
}

const out = games.join('\n\n');
writeFileSync(canonPath, out, 'utf8');
rmSync(join(FCE, OTHER_ID), { recursive: true, force: true });

const indexPath = join(FCE, 'index.json');
const idx = JSON.parse(readFileSync(indexPath, 'utf8'));
const filtered = idx.filter(e => e.id !== OTHER_ID);
const entry = filtered.find(e => e.id === CANON_ID);
entry.gameCount = games.length;
entry.sizeMB = Math.round((Buffer.byteLength(out, 'utf8') / 1048576) * 100) / 100;
filtered.sort((a, b) => a.name.localeCompare(b.name, 'es'));
writeFileSync(indexPath, JSON.stringify(filtered, null, 2), 'utf8');

console.log(`Fusionado en ${CANON_ID} (${entry.name})`);
console.log(`Partidas: ${games.length} (+${added} nuevas)`);
console.log(`Eliminada: ${OTHER_ID}`);
console.log(`Jugadores totales: ${filtered.length}`);
