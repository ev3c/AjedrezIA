import { readFileSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const FCE = 'games/FCE';
const indexPath = join(FCE, 'index.json');
let idx = JSON.parse(readFileSync(indexPath, 'utf8'));

function normalize(name) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function strip(name) {
  return normalize(name).replace(/\s+/g, '');
}

function parseName(name) {
  const clean = name.replace(/\([^)]*\)/g, '').trim();
  const parts = clean.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    const surnames = parts[0].toLowerCase();
    const rest = parts[1].replace(/\./g, ' ').trim().split(/\s+/).filter(Boolean);
    const initial = rest[0]?.[0]?.toUpperCase() || '';
    const fullFirst = rest.join(' ').toLowerCase().replace(/[^a-z\s]/g, '').trim();
    return { surnames, initial, fullFirst };
  }
  const tokens = clean.toLowerCase().split(/\s+/).filter(Boolean);
  return {
    surnames: tokens.slice(0, -1).join(' ') || tokens[0] || '',
    initial: tokens.at(-1)?.[0]?.toUpperCase() || '',
    fullFirst: tokens.at(-1) || '',
  };
}

function surnameOverlap(a, b) {
  const ta = new Set(a.surnames.split(' ').filter(t => t.length > 2));
  const tb = new Set(b.surnames.split(' ').filter(t => t.length > 2));
  if (!ta.size || !tb.size) return false;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter >= Math.min(ta.size, tb.size) * 0.75;
}

function shouldMerge(ea, eb) {
  const na = parseName(ea.name), nb = parseName(eb.name);
  const sa = strip(ea.name), sb = strip(eb.name);

  // Familia: mismo apellido exacto, iniciales distintas de una letra
  if (na.surnames === nb.surnames && na.initial && nb.initial &&
      na.initial !== nb.initial && na.fullFirst.length <= 2 && nb.fullFirst.length <= 2) {
    return false;
  }

  // Mismo nombre normalizado exacto (strip)
  if (sa === sb) return true;

  // Mismo apellido, inicial vs nombre completo
  if (surnameOverlap(na, nb)) {
    if (na.initial && nb.fullFirst.length > 2 && nb.fullFirst.startsWith(na.initial.toLowerCase()) && na.fullFirst.length <= 2)
      return true;
    if (nb.initial && na.fullFirst.length > 2 && na.fullFirst.startsWith(nb.initial.toLowerCase()) && nb.fullFirst.length <= 2)
      return true;
    if (na.fullFirst && nb.fullFirst && na.fullFirst === nb.fullFirst) {
      if (Math.abs(sa.length - sb.length) <= 4) return true;
      if (ea.name === ea.name.toUpperCase() !== (eb.name === eb.name.toUpperCase())) return true;
    }
  }

  // Typo mismo nombre+apellido
  if (na.fullFirst === nb.fullFirst && na.fullFirst.length > 3) {
    let diff = 0;
    const a = na.surnames, b = nb.surnames;
    for (let i = 0; i < Math.max(a.length, b.length); i++) if ((a[i] || '') !== (b[i] || '')) diff++;
    if (diff <= 2) return true;
  }

  // Levenshtein muy bajo en strip completo
  if (sa.length > 10 && sb.length > 10) {
    let dist = 0;
    const max = Math.max(sa.length, sb.length);
    for (let i = 0; i < max; i++) if ((sa[i] || '') !== (sb[i] || '')) dist++;
    if (dist <= 2) return true;
  }

  return false;
}

function bucketKey(norm) {
  const parts = norm.split(' ').filter(p => p.length > 2);
  if (parts.length < 2) return null;
  return parts.slice(-2).join('|');
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

// --- Fase 1: encontrar clusters ---
const entries = idx.map(e => ({
  id: e.id, name: e.name, games: e.gameCount, norm: normalize(e.name), key: bucketKey(normalize(e.name)),
}));

const buckets = new Map();
for (const e of entries) {
  if (!e.key) continue;
  if (!buckets.has(e.key)) buckets.set(e.key, []);
  buckets.get(e.key).push(e);
}

const parent = new Map();
function find(x) {
  if (!parent.has(x)) parent.set(x, x);
  if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));
  return parent.get(x);
}
function union(a, b) {
  const ra = find(a), rb = find(b);
  if (ra !== rb) parent.set(rb, ra);
}

