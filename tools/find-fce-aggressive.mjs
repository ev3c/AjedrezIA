import { readFileSync, writeFileSync } from 'fs';

const idx = JSON.parse(readFileSync('games/FCE/index.json', 'utf8'));

function normalize(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\([^)]*\)/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
    return { surnames, initial, fullFirst, format: 'comma' };
  }
  const tokens = clean.toLowerCase().split(/\s+/).filter(Boolean);
  return {
    surnames: tokens.slice(0, -1).join(' ') || tokens[0] || '',
    initial: tokens.at(-1)?.[0]?.toUpperCase() || '',
    fullFirst: tokens.at(-1) || '',
    format: 'space',
  };
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

function surnameTokens(surnames) {
  return new Set(surnames.split(' ').filter(t => t.length > 2));
}

function surnameOverlap(a, b) {
  const ta = surnameTokens(a), tb = surnameTokens(b);
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / Math.min(ta.size, tb.size);
}

function isFamilyRisk(pa, pb) {
  if (pa.surnames !== pb.surnames) return false;
  if (!pa.initial || !pb.initial) return false;
  if (pa.initial === pb.initial) return false;
  const aShort = pa.fullFirst.length <= 2;
  const bShort = pb.fullFirst.length <= 2;
  return aShort && bShort;
}

function matchReason(ea, eb) {
  const na = parseName(ea.name), nb = parseName(eb.name);
  const sa = strip(ea.name), sb = strip(eb.name);
  const dist = levenshtein(ea.norm, eb.norm);
  const maxLen = Math.max(ea.norm.length, eb.norm.length);
  const ratio = maxLen ? dist / maxLen : 1;

  if (sa === sb) return { match: true, reason: 'mismo nombre (variante encoding/mayúsculas)', risk: 'alta' };
  if (ea.norm === eb.norm) return { match: true, reason: 'nombre normalizado idéntico', risk: 'alta' };

  if (isFamilyRisk(na, nb)) {
    return { match: true, reason: `mismo apellido, iniciales distintas (${na.initial} vs ${nb.initial})`, risk: 'familia' };
  }

  const ov = surnameOverlap(na.surnames, nb.surnames);

  // Alta: inicial vs nombre completo (misma persona)
  if (ov >= 0.75) {
    if (na.initial && nb.fullFirst.length > 2 && nb.fullFirst.startsWith(na.initial.toLowerCase()) && na.fullFirst.length <= 2) {
      return { match: true, reason: `inicial ${na.initial}. vs nombre ${nb.fullFirst}`, risk: 'alta' };
    }
    if (nb.initial && na.fullFirst.length > 2 && na.fullFirst.startsWith(nb.initial.toLowerCase()) && nb.fullFirst.length <= 2) {
      return { match: true, reason: `inicial ${nb.initial}. vs nombre ${na.fullFirst}`, risk: 'alta' };
    }
  }

  // Alta: typo apellido, mismo nombre completo
  if (na.fullFirst === nb.fullFirst && na.fullFirst.length > 3 && ov >= 0.75) {
    const sd = levenshtein(na.surnames, nb.surnames);
    if (sd <= 2) return { match: true, reason: 'typo en apellido, mismo nombre', risk: 'alta' };
  }

  // Alta: nombres casi idénticos
  if (dist <= 2 || ratio <= 0.06) {
    return { match: true, reason: `casi idénticos (dist ${dist})`, risk: ov >= 0.75 ? 'alta' : 'media' };
  }

  if (ov >= 0.75) {
    if (na.fullFirst && nb.fullFirst && na.fullFirst === nb.fullFirst && na.fullFirst.length > 2) {
      return { match: true, reason: 'mismo nombre completo, apellido parecido', risk: 'media' };
    }
    if (na.initial && nb.initial && na.initial === nb.initial) {
      return { match: true, reason: `mismo apellido e inicial ${na.initial}.`, risk: 'media' };
    }
  }

  if (dist <= 5 || ratio <= 0.18) {
    return { match: true, reason: `nombre muy parecido (dist ${dist}, ratio ${(ratio * 100).toFixed(0)}%)`, risk: 'media' };
  }

  const prefix = ea.norm.length >= 8 && eb.norm.length >= 8 &&
    (ea.norm.startsWith(eb.norm.slice(0, 10)) || eb.norm.startsWith(ea.norm.slice(0, 10)));
  if (prefix && dist <= 8) {
    return { match: true, reason: `prefijo común (dist ${dist})`, risk: 'media' };
  }

  const lastA = na.surnames.split(' ').at(-1) || '';
  const lastB = nb.surnames.split(' ').at(-1) || '';
  if (lastA.length > 4 && lastA === lastB && dist <= 6 && ov >= 0.5) {
    return { match: true, reason: `mismo apellido final "${lastA}", nombres parecidos`, risk: 'media' };
  }

  return { match: false };
}

