import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const idx = JSON.parse(readFileSync('games/FCE/index.json', 'utf8'));

function parseName(name) {
  const clean = name.replace(/\([^)]*\)/g, '').trim();
  const parts = clean.split(',').map(s => s.trim());
  if (parts.length >= 2) {
    const surnames = parts[0];
    const rest = parts[1].replace(/\./g, ' ').trim().split(/\s+/).filter(Boolean);
    const token = rest[0] || '';
    const bare = token.replace(/\./g, '');
    const isSingleInitial = bare.length === 1;
    const isMultiInitial = bare.length === 2 && /^[A-Za-z]{2}$/.test(bare);
    const initial = bare[0]?.toUpperCase() || '';
    const multiInitial = isMultiInitial ? bare.toUpperCase() : '';
    const fullFirst = rest.join(' ').replace(/\./g, '').trim();
    return { surnames, initial, multiInitial, isSingleInitial, isMultiInitial, fullFirst, format: 'comma' };
  }
  const tokens = clean.split(/\s+/).filter(Boolean);
  return {
    surnames: tokens.slice(0, -1).join(' ') || '',
    initial: tokens.at(-1)?.[0]?.toUpperCase() || '',
    multiInitial: '',
    isSingleInitial: false,
    isMultiInitial: false,
    fullFirst: tokens.at(-1) || '',
    format: 'space',
  };
}

