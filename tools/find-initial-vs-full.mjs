import { readFileSync, writeFileSync } from 'fs';

const idx = JSON.parse(readFileSync('games/FCE/index.json', 'utf8'));

function parseName(name) {
  const clean = name.replace(/\([^)]*\)/g, '').trim();
  const parts = clean.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    const surnames = parts[0];
    const rest = parts[1].replace(/\./g, ' ').trim().split(/\s+/).filter(Boolean);
    const token = rest[0] || '';
    const isInitial = /^[A-Za-zÁÉÍÓÚÑÜ]\.?$/i.test(token) || (token.length <= 2 && token.endsWith('.'));
    const initial = token.replace(/\./g, '')[0]?.toUpperCase() || '';
    const fullFirst = rest.join(' ').replace(/\./g, '').trim();
    return { surnames, initial, fullFirst, isInitial, format: 'comma' };
  }
  return { surnames: '', initial: '', fullFirst: '', isInitial: false, format: 'other' };
}

function norm(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function surnameKey(name) {
  return norm(parseName(name).surnames);
}

function isInitialOnly(p) {
  if (!p.initial) return false;
  const ff = norm(p.fullFirst);
  return ff.length <= 2 || /^[a-z]$/.test(ff) || p.isInitial;
}

function fullNameMatchesInitial(pFull, initial) {
  const ff = norm(pFull.fullFirst);
  const ini = initial.toLowerCase();
  return ff.length > 2 && ff.startsWith(ini);
}

// Agrupar por apellidos exactos (normalizados)
const bySurname = new Map();
for (const e of idx) {
  const sk = surnameKey(e.name);
  if (!sk || sk.length < 4) continue;
  if (!bySurname.has(sk)) bySurname.set(sk, []);
  bySurname.get(sk).push(e);
}

const pairs = [];
const clusters = [];

for (const [, group] of bySurname) {
  if (group.length < 2) continue;
  const initials = group.filter(e => isInitialOnly(parseName(e.name)));
  const fulls = group.filter(e => {
    const p = parseName(e.name);
    return !isInitialOnly(p) && p.fullFirst.length > 2;
  });

  for (const ei of initials) {
    const pi = parseName(ei.name);
    const matches = fulls.filter(ef => fullNameMatchesInitial(parseName(ef.name), pi.initial));
    if (matches.length === 0) continue;

    const all = [ei, ...matches].sort((a, b) => b.gameCount - a.gameCount);
    clusters.push({
      reason: `inicial ${pi.initial}. vs nombre completo`,
      surnames: pi.surnames,
      totalGames: all.reduce((s, x) => s + x.gameCount, 0),
      canonical: { id: all[0].id, name: all[0].name, games: all[0].gameCount },
      absorb: all.slice(1).map(x => ({ id: x.id, name: x.name, games: x.gameCount })),
      items: all.map(x => ({ id: x.id, name: x.name, games: x.gameCount })),
    });

    for (const ef of matches) {
      pairs.push({ initial: ei, full: ef });
    }
  }
}

clusters.sort((a, b) => b.totalGames - a.totalGames);
clusters.forEach((c, i) => { c.n = i + 1; });

writeFileSync('tools/fce-initial-vs-full.json', JSON.stringify(clusters, null, 2), 'utf8');

// Cuántos ya estaban en aggressive clusters
const aggressive = JSON.parse(readFileSync('tools/fce-aggressive-clusters.json', 'utf8'));
const aggressiveIds = new Set();
for (const c of aggressive) {
  aggressiveIds.add(c.canonical?.id);
  for (const a of c.absorb || []) aggressiveIds.add(a.id);
  for (const i of c.items || []) aggressiveIds.add(i.id);
}

const missed = clusters.filter(c =>
  c.items.every(i => !aggressiveIds.has(i.id)) ||
  !c.items.some(i => aggressiveIds.has(i.id))
);

console.log(`\n=== INICIAL vs NOMBRE COMPLETO (mismo apellido) ===\n`);
console.log(`Grupos encontrados: ${clusters.length}`);
console.log(`Parejas: ${pairs.length}`);
console.log(`NO propuestos en pasada agresiva: ${missed.length}`);
console.log(`\nTop 30 no propuestos:\n`);

missed.slice(0, 30).forEach(c => {
  const abs = c.absorb.map(a => `${a.name} [${a.games}]`).join(' + ');
  console.log(`${String(c.n).padStart(4)}. ${c.canonical.name} [${c.canonical.games}] ← ${abs}`);
});

// Stats: cuántos son patrón id empieza igual
const prefixMissed = missed.filter(c => {
  const ids = c.items.map(i => i.id);
  const prefixes = ids.map(id => id.replace(/-[a-z]?$/, '').replace(/-[a-z]{1,2}$/, ''));
  return ids.every((id, i) => id.split('-').slice(0, -1).join('-') === ids[0].split('-').slice(0, -1).join('-'));
});
console.log(`\nCon mismo prefijo de carpeta (texto-texto-*): ${prefixMissed.length} de ${missed.length} no propuestos`);
