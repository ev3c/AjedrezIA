import { readFileSync, writeFileSync } from 'fs';

const idx = JSON.parse(readFileSync('games/FCE/index.json', 'utf8'));

function normalize(name) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseName(name) {
  const clean = name.replace(/\([^)]*\)/g, '').trim();
  const parts = clean.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    const surnames = parts[0].toLowerCase();
    const rest = parts[1].replace(/\./g, ' ').trim().split(/\s+/).filter(Boolean);
    const initial = rest[0]?.[0]?.toUpperCase() || '';
    const first = rest[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
    const fullFirst = rest.join(' ').toLowerCase().replace(/[^a-z\s]/g, '').trim();
    return { surnames, initial, first, fullFirst, format: 'comma' };
  }
  const tokens = clean.toLowerCase().split(/\s+/).filter(Boolean);
  return {
    surnames: tokens.slice(0, -1).join(' ') || tokens[0] || '',
    initial: tokens[tokens.length - 1]?.[0]?.toUpperCase() || '',
    first: tokens[tokens.length - 1]?.toLowerCase() || '',
    fullFirst: tokens[tokens.length - 1] || '',
    format: 'space',
  };
}

function surnameOverlap(a, b) {
  const ta = new Set(a.surnames.split(' ').filter(t => t.length > 2));
  const tb = new Set(b.surnames.split(' ').filter(t => t.length > 2));
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter >= Math.min(ta.size, tb.size) * 0.6;
}

function classify(a, b, ea, eb) {
  const na = parseName(ea.name), nb = parseName(eb.name);
  const stripA = normalize(ea.name).replace(/\s/g, '');
  const stripB = normalize(eb.name).replace(/\s/g, '');

  // Mismo apellido compuesto, variante encoding/mayúsculas
  if (surnameOverlap(na, nb) && na.fullFirst && nb.fullFirst) {
    const fA = na.fullFirst.replace(/\s/g, '');
    const fB = nb.fullFirst.replace(/\s/g, '');
    if (fA === fB || fA.startsWith(fB) || fB.startsWith(fA)) {
      if (ea.name === ea.name.toUpperCase() !== (eb.name === eb.name.toUpperCase()))
        return { verdict: 'unir', reason: 'Mismo nombre, variante MAYÚSCULAS/acentos' };
      if (Math.abs(stripA.length - stripB.length) <= 3)
        return { verdict: 'unir', reason: 'Mismo nombre, typo o encoding' };
    }
  }

  // Inicial vs nombre completo MISMO apellido
  if (surnameOverlap(na, nb)) {
    if (na.initial && nb.fullFirst.length > 2 && nb.fullFirst.startsWith(na.initial.toLowerCase()) && na.fullFirst.length <= 2)
      return { verdict: 'unir', reason: `Inicial ${na.initial}. vs nombre completo` };
    if (nb.initial && na.fullFirst.length > 2 && na.fullFirst.startsWith(nb.initial.toLowerCase()) && nb.fullFirst.length <= 2)
      return { verdict: 'unir', reason: `Inicial ${nb.initial}. vs nombre completo` };
  }

  // Apellido casi igual, nombre igual (typo apellido)
  if (na.fullFirst === nb.fullFirst && na.fullFirst.length > 3) {
    let diff = 0;
    const sa = na.surnames, sb = nb.surnames;
    if (sa !== sb) {
      const max = Math.max(sa.length, sb.length);
      for (let i = 0; i < max; i++) if ((sa[i] || '') !== (sb[i] || '')) diff++;
      if (diff <= 2) return { verdict: 'unir', reason: 'Typo en apellido' };
    }
  }

  // Mismo apellido, iniciales distintas => familiar
  if (na.surnames === nb.surnames && na.initial && nb.initial && na.initial !== nb.initial)
    return { verdict: 'no unir', reason: 'Mismo apellido, iniciales distintas (familia)' };

  // Apellidos parecidos pero personas distintas con misma inicial
  if (na.initial === nb.initial && na.initial && !surnameOverlap(na, nb))
    return { verdict: 'no unir', reason: 'Misma inicial, apellidos distintos (personas diferentes)' };

  return null;
}

const entries = idx.map(e => ({ id: e.id, name: e.name, games: e.gameCount, norm: normalize(e.name) }));

// Bucket por cada palabra larga del apellido
const buckets = new Map();
for (const e of entries) {
  const words = [...new Set(e.norm.split(' ').filter(w => w.length > 3))];
  for (const w of words) {
    if (!buckets.has(w)) buckets.set(w, []);
    buckets.get(w).push(e);
  }
}

const results = { unir: [], noUnir: [] };
const seen = new Set();

for (const [, bucket] of buckets) {
  if (bucket.length < 2 || bucket.length > 80) continue;
  const uniq = [...new Map(bucket.map(e => [e.id, e])).values()];
  for (let i = 0; i < uniq.length; i++) {
    for (let j = i + 1; j < uniq.length; j++) {
      const a = uniq[i], b = uniq[j];
      const key = [a.id, b.id].sort().join('|');
      if (seen.has(key)) continue;

      const c = classify(a, b, a, b);
      if (!c) continue;
      seen.add(key);

      const item = {
        reason: c.reason,
        totalGames: a.games + b.games,
        a: { id: a.id, name: a.name, games: a.games },
        b: { id: b.id, name: b.name, games: b.games },
      };
      if (c.verdict === 'unir') results.unir.push(item);
      else if (c.verdict === 'no unir') results.noUnir.push(item);
    }
  }
}

results.unir.sort((a, b) => b.totalGames - a.totalGames);
results.noUnir.sort((a, b) => b.totalGames - a.totalGames);

writeFileSync('tools/fce-doubtful-cases.json', JSON.stringify(results, null, 2), 'utf8');
console.log(`Recomendado UNIR: ${results.unir.length}`);
console.log(`NO unir (familiares): ${results.noUnir.length}`);
console.log('\n--- RECOMENDADO UNIR (top 30) ---');
results.unir.slice(0, 30).forEach((d, i) => {
  console.log(`${i+1}. [${d.reason}]`);
  console.log(`   ${d.a.name} [${d.a.games}]  +  ${d.b.name} [${d.b.games}]`);
});
console.log('\n--- NO UNIR - familiares (top 15) ---');
results.noUnir.slice(0, 15).forEach((d, i) => {
  console.log(`${i+1}. ${d.a.name} [${d.a.games}]  |  ${d.b.name} [${d.b.games}]`);
});