function norm(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function surnameKey(name) {
  return norm(parseName(name).surnames);
}

function isInitialEntry(p) {
  const ff = norm(p.fullFirst);
  return p.isSingleInitial || ff.length <= 1;
}

function fullStartsWithInitial(pFull, letter) {
  const ff = norm(pFull.fullFirst);
  return ff.length > 2 && ff.startsWith(letter.toLowerCase());
}

function fullStartsWithMultiInitial(pFull, multi) {
  const ff = norm(pFull.fullFirst);
  if (ff.length <= 2) return false;
  const words = ff.split(/\s+/);
  const first = words[0] || '';
  const second = words[1]?.[0] || '';
  const combo = (first[0] || '') + second;
  return combo === multi.toLowerCase() || first.startsWith(multi.toLowerCase().slice(0, 1)) && multi.length === 2;
}

function folderExists(id) {
  return existsSync(join('games/FCE', id, 'games.pgn'));
}

// Agrupar por apellido normalizado
const bySurname = new Map();
for (const e of idx) {
  const sk = surnameKey(e.name);
  if (!sk || sk.length < 3) continue;
  if (!bySurname.has(sk)) bySurname.set(sk, []);
  bySurname.get(sk).push(e);
}

const output = [];

for (const [, group] of bySurname) {
  if (group.length < 2) continue;

  const parsed = group.map(e => ({ e, p: parseName(e.name) }));

  // Familia: 2+ iniciales de 1 letra distintas → saltar todo el grupo
  const singleInitials = new Set(
    parsed.filter(x => isInitialEntry(x.p) && x.p.initial).map(x => x.p.initial)
  );
  if (singleInitials.size >= 2) continue;

  const initialEntries = parsed.filter(x => isInitialEntry(x.p) && x.p.initial);
  const multiInitialEntries = parsed.filter(x => x.p.isMultiInitial);
  const fullEntries = parsed.filter(x => !isInitialEntry(x.p) && x.p.fullFirst.length > 2);

  const matches = new Map(); // initial entry id -> full entries

  for (const ie of initialEntries) {
    const hits = fullEntries.filter(fe =>
      fullStartsWithInitial(fe.p, ie.p.initial) &&
      ie.e.id !== fe.e.id
    );
    if (hits.length) matches.set(ie.e.id, { ie, hits });
  }

  for (const mie of multiInitialEntries) {
    const hits = fullEntries.filter(fe =>
      fullStartsWithMultiInitial(fe.p, mie.p.multiInitial) &&
      mie.e.id !== fe.e.id
    );
    if (hits.length) matches.set(mie.e.id, { ie: mie, hits });
  }

  if (!matches.size) continue;

  // Un cluster por apellido: canónico = más partidas entre todos
  const allMembers = new Set();
  for (const { ie, hits } of matches.values()) {
    allMembers.add(ie.e.id);
    hits.forEach(h => allMembers.add(h.e.id));
  }
  const members = [...allMembers].map(id => group.find(e => e.id === id)).filter(Boolean);
  if (members.length < 2) continue;

  // Solo si al menos una carpeta absorbible existe
  const sorted = [...members].sort((a, b) => b.gameCount - a.gameCount);
  const absorb = sorted.slice(1).filter(e => folderExists(e.id));
  if (!absorb.length) continue;

  const canonical = sorted[0];
  const reasons = [];
  for (const { ie, hits } of matches.values()) {
    if (!allMembers.has(ie.e.id)) continue;
    for (const h of hits) {
      if (!allMembers.has(h.e.id)) continue;
      if (ie.p.isMultiInitial) {
        reasons.push(`${ie.p.multiInitial}. ↔ ${h.p.fullFirst}`);
      } else {
        reasons.push(`${ie.p.initial}. ↔ ${h.p.fullFirst}`);
      }
    }
  }

  const risk = singleInitials.size === 1 && initialEntries.length === 1 ? 'alta' : 'media';

  output.push({
    risk,
    surnames: parsed[0].p.surnames,
    totalGames: sorted.reduce((s, x) => s + x.gameCount, 0),
    reason: [...new Set(reasons)].join('; '),
    canonical: { id: canonical.id, name: canonical.name, games: canonical.gameCount },
    absorb: absorb.map(x => ({ id: x.id, name: x.name, games: x.gameCount })),
    items: sorted.map(x => ({ id: x.id, name: x.name, games: x.gameCount })),
  });
}

output.sort((a, b) => {
  const rd = (a.risk === 'alta' ? 0 : 1) - (b.risk === 'alta' ? 0 : 1);
  if (rd) return rd;
  return b.totalGames - a.totalGames;
});
output.forEach((c, i) => { c.n = i + 1; });

writeFileSync('tools/fce-initial-pass-clusters.json', JSON.stringify(output, null, 2), 'utf8');

const alta = output.filter(c => c.risk === 'alta');
const media = output.filter(c => c.risk === 'media');

let md = `# FCE — Inicial vs nombre completo (${output.length} grupos)\n\n`;
md += `Jugadores actuales: ${idx.length}\n\n`;
md += `Criterio: mismo apellido, **una sola inicial** de 1 letra (o 2 como JA.) y nombre completo que empiece por esa letra.\n`;
md += `Excluidos: familias con 2+ iniciales distintas (C. + F., etc.).\n\n`;
md += `Responde con números para fusionar, p. ej. \`todas las alta\` o \`1-50\`.\n\n---\n\n`;

for (const [risk, label] of [['alta', 'Confianza ALTA'], ['media', 'Confianza MEDIA']]) {
  const list = risk === 'alta' ? alta : media;
  if (!list.length) continue;
  md += `## ${label} (${list.length})\n\n`;
  for (const c of list) {
    md += `### ${c.n}. → ${c.canonical.name} [${c.canonical.games}]\n`;
    md += `- **Apellido:** ${c.surnames}\n`;
    md += `- **Motivo:** ${c.reason}\n`;
    for (const a of c.absorb) {
      md += `- + ${a.name} [${a.games}] (\`${a.id}\`)\n`;
    }
    md += '\n';
  }
}

writeFileSync('tools/fce-initial-pass-review.md', md, 'utf8');

console.log(`\n=== PASADA INICIAL vs NOMBRE COMPLETO ===\n`);
console.log(`Grupos: ${output.length}  (alta: ${alta.length}, media: ${media.length})`);
console.log(`Informes: tools/fce-initial-pass-clusters.json`);
console.log(`          tools/fce-initial-pass-review.md\n`);

for (const list of [alta, media]) {
  if (!list.length) continue;
  const label = list[0].risk.toUpperCase();
  console.log(`--- ${label} (primeras 25) ---`);
  list.slice(0, 25).forEach(c => {
    const abs = c.absorb.map(a => `${a.name} [${a.games}]`).join(' + ');
    console.log(`${String(c.n).padStart(4)}. ${c.canonical.name} [${c.canonical.games}] ← ${abs}`);
  });
  if (list.length > 25) console.log(`     ... y ${list.length - 25} más\n`);
}