const entries = idx.map(e => ({
  id: e.id,
  name: e.name,
  norm: normalize(e.name),
  games: e.gameCount,
}));

// Buckets agresivos: último apellido | primeras 2 letras primer nombre
function bucketKey(e) {
  const p = parseName(e.name);
  const parts = p.surnames.split(' ').filter(t => t.length > 2);
  if (parts.length < 1) return null;
  const last = parts.at(-1);
  const first = (p.fullFirst || p.initial || '').slice(0, 2).toLowerCase();
  return `${last}|${first}`;
}

const buckets = new Map();
for (const e of entries) {
  const k = bucketKey(e);
  if (!k) continue;
  if (!buckets.has(k)) buckets.set(k, []);
  buckets.get(k).push(e);
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

const pairReasons = new Map();

for (const [, bucket] of buckets) {
  if (bucket.length < 2 || bucket.length > 30) continue;
  for (let i = 0; i < bucket.length; i++) {
    for (let j = i + 1; j < bucket.length; j++) {
      const r = matchReason(bucket[i], bucket[j]);
      if (r.match) {
        union(bucket[i].id, bucket[j].id);
        const key = [bucket[i].id, bucket[j].id].sort().join('|');
        pairReasons.set(key, r);
      }
    }
  }
}

// Familia: mismo apellido exacto, iniciales de 1 letra distintas
const bySurname = new Map();
for (const e of entries) {
  const p = parseName(e.name);
  if (!p.surnames || p.surnames.length < 4) continue;
  if (!bySurname.has(p.surnames)) bySurname.set(p.surnames, []);
  bySurname.get(p.surnames).push(e);
}

for (const [, bucket] of bySurname) {
  if (bucket.length < 2 || bucket.length > 12) continue;
  for (let i = 0; i < bucket.length; i++) {
    for (let j = i + 1; j < bucket.length; j++) {
      const pa = parseName(bucket[i].name), pb = parseName(bucket[j].name);
      if (isFamilyRisk(pa, pb)) {
        union(bucket[i].id, bucket[j].id);
        const key = [bucket[i].id, bucket[j].id].sort().join('|');
        pairReasons.set(key, { reason: `iniciales distintas (${pa.initial} vs ${pb.initial})`, risk: 'familia' });
      }
    }
  }
}

// También bucket solo por último apellido (más agresivo, límite tamaño)
// DESACTIVADO: generaba mega-clusters incorrectos (varios Garcia distintos)
/*
const byLast = new Map();
...
*/

const clusters = new Map();
for (const e of entries) {
  if (!parent.has(e.id)) continue;
  const root = find(e.id);
  if (!clusters.has(root)) clusters.set(root, []);
  clusters.get(root).push(e);
}

const RISK_ORDER = { alta: 0, media: 1, baja: 2, familia: 3 };

function clusterRisk(group, reasons) {
  if (reasons.some(r => r.risk === 'familia')) return 'familia';
  if (reasons.every(r => r.risk === 'alta')) return 'alta';
  if (reasons.some(r => r.risk === 'alta')) return 'media';
  return reasons[0]?.risk || 'baja';
}

function clusterValid(group) {
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const pa = parseName(group[i].name), pb = parseName(group[j].name);
      const ov = surnameOverlap(pa.surnames, pb.surnames);
      if (ov < 0.75) return false;
      // Rechazar si solo comparten un apellido muy común aislado
      const shared = [...surnameTokens(pa.surnames)].filter(t => surnameTokens(pb.surnames).has(t));
      if (shared.length < 2 && pa.surnames !== pb.surnames) return false;
    }
  }
  return true;
}

function splitLargeCluster(sorted, pairReasons) {
  if (sorted.length <= 4) return [sorted];
  // Descomponer en subgrupos: cada miembro secundario forma un par con el canónico
  const canon = sorted[0];
  return sorted.slice(1).map(other => {
    const key = [canon.id, other.id].sort().join('|');
    return [canon, other, pairReasons.get(key)];
  }).filter(t => t[2]).map(([canon, other, reason]) => [canon, other]);
}

