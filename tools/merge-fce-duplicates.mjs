import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const FCE = 'games/FCE';
const indexPath = join(FCE, 'index.json');
const clustersPath = 'tools/fce-similar-clusters.json';

const idx = JSON.parse(readFileSync(indexPath, 'utf8'));
const data = JSON.parse(readFileSync(clustersPath, 'utf8'));

function strip(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
}

function isFamilyCluster(items) {
  const inits = items.map(i => {
    const m = i.name.match(/,\s*([A-Za-z])\./);
    return m ? m[1].toUpperCase() : '';
  }).filter(Boolean);
  return inits.length >= 2 && new Set(inits).size === inits.length;
}

function isHighConfidence(c) {
  const items = c.items;
  if (isFamilyCluster(items) && items.length > 2) return false;
  if (items.length === 2 && isFamilyCluster(items)) {
    const ma = items[0].name.match(/,\s*([A-Za-z])\./);
    const mb = items[1].name.match(/,\s*([A-Za-z])\./);
    if (ma && mb && ma[1] !== mb[1]) return false;
  }
  const reasons = [];
  if (items.some(x => /[?]/.test(x.name))) reasons.push('raro');
  if (items.some(x => x.name === x.name.toUpperCase()) && items.some(x => x.name !== x.name.toUpperCase())) reasons.push('case');
  const stripped = items.map(i => strip(i.name));
  if (new Set(stripped).size < items.length) reasons.push('letters');
  if (items.some(x => !x.name.includes(',')) && items.some(x => x.name.includes(','))) reasons.push('initial');
  if (items.length === 2) {
    const sa = stripped[0], sb = stripped[1];
    if (sa.length > 8 && sb.length > 8) {
      let d = 0;
      for (let i = 0; i < Math.max(sa.length, sb.length); i++) if ((sa[i] || '') !== (sb[i] || '')) d++;
      if (d <= 2) reasons.push('typo');
    }
  }
  return reasons.length > 0;
}

const toMerge = data.filter(isHighConfidence);
console.log(`Grupos a unir: ${toMerge.length}`);

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

const indexMap = new Map(idx.map(e => [e.id, { ...e }]));
let mergedGroups = 0;
let removedFolders = 0;
let mergedGames = 0;

for (const cluster of toMerge) {
  const items = [...cluster.items].sort((a, b) => b.games - a.games);
  const canonical = items[0];
  const others = items.slice(1);
  if (!others.length) continue;

  const canonDir = join(FCE, canonical.id, 'games.pgn');
  let canonRaw = '';
  try { canonRaw = readFileSync(canonDir, 'utf8'); } catch { continue; }

  const seen = new Set();
  const games = [];
  for (const pgn of splitPgn(canonRaw)) {
    const k = gameKey(pgn);
    if (!seen.has(k)) { seen.add(k); games.push(pgn); }
  }

  for (const other of others) {
    const otherPath = join(FCE, other.id, 'games.pgn');
    try {
      const raw = readFileSync(otherPath, 'utf8');
      for (const pgn of splitPgn(raw)) {
        const k = gameKey(pgn);
        if (!seen.has(k)) { seen.add(k); games.push(pgn); mergedGames++; }
      }
      rmSync(join(FCE, other.id), { recursive: true, force: true });
      indexMap.delete(other.id);
      removedFolders++;
    } catch { /* ya no existe */ }
  }

  const out = games.join('\n\n');
  writeFileSync(canonDir, out, 'utf8');
  const sizeMB = Math.round((Buffer.byteLength(out, 'utf8') / 1048576) * 100) / 100;
  indexMap.set(canonical.id, {
    id: canonical.id,
    name: canonical.name,
    file: `${canonical.id}/games.pgn`,
    gameCount: games.length,
    sizeMB,
  });
  mergedGroups++;
}

const newIndex = [...indexMap.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
writeFileSync(indexPath, JSON.stringify(newIndex, null, 2), 'utf8');

console.log(`Grupos unidos: ${mergedGroups}`);
console.log(`Carpetas eliminadas: ${removedFolders}`);
console.log(`Partidas añadidas por fusión: ${mergedGames}`);
console.log(`Jugadores finales: ${newIndex.length}`);
