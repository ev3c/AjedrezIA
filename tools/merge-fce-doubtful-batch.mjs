import { readFileSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const FCE = 'games/FCE';
const indexPath = join(FCE, 'index.json');
const idx = JSON.parse(readFileSync(indexPath, 'utf8'));
const indexMap = new Map(idx.map(e => [e.id, { ...e }]));

const GROUPS = [
  { name: 'Campos Moreno', canonical: 'campos-moreno-javier-b', merge: ['campos-moreno-j'] },
  { name: 'Vidarte Morales', canonical: 'vidarte-morales-a', merge: ['vidarte-morales-arturo'] },
  { name: 'Lorenzo de la Riva', canonical: 'lorenzo-de-la-riva-l', merge: ['lorenzo-de-la-riva-lazaro', 'lorenzo-de-la-riva-l-zaro'] },
  { name: 'Medina Garcia', canonical: 'medina-garcia-antonio', merge: ['medina-garcia-a'] },
  { name: 'Muñoz Pantoja', canonical: 'munoz-pantoja-m', merge: ['munoz-pantoja-miguel-angel', 'munoz-pantoja-miguel', 'munoz-pantoja-ma'] },
];

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

let removed = 0;
let addedGames = 0;

for (const group of GROUPS) {
  const canon = indexMap.get(group.canonical);
  if (!canon) { console.warn(`WARN: ${group.canonical}`); continue; }

  const canonPath = join(FCE, group.canonical, 'games.pgn');
  const seen = new Set();
  const games = [];
  for (const pgn of splitPgn(readFileSync(canonPath, 'utf8'))) {
    const k = gameKey(pgn);
    if (!seen.has(k)) { seen.add(k); games.push(pgn); }
  }

  for (const otherId of group.merge) {
    try {
      for (const pgn of splitPgn(readFileSync(join(FCE, otherId, 'games.pgn'), 'utf8'))) {
        const k = gameKey(pgn);
        if (!seen.has(k)) { seen.add(k); games.push(pgn); addedGames++; }
      }
      rmSync(join(FCE, otherId), { recursive: true, force: true });
      indexMap.delete(otherId);
      removed++;
    } catch { console.warn(`WARN: ${otherId}`); }
  }

  const out = games.join('\n\n');
  writeFileSync(canonPath, out, 'utf8');
  const sizeMB = Math.round((Buffer.byteLength(out, 'utf8') / 1048576) * 100) / 100;
  indexMap.set(group.canonical, { ...canon, gameCount: games.length, sizeMB });
  console.log(`${group.name}: ${games.length} partidas → ${group.canonical}`);
}

const newIndex = [...indexMap.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
writeFileSync(indexPath, JSON.stringify(newIndex, null, 2), 'utf8');
console.log(`\nEliminadas: ${removed} carpetas | Jugadores: ${newIndex.length}`);
