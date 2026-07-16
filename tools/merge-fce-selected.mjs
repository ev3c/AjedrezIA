/**
 * Fusiona grupos seleccionados de fce-aggressive-clusters.json
 * Uso: node tools/merge-fce-selected.mjs 1 5 12 20
 *      node tools/merge-fce-selected.mjs --risk alta
 *      node tools/merge-fce-selected.mjs --risk alta,media
 */
import { readFileSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

const FCE = 'games/FCE';
const fileArg = process.argv.find((a, i) => process.argv[i - 1] === '--file');
const clustersPath = fileArg || 'tools/fce-aggressive-clusters.json';
const args = process.argv.slice(2).filter((a, i, arr) => a !== '--file' && arr[i - 1] !== '--file');

if (!args.length) {
  console.log('Uso: node tools/merge-fce-selected.mjs <números...>');
  console.log('     node tools/merge-fce-selected.mjs --risk alta');
  console.log('     node tools/merge-fce-selected.mjs --risk alta,media');
  console.log('     node tools/merge-fce-selected.mjs --file tools/fce-initial-pass-clusters.json --risk alta');
  process.exit(1);
}

const clusters = JSON.parse(readFileSync(clustersPath, 'utf8'));
let selected = [];

if (args[0] === '--risk') {
  const risks = new Set((args[1] || '').split(',').map(s => s.trim()));
  selected = clusters.filter(c => risks.has(c.risk));
} else {
  const nums = new Set(args.map(Number).filter(n => n > 0));
  selected = clusters.filter(c => nums.has(c.n));
}

if (!selected.length) {
  console.log('Ningún grupo seleccionado.');
  process.exit(1);
}

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

const indexPath = join(FCE, 'index.json');
const indexMap = new Map(JSON.parse(readFileSync(indexPath, 'utf8')).map(e => [e.id, { ...e }]));
let removed = 0, addedGames = 0, mergedGroups = 0;

console.log(`\nFusionando ${selected.length} grupos...\n`);

for (const group of selected) {
  const canonical = group.canonical;
  const others = group.absorb;
  const canonPath = join(FCE, canonical.id, 'games.pgn');
  if (!existsSync(canonPath)) {
    console.log(`  SKIP #${group.n}: no existe ${canonical.id}`);
    continue;
  }

  let canonRaw = readFileSync(canonPath, 'utf8');
  const seen = new Set();
  const games = [];
  for (const pgn of splitPgn(canonRaw)) {
    const k = gameKey(pgn);
    if (!seen.has(k)) { seen.add(k); games.push(pgn); }
  }

  for (const other of others) {
    const otherPath = join(FCE, other.id, 'games.pgn');
    if (!existsSync(otherPath)) continue;
    const raw = readFileSync(otherPath, 'utf8');
    for (const pgn of splitPgn(raw)) {
      const k = gameKey(pgn);
      if (!seen.has(k)) { seen.add(k); games.push(pgn); addedGames++; }
    }
    rmSync(join(FCE, other.id), { recursive: true, force: true });
    indexMap.delete(other.id);
    removed++;
    console.log(`  #${group.n}: ${other.name} [${other.games}] → ${canonical.name}`);
  }

  const out = games.join('\n\n');
  writeFileSync(canonPath, out, 'utf8');
  const entry = indexMap.get(canonical.id);
  if (entry) {
    indexMap.set(canonical.id, {
      ...entry,
      gameCount: games.length,
      sizeMB: Math.round((Buffer.byteLength(out, 'utf8') / 1048576) * 100) / 100,
    });
  }
  mergedGroups++;
}

const newIndex = [...indexMap.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
writeFileSync(indexPath, JSON.stringify(newIndex, null, 2), 'utf8');

console.log(`\n=== HECHO ===`);
console.log(`Grupos: ${mergedGroups} | Carpetas eliminadas: ${removed} | Partidas nuevas: ${addedGames}`);
console.log(`Jugadores: ${newIndex.length}`);
