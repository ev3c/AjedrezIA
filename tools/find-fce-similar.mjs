import { readFileSync, writeFileSync } from 'fs';

const idx = JSON.parse(readFileSync('games/FCE/index.json', 'utf8'));

function normalize(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bucketKey(norm) {
  const parts = norm.split(' ').filter(p => p.length > 1 && !['de', 'del', 'la', 'los', 'las', 'i', 'y', 'el'].includes(p));
  if (parts.length < 2) return null;
  const last = parts[parts.length - 1];
  const first = parts[0].slice(0, 3);
  return `${last}|${first}`;
}

function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[m][n];
}

const entries = idx.map(e => ({
  id: e.id,
  name: e.name,
  norm: normalize(e.name),
  games: e.gameCount,
}));

const clusters = [];
const used = new Set();

// 1) Mismo nombre normalizado exacto
const byNorm = new Map();
for (const e of entries) {
  if (!byNorm.has(e.norm)) byNorm.set(e.norm, []);
  byNorm.get(e.norm).push(e);
}
for (const [, group] of byNorm) {
  if (group.length > 1) {
    clusters.push({ reason: 'nombre normalizado idéntico', items: group });
    group.forEach(g => used.add(g.id));
  }
}

// 2) Dentro de buckets apellido+inicio nombre
const buckets = new Map();
for (const e of entries) {
  const k = bucketKey(e.norm);
  if (!k) continue;
  if (!buckets.has(k)) buckets.set(k, []);
  buckets.get(k).push(e);
}

for (const [, bucket] of buckets) {
  if (bucket.length < 2) continue;
  const localUsed = new Set();
  for (let i = 0; i < bucket.length; i++) {
    if (localUsed.has(bucket[i].id)) continue;
    const group = [bucket[i]];
    localUsed.add(bucket[i].id);
    for (let j = i + 1; j < bucket.length; j++) {
      if (localUsed.has(bucket[j].id)) continue;
      const a = bucket[i].norm, b = bucket[j].norm;
      const dist = levenshtein(a, b);
      const maxLen = Math.max(a.length, b.length);
      const ratio = maxLen ? dist / maxLen : 1;
      const prefix = a.length >= 10 && b.length >= 10 && (a.startsWith(b.slice(0, 12)) || b.startsWith(a.slice(0, 12)));
      if (dist <= 3 || ratio <= 0.1 || (prefix && dist <= 6)) {
        group.push(bucket[j]);
        localUsed.add(bucket[j].id);
      }
    }
    if (group.length > 1) {
      const ids = group.map(g => g.id).sort().join('|');
      if (!clusters.some(c => c.key === ids)) {
        clusters.push({ reason: 'nombre muy parecido', key: ids, items: group });
      }
    }
  }
}

const unique = [];
const seen = new Set();
for (const c of clusters.sort((a, b) => b.items.reduce((s, x) => s + x.games, 0) - a.items.reduce((s, x) => s + x.games, 0))) {
  const ids = c.items.map(i => i.id).sort().join('|');
  if (seen.has(ids)) continue;
  seen.add(ids);
  unique.push({
    reason: c.reason,
    players: c.items.length,
    totalGames: c.items.reduce((s, x) => s + x.games, 0),
    items: c.items.sort((a, b) => b.games - a.games).map(i => ({ id: i.id, name: i.name, games: i.games })),
  });
}

writeFileSync('tools/fce-similar-clusters.json', JSON.stringify(unique, null, 2), 'utf8');
console.log(`Clusters: ${unique.length}`);
unique.slice(0, 40).forEach((c, i) => {
  const names = c.items.map(x => `${x.name} [${x.games}]`).join('  |  ');
  console.log(`${String(i + 1).padStart(2)}. (${c.players} jug., ${c.totalGames} part.) ${names}`);
});
