import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const cases = [
  { n: 109, note: 'Ya fusionado en pasada inicial' },
  { n: 110, canon: 'fernandez-fernando', absorb: ['fernandez', 'fernandez-felix'] },
  { n: 122, note: 'Parcialmente fusionado (Josep M ya absorbido)' },
  { n: 129, note: 'Pablo ya no existe' },
  { n: 130, note: 'Joachim ya no existe' },
  { n: 161, note: 'Ya fusionado en MEDIA inicial → moyano-morales-fx' },
  { n: 169, note: 'Ya fusionado en MEDIA inicial → torner-planell-jr' },
  { n: 171, note: 'Ya fusionado o eliminado' },
  { n: 174, canon: 'cifuentes-maria-del-pilar', absorb: ['cifuentes-manuel'] },
  { n: 182, canon: 'massot-manuel', absorb: ['massot-max'] },
  { n: 183, canon: 'oliver-joaquim', absorb: ['oliver-jorge'] },
];

function splitPgn(raw) {
  return raw.split(/(?=\[Event\s+")/).map(b => b.trim()).filter(b => b.startsWith('[Event'));
}
function hdr(pgn, tag) {
  const m = pgn.match(new RegExp(`^\\[${tag}\\s+"([^"]*)"\\]`, 'm'));
  return m ? m[1].trim() : '';
}
function summarize(id) {
  const p = join('games/FCE', id, 'games.pgn');
  if (!existsSync(p)) return null;
  const games = splitPgn(readFileSync(p, 'utf8'));
  return games.map(g => ({
    event: hdr(g, 'Event').slice(0, 50),
    date: hdr(g, 'Date'),
    white: hdr(g, 'White'),
    black: hdr(g, 'Black'),
    wElo: hdr(g, 'WhiteElo'),
    bElo: hdr(g, 'BlackElo'),
  }));
}

for (const c of cases) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`#${c.n}`);
  if (c.note) { console.log('Estado:', c.note); continue; }
  for (const id of [c.canon, ...c.absorb]) {
    const idx = JSON.parse(readFileSync('games/FCE/index.json', 'utf8'));
    const e = idx.find(x => x.id === id);
    console.log(`\n  ${e?.name || id} [${e?.gameCount ?? '?'}] (${id})`);
    const sum = summarize(id);
    if (!sum) { console.log('    (carpeta no existe)'); continue; }
    sum.forEach((g, i) => {
      console.log(`    ${i + 1}. ${g.date} | ${g.event}`);
      console.log(`       ${g.white} (${g.wElo}) vs ${g.black} (${g.bElo})`);
    });
  }
}
