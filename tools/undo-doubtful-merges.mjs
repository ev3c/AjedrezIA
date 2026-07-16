import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const FCE = 'games/FCE';
const SRC = 'D:/KINGSTON-Quim Fons/fce';
const INDEX = join(FCE, 'index.json');

const UNDO = [
  {
    n: 109,
    players: [
      { id: 'cuadras-avellana-j', name: 'Cuadras Avellana, J.' },
      { id: 'cuadras-avellana-jordi', name: 'Cuadras Avellana, Jordi' },
      { id: 'cuadras-avellana-josep-maria', name: 'Cuadras Avellana, Josep Maria' },
    ],
  },
  {
    n: 122,
    players: [
      { id: 'velasco-blasco-joan-m', name: 'Velasco Blasco, Joan M' },
      { id: 'velasco-blasco-jm', name: 'Velasco Blasco, JM.' },
      { id: 'velasco-blasco-josep-m', name: 'Velasco Blasco, Josep M' },
    ],
  },
  {
    n: 130,
    players: [
      { id: 'iglesias-jorge', name: 'Iglesias, Jorge' },
      { id: 'iglesias-j', name: 'Iglesias, J.' },
      { id: 'iglesias-joachim', name: 'Iglesias, Joachim' },
    ],
  },
  {
    n: 169,
    players: [
      { id: 'torner-planell-jr', name: 'Torner Planell, JR.' },
      { id: 'torner-planell-jordi', name: 'Torner Planell, Jordi' },
      { id: 'torner-planell-josep-ramon', name: 'Torner Planell, Josep Ramon' },
      { id: 'torner-planell-josep-r', name: 'Torner Planell, Josep R' },
    ],
  },
  {
    n: 171,
    players: [
      { id: 'ribes-cabrera-j', name: 'Ribes Cabrera, J.' },
      { id: 'ribes-cabrera-josep-lluis', name: 'Ribes Cabrera, Josep Lluis' },
      { id: 'ribes-cabrera-jordi', name: 'Ribes Cabrera, Jordi' },
    ],
  },
];

const SKIP = [
  { n: 110, reason: 'Nunca se fusionó (carpetas separadas)' },
  { n: 174, reason: 'Nunca se fusionó (carpetas separadas)' },
];

function splitPgn(raw) {
  return raw.split(/(?=\[Event\s+")/).map(b => b.trim()).filter(b => b.startsWith('[Event'));
}

function getHeader(pgn, tag) {
  const m = pgn.match(new RegExp(`^\\[${tag}\\s+"([^"]*)"\\]`, 'm'));
  return m ? m[1].trim() : '';
}

function norm(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function nameMatch(header, target) {
  return norm(header) === norm(target);
}

// Cargar todos los PGN fuente una vez
console.log('Cargando PGN fuente...');
const allGames = [];
for (const file of readdirSync(SRC).filter(f => f.toLowerCase().endsWith('.pgn'))) {
  const raw = readFileSync(join(SRC, file), 'latin1');
  for (const pgn of splitPgn(raw)) {
    allGames.push(pgn);
  }
}
console.log(`Partidas fuente: ${allGames.length}\n`);

const rebuilt = new Map(); // id -> { name, games[] }

for (const { players } of UNDO) {
  for (const p of players) {
    const games = [];
    const keys = new Set();
    for (const pgn of allGames) {
      const w = getHeader(pgn, 'White');
      const b = getHeader(pgn, 'Black');
      if (!nameMatch(w, p.name) && !nameMatch(b, p.name)) continue;
      const k = [getHeader(pgn, 'Event'), w, b, getHeader(pgn, 'Date'), getHeader(pgn, 'Round')].join('|');
      if (!keys.has(k)) { keys.add(k); games.push(pgn); }
    }
    rebuilt.set(p.id, { ...p, games });
  }
}

// Escribir carpetas y actualizar índice
let idx = JSON.parse(readFileSync(INDEX, 'utf8'));
const indexMap = new Map(idx.map(e => [e.id, { ...e }]));

for (const { n, players } of UNDO) {
  console.log(`=== #${n} ===`);
  for (const p of players) {
    const data = rebuilt.get(p.id);
    const dir = join(FCE, p.id);
    mkdirSync(dir, { recursive: true });
    const out = data.games.join('\n\n');
    writeFileSync(join(dir, 'games.pgn'), out, 'utf8');
    const sizeMB = Math.round((Buffer.byteLength(out, 'utf8') / 1048576) * 100) / 100;
    indexMap.set(p.id, {
      id: p.id,
      name: p.name,
      file: `${p.id}/games.pgn`,
      gameCount: data.games.length,
      sizeMB,
    });
    console.log(`  ${p.name} [${data.games.length}] → ${p.id}/`);
  }
  console.log('');
}

for (const s of SKIP) {
  console.log(`=== #${s.n} === SKIP: ${s.reason}\n`);
}

const newIndex = [...indexMap.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
writeFileSync(INDEX, JSON.stringify(newIndex, null, 2), 'utf8');
console.log(`Jugadores totales: ${newIndex.length}`);