const rawClusters = [];
for (const group of [...clusters.values()].filter(g => g.length > 1)) {
  const sorted = [...group].sort((a, b) => b.games - a.games);
  if (!clusterValid(sorted)) continue;
  const parts = sorted.length > 4
    ? splitLargeCluster(sorted, pairReasons).map(g => g)
    : [sorted];
  for (const part of parts) {
    if (part.length < 2) continue;
    rawClusters.push(part);
  }
}

const output = [];
let num = 0;

for (const sorted of rawClusters) {
  const reasons = [];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const key = [sorted[i].id, sorted[j].id].sort().join('|');
      if (pairReasons.has(key)) reasons.push(pairReasons.get(key));
    }
  }
  const risk = clusterRisk(sorted, reasons);
  const reasonSummary = [...new Set(reasons.map(r => r.reason))].join('; ');
  num++;
  output.push({
    n: num,
    risk,
    players: sorted.length,
    totalGames: sorted.reduce((s, x) => s + x.games, 0),
    reason: reasonSummary,
    canonical: { id: sorted[0].id, name: sorted[0].name, games: sorted[0].games },
    mergeInto: sorted[0].id,
    absorb: sorted.slice(1).map(x => ({ id: x.id, name: x.name, games: x.games })),
    items: sorted.map(x => ({ id: x.id, name: x.name, games: x.games })),
  });
}

output.sort((a, b) => {
  const rd = (RISK_ORDER[a.risk] ?? 9) - (RISK_ORDER[b.risk] ?? 9);
  if (rd) return rd;
  return b.totalGames - a.totalGames;
});
output.forEach((c, i) => { c.n = i + 1; });

writeFileSync('tools/fce-aggressive-clusters.json', JSON.stringify(output, null, 2), 'utf8');

const byRisk = { alta: [], media: [], baja: [], familia: [] };
for (const c of output) byRisk[c.risk].push(c);

let md = `# FCE — Pasada agresiva (${output.length} grupos)\n\n`;
md += `Jugadores actuales: ${entries.length}\n\n`;
md += `**Cómo decidir:** responde con los números a fusionar, p. ej. \`1, 5, 12-20\` o \`todas las de confianza alta\`.\n\n`;
md += `En cada grupo, la carpeta con **más partidas** absorbe las demás.\n\n---\n\n`;

for (const [risk, label] of [['alta', 'Confianza ALTA'], ['media', 'Confianza MEDIA'], ['baja', 'Confianza BAJA'], ['familia', 'RIESGO FAMILIA (hermanos/padre-hijo)']]) {
  const list = byRisk[risk];
  if (!list.length) continue;
  md += `## ${label} (${list.length})\n\n`;
  for (const c of list) {
    md += `### ${c.n}. → ${c.canonical.name} [${c.canonical.games}]\n`;
    md += `- **Motivo:** ${c.reason}\n`;
    for (const a of c.absorb) {
      md += `- + ${a.name} [${a.games}] (\`${a.id}\`)\n`;
    }
    md += '\n';
  }
}

writeFileSync('tools/fce-aggressive-review.md', md, 'utf8');

console.log(`\n=== PASADA AGRESIVA: ${output.length} grupos candidatos ===\n`);
console.log(`  Alta confianza:  ${byRisk.alta.length}`);
console.log(`  Media:           ${byRisk.media.length}`);
console.log(`  Baja:            ${byRisk.baja.length}`);
console.log(`  Riesgo familia:  ${byRisk.familia.length}`);
console.log(`\nInformes: tools/fce-aggressive-clusters.json`);
console.log(`          tools/fce-aggressive-review.md\n`);

for (const risk of ['alta', 'media', 'baja', 'familia']) {
  const list = byRisk[risk];
  if (!list.length) continue;
  const label = { alta: 'ALTA', media: 'MEDIA', baja: 'BAJA', familia: 'FAMILIA' }[risk];
  console.log(`--- ${label} (${list.length}) ---`);
  list.slice(0, risk === 'familia' ? 25 : 15).forEach(c => {
    const abs = c.absorb.map(a => `${a.name} [${a.games}]`).join(' + ');
    console.log(`${String(c.n).padStart(3)}. [${label}] ${c.canonical.name} [${c.canonical.games}] ← ${abs}`);
  });
  if (list.length > (risk === 'familia' ? 25 : 15)) console.log(`     ... y ${list.length - (risk === 'familia' ? 25 : 15)} más`);
  console.log('');
}
