import { readFileSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const FCE = 'games/FCE';
const CANON_ID = 'aalbersberg-kroon-p';
const OTHER_IDS = ['aalsbersberg-kroon-p', 'aalsbersberg-kroon-pere'];

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
const seen = new Set();
const games = [];

for (const pgn of splitPgn(readFileSync(canonPath, 'utf8'))) {
  const k = gameKey(pgn);
  if (!seen.has(k)) { seen.add(k); games.push(pgn); }
}

let added = 0;
let removed = 0;

for (const otherId of OTHER_IDS) {
  const otherPath = join(FCE, otherId, 'games.pgn');
  try {
    for (const pgn of splitPgn(readFileSync(otherPath, 'utf8'))) {
      const k = gameKey(pgn);
      if (!seen.has(k)) { seen.add(k); games.push(pgn); added++; }
    }
    rmSync(join(FCE, otherId), { recursive: true, force: true });
    removed++;
    console.log(`  + absorbido: ${otherId}`);
  } catch (e) {
    console.log(`  ! no encontrado: ${otherId}`);
  }
}

const out = games.join('\n\n');
writeFileSync(canonPath, out, 'utf8');

const indexPath = join(FCE, 'index.json');
const idx = JSON.parse(readFileSync(indexPath, 'utf8'));
const removeSet = new Set(OTHER_IDS);
const filtered = idx.filter(e => !removeSet.has(e.id));
const entry = filtered.find(e => e.id === CANON_ID);
entry.gameCount = games.length;
entry.sizeMB = Math.round((Buffer.byteLength(out, 'utf8') / 1048576) * 100) / 100;
filtered.sort((a, b) => a.name.localeCompare(b.name, 'es'));
writeFileSync(indexPath, JSON.stringify(filtered, null, 2), 'utf8');

console.log(`\nFusionado en ${CANON_ID} (${entry.name})`);
console.log(`Partidas: ${games.length} (+${added} nuevas)`);
console.log(`Carpetas eliminadas: ${removed}`);
console.log(`Jugadores totales: ${filtered.length}`);
