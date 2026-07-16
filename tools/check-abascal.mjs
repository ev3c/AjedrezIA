import { readFileSync } from 'fs';

const idx = JSON.parse(readFileSync('games/FCE/index.json', 'utf8'));
const a = idx.find(x => x.id === 'abascal-vicente-i');
const b = idx.find(x => x.id === 'abascal-vicente-ignacio');

function splitPgn(raw) {
  return raw.split(/(?=\[Event\s+")/).map(x => x.trim()).filter(x => x.startsWith('[Event'));
}
function gameKey(pgn) {
  const h = (t) => (pgn.match(new RegExp(`^\\[${t}\\s+"([^"]*)"\\]`, 'm')) || [])[1]?.trim() || '';
  return [h('Event'), h('White'), h('Black'), h('Date'), h('Round')].join('|');
}

const rawA = readFileSync('games/FCE/abascal-vicente-i/games.pgn', 'utf8');
const rawB = readFileSync('games/FCE/abascal-vicente-ignacio/games.pgn', 'utf8');
const keysA = new Set(splitPgn(rawA).map(gameKey));
const keysB = splitPgn(rawB).map(gameKey);
const dup = keysB.filter(k => keysA.has(k));

console.log(a);
console.log(b);
console.log('Duplicados entre carpetas:', dup.length);
console.log('Partida Ignacio:', keysB[0]);
