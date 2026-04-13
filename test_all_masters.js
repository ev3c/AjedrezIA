const fs = require('fs');
const code = fs.readFileSync('./chess-logic.js', 'utf8');
fs.writeFileSync('./_test.js', code + '\nmodule.exports={ChessGame};');
const { ChessGame } = require('./_test.js');

function parseSANMove(san, gs) {
    const color = gs.currentTurn;
    san = san.replace(/[+#!?]/g, '');
    if (san === 'O-O' || san === '0-0') { const row = color === 'white' ? 7 : 0; return { fromRow: row, fromCol: 4, toRow: row, toCol: 6 }; }
    if (san === 'O-O-O' || san === '0-0-0') { const row = color === 'white' ? 7 : 0; return { fromRow: row, fromCol: 4, toRow: row, toCol: 2 }; }
    const files = 'abcdefgh';
    const pieceMap = { 'K': 'king', 'Q': 'queen', 'R': 'rook', 'B': 'bishop', 'N': 'knight' };
    let pieceType = 'pawn'; let dF = -1; let dR = -1; let promotion = null;
    let s = san;
    const pm = s.match(/=?([QRBN])$/);
    if (pm) { promotion = pm[1]; s = s.replace(/=?[QRBN]$/, ''); }
    if (s[0] && pieceMap[s[0]]) { pieceType = pieceMap[s[0]]; s = s.substring(1); }
    s = s.replace('x', '');
    if (s.length < 2) return null;
    const toFile = files.indexOf(s[s.length - 2]); const toRank = 8 - parseInt(s[s.length - 1]);
    if (toFile < 0 || toRank < 0 || toRank > 7) return null;
    const disambig = s.substring(0, s.length - 2);
    for (const ch of disambig) { if (files.includes(ch)) dF = files.indexOf(ch); else if (ch >= '1' && ch <= '8') dR = 8 - parseInt(ch); }
    const promoMap = { 'Q': 'queen', 'R': 'rook', 'B': 'bishop', 'N': 'knight' };
    const candidates = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = gs.getPiece(row, col);
            if (!piece || piece.color !== color || piece.type !== pieceType) continue;
            if (dF >= 0 && col !== dF) continue;
            if (dR >= 0 && row !== dR) continue;
            const validMoves = gs.getValidMoves(row, col);
            if (validMoves.some(m => m.row === toRank && m.col === toFile)) {
                candidates.push({ fromRow: row, fromCol: col, toRow: toRank, toCol: toFile, promotion: promotion ? promoMap[promotion] : undefined });
            }
        }
    }
    return candidates[0] || null;
}

function cleanPGN(pgnText) {
    let movesText = pgnText
        .replace(/\[.*?\]\s*/g, '')
        .replace(/\{[^}]*\}/g, '')
        .replace(/;.*$/gm, '')
        .replace(/\$\d+/g, '');
    let prev;
    do { prev = movesText; movesText = movesText.replace(/\([^()]*\)/g, ''); } while (movesText !== prev);
    movesText = movesText.replace(/\d+\.\.\./g, '').trim();
    movesText = movesText.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '').trim();
    return movesText
        .split(/\s+/)
        .filter(token => token && !token.match(/^\d+\.?$/) && !token.match(/^\$/) && !token.match(/^(1-0|0-1|1\/2-1\/2|\*)$/))
        .map(m => m.replace(/^\d+\./, ''))
        .filter(m => m.length > 0 && m.match(/^[a-hKQRBNO0]/));
}