const pairList = [];
for (const [, bucket] of buckets) {
  if (bucket.length < 2) continue;
  const uniq = [...new Map(bucket.map(e => [e.id, e])).values()];
  for (let i = 0; i < uniq.length; i++) {
    for (let j = i + 1; j < uniq.length; j++) {
      if (shouldMerge(uniq[i], uniq[j])) {
        union(uniq[i].id, uniq[j].id);
        pairList.push({ a: uniq[i], b: uniq[j] });
      }
    }
  }
}

const clusters = new Map();
for (const e of entries) {
  if (!parent.has(e.id)) continue;
  const root = find(e.id);
  if (!clusters.has(root)) clusters.set(root, []);
  clusters.get(root).push(e);
}
const toMerge = [...clusters.values()].filter(c => c.length > 1)
  .map(c => [...c].sort((a, b) => b.games - a.games));

console.log(`\n=== COINCIDENCIAS ENCONTRADAS: ${toMerge.length} grupos ===\n`);
toMerge.forEach((group, i) => {
  const canon = group[0];
  const others = group.slice(1);
  console.log(`${i + 1}. → ${canon.name} [${canon.games}]  (carpeta: ${canon.id})`);
  others.forEach(o => console.log(`      + ${o.name} [${o.games}]  (${o.id})`));
  console.log('');
});

// --- Fase 2: fusionar (más partidas absorbe menos) ---
const indexMap = new Map(idx.map(e => [e.id, { ...e }]));
let removed = 0;
let addedGames = 0;
let mergedGroups = 0;

for (const group of toMerge) {
  const canonical = group[0];
  const others = group.slice(1);
  const canonPath = join(FCE, canonical.id, 'games.pgn');

  let canonRaw;
  try { canonRaw = readFileSync(canonPath, 'utf8'); } catch { continue; }

  const seen = new Set();
  const games = [];
  for (const pgn of splitPgn(canonRaw)) {
    const k = gameKey(pgn);
    if (!seen.has(k)) { seen.add(k); games.push(pgn); }
  }

  for (const other of others) {
    try {
      const raw = readFileSync(join(FCE, other.id, 'games.pgn'), 'utf8');
      for (const pgn of splitPgn(raw)) {
        const k = gameKey(pgn);
        if (!seen.has(k)) { seen.add(k); games.push(pgn); addedGames++; }
      }
      rmSync(join(FCE, other.id), { recursive: true, force: true });
      indexMap.delete(other.id);
      removed++;
    } catch { /* skip */ }
  }

  const out = games.join('\n\n');
  writeFileSync(canonPath, out, 'utf8');
  const sizeMB = Math.round((Buffer.byteLength(out, 'utf8') / 1048576) * 100) / 100;
  const canon = indexMap.get(canonical.id);
  indexMap.set(canonical.id, { ...canon, gameCount: games.length, sizeMB });
  mergedGroups++;
}

const newIndex = [...indexMap.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
writeFileSync(indexPath, JSON.stringify(newIndex, null, 2), 'utf8');

writeFileSync('tools/fce-merge-pass2-report.json', JSON.stringify(toMerge.map(g => ({
  canonical: { id: g[0].id, name: g[0].name, games: g[0].gameCount },
  merged: g.slice(1).map(x => ({ id: x.id, name: x.name, games: x.gameCount })),
})), null, 2), 'utf8');

console.log('=== FUSIÓN COMPLETADA ===');
console.log(`Grupos fusionados: ${mergedGroups}`);
console.log(`Carpetas eliminadas: ${removed}`);
console.log(`Partidas añadidas: ${addedGames}`);
console.log(`Jugadores finales: ${newIndex.length}`);
