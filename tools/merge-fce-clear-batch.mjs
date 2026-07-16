import { readFileSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const FCE = 'games/FCE';
const indexPath = join(FCE, 'index.json');
const idx = JSON.parse(readFileSync(indexPath, 'utf8'));
const indexMap = new Map(idx.map(e => [e.id, { ...e }]));

// 9 grupos CLAROS — canonical = primera id (más partidas)
const GROUPS = [
  {
    name: 'Narciso Dublan',
    canonical: 'narciso-dublan-m',
    merge: ['narciso-dublan-marc'],
  },
  {
    name: 'Vehi Bach',
    canonical: 'vehi-bach-vm',
    merge: ['vehi-bach-victor-manuel', 'vehi-bach-victor-m', 'vehi-bach-v'],
  },
  {
    name: 'Perpinya Rofes',
    canonical: 'perpinya-rofes-lm',
    merge: [
      'perpinya-rofes-lluis-maria',
      'perpinya-rofes-lluis',
      'perpinya-rofes-lluis-ma',
      'perpinya-rofes-lluis-maria-sabadell',
      'perpinya-rofes-lluis-m',
      'perpinya-rofes-llu-s-m',
      'perpinya-lluis',
      'perpinya-lluis-maria',
    ],
  },
  {
    name: 'Movsziszian',
    canonical: 'movsziszian-k',
    merge: ['movsziszian-karen', 'movsziszian-karen-sant-andreu'],
  },
  {
    name: 'Perez Manas',
    canonical: 'perez-manas-benjamin',
    merge: ['perez-manas-b'],
  },
  {
    name: 'Moskalenko',
    canonical: 'moskalenko-v',
    merge: ['moskalenko-viktor', 'moskalenko-victor', 'moskalenko-viktor-sabadell', 'moskalenko-wiktor'],
  },
  {
    name: 'Jerez Perez',
    canonical: 'jerez-perez-a',
    merge: ['jerez-perez-alfonso'],
  },
  {
    name: 'Fluvia Poyatos',
    canonical: 'fluvia-poyatos-joan',
    merge: ['fluvia-j', 'fluvia-poyatos-j'],
  },
  {
    name: 'Peralta',
    canonical: 'peralta-f',
    merge: ['peralta-fernando'],
  },
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
  if (!canon) {
    console.warn(`WARN: no existe ${group.canonical}`);
    continue;
  }

  const canonPath = join(FCE, group.canonical, 'games.pgn');
  let canonRaw = readFileSync(canonPath, 'utf8');
  const seen = new Set();
  const games = [];
  for (const pgn of splitPgn(canonRaw)) {
    const k = gameKey(pgn);
    if (!seen.has(k)) { seen.add(k); games.push(pgn); }
  }

  for (const otherId of group.merge) {
    const otherPath = join(FCE, otherId, 'games.pgn');
    try {
      const raw = readFileSync(otherPath, 'utf8');
      for (const pgn of splitPgn(raw)) {
        const k = gameKey(pgn);
        if (!seen.has(k)) { seen.add(k); games.push(pgn); addedGames++; }
      }
      rmSync(join(FCE, otherId), { recursive: true, force: true });
      indexMap.delete(otherId);
      removed++;
    } catch {
      console.warn(`WARN: no existe ${otherId}`);
    }
  }

  const out = games.join('\n\n');
  writeFileSync(canonPath, out, 'utf8');
  const sizeMB = Math.round((Buffer.byteLength(out, 'utf8') / 1048576) * 100) / 100;
  indexMap.set(group.canonical, {
    ...canon,
    gameCount: games.length,
    sizeMB,
  });
  console.log(`${group.name}: ${games.length} partidas (fusionado en ${group.canonical})`);
}

const newIndex = [...indexMap.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
writeFileSync(indexPath, JSON.stringify(newIndex, null, 2), 'utf8');
console.log(`\nCarpetas eliminadas: ${removed}`);
console.log(`Partidas nuevas fusionadas: ${addedGames}`);
console.log(`Jugadores finales: ${newIndex.length}`);
