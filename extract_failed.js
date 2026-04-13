const fs = require('fs');
const appCode = fs.readFileSync('./app.js', 'utf8');
const gamesMatch = appCode.match(/const FAMOUS_GAMES\s*=\s*\{/);
const startIdx = gamesMatch.index;
let braceCount = 0, endIdx = startIdx;
for (let i = startIdx; i < appCode.length; i++) {
    if (appCode[i] === '{') braceCount++;
    if (appCode[i] === '}') { braceCount--; if (braceCount === 0) { endIdx = i + 1; break; } }
}
const gamesCode = appCode.substring(startIdx, endIdx);
let FAMOUS_GAMES;
eval(gamesCode.replace('const ', ''));

const failed = [
    'mcconnell-morphy', 'alekhine-bogoljubov', 'fischer-larsen-71', 'fischer-petrosian-71',
    'tal-botvinnik-60', 'fischer-11-0', 'kasparov-shirov-94', 'capablanca-alekhine-27',
    'tal-hecht-62', 'korchnoi-karpov-78', 'kasparov-portisch-83', 'tal-tringov-64',
    'tal-flesch-81', 'karpov-spassky-74', 'karpov-kasparov-87', 'kasparov-kramnik-96',
    'anand-karpov-98', 'anand-topalov-05', 'alekhine-nimzowitsch', 'alekhine-lasker-14',
    'steinitz-zukertort-86', 'morphy-paulsen', 'keres-spassky-55', 'spassky-tal-73',
    'bronstein-ljubojevic-73', 'carlsen-nakamura-11', 'fischer-reshevsky-61', 'kramnik-aronian-07',
    'anand-carlsen-14', 'morphy-anderssen-58'
];

for (const key of failed) {
    const g = FAMOUS_GAMES[key];
    const pgnClean = g.pgn.replace(/\\n/g, '\n');
    console.log(`\n========== ${key} ==========`);
    console.log(`Name: ${g.name}`);
    console.log(pgnClean);
}