function testGame(key, name, pgn) {
    const game = new ChessGame();
    const moves = cleanPGN(pgn);
    if (moves.length === 0) {
        console.log(`  FAIL [${key}] "${name}": no moves found`);
        return false;
    }

    const ambiguousHistory = [];
    let movesPlayed = 0;

    for (let mi = 0; mi < moves.length; mi++) {
        const sanMove = moves[mi];
        if (game.gameOver) game.gameOver = false;

        const parsed = parseSANMove(sanMove, game);
        if (!parsed) {
            let recovered = false;
            for (let bi = ambiguousHistory.length - 1; bi >= 0 && !recovered; bi--) {
                const entry = ambiguousHistory[bi];
                if (entry.triedIndex >= entry.candidates.length - 1) continue;
                const undoCount = movesPlayed - entry.moveIndex;
                for (let u = 0; u < undoCount; u++) { game.undoMove(); movesPlayed--; }
                entry.triedIndex++;
                const altParsed = entry.candidates[entry.triedIndex];
                if (game.gameOver) game.gameOver = false;
                const altResult = game.makeMove(altParsed.fromRow, altParsed.fromCol, altParsed.toRow, altParsed.toCol, altParsed.promotion);
                if (altResult) {
                    movesPlayed++;
                    ambiguousHistory.length = bi + 1;
                    let replayOk = true;
                    for (let ri = entry.tokenIndex + 1; ri <= mi; ri++) {
                        if (game.gameOver) game.gameOver = false;
                        const rParsed = parseSANMove(moves[ri], game);
                        if (!rParsed) { replayOk = false; break; }
                        const rResult = game.makeMove(rParsed.fromRow, rParsed.fromCol, rParsed.toRow, rParsed.toCol, rParsed.promotion);
                        if (!rResult) { replayOk = false; break; }
                        movesPlayed++;
                    }
                    if (replayOk) recovered = true;
                }
            }
            if (!recovered) {
                const moveNum = Math.floor(movesPlayed / 2) + 1;
                const side = game.currentTurn === 'white' ? '' : '...';
                console.log(`  FAIL [${key}] "${name}": error at ${moveNum}.${side}${sanMove} (move ${movesPlayed + 1}/${moves.length}, turn: ${game.currentTurn})`);
                return false;
            }
            continue;
        }

        const result = game.makeMove(parsed.fromRow, parsed.fromCol, parsed.toRow, parsed.toCol, parsed.promotion);
        if (!result) {
            const moveNum = Math.floor(movesPlayed / 2) + 1;
            const side = game.currentTurn === 'white' ? '' : '...';
            console.log(`  FAIL [${key}] "${name}": invalid move ${moveNum}.${side}${sanMove} (move ${movesPlayed + 1}/${moves.length})`);
            return false;
        }
        movesPlayed++;
    }
    return true;
}

// Extract FAMOUS_GAMES from app.js
const appCode = fs.readFileSync('./app.js', 'utf8');
const gamesMatch = appCode.match(/const FAMOUS_GAMES\s*=\s*\{/);
if (!gamesMatch) { console.error('Could not find FAMOUS_GAMES'); process.exit(1); }

const startIdx = gamesMatch.index;
let braceCount = 0;
let endIdx = startIdx;
for (let i = startIdx; i < appCode.length; i++) {
    if (appCode[i] === '{') braceCount++;
    if (appCode[i] === '}') { braceCount--; if (braceCount === 0) { endIdx = i + 1; break; } }
}

const gamesCode = appCode.substring(startIdx, endIdx);
let FAMOUS_GAMES;
eval(gamesCode.replace('const ', ''));

const keys = Object.keys(FAMOUS_GAMES);
console.log(`\n=== Testing ${keys.length} master games ===\n`);

let passed = 0;
let failed = 0;
const failures = [];

for (const key of keys) {
    const game = FAMOUS_GAMES[key];
    if (!game || !game.pgn) { console.log(`  SKIP [${key}]: no PGN`); continue; }
    const ok = testGame(key, game.name, game.pgn);
    if (ok) { passed++; }
    else { failed++; failures.push(key); }
}

console.log(`\n=== Results: ${passed} OK, ${failed} FAILED out of ${keys.length} games ===`);
if (failures.length > 0) {
    console.log(`\nFailed games:`);
    failures.forEach(k => console.log(`  - ${k}: ${FAMOUS_GAMES[k].name}`));
}

fs.unlinkSync('./_test.js');
