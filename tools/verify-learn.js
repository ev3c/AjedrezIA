// Verifica con el motor real (chess-logic.js) que los ejercicios de
// Aprende Ajedrez (Intermedio/Avanzado) son legales y coherentes:
// jugadas aceptadas legales, ahogados reales, jaques correctos y FEN
// encadenados que coinciden tras cada autoResponse.
// Uso: node tools/verify-learn.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { console };
vm.createContext(ctx);
vm.runInContext(
    fs.readFileSync(path.join(__dirname, '..', 'chess-logic.js'), 'utf8') +
    '\n;globalThis.ChessGame = ChessGame;',
    ctx
);
const ChessGame = ctx.ChessGame;

let failures = 0;
function ok(cond, label) {
    if (cond) { console.log('  OK  ' + label); }
    else { failures++; console.log('  FAIL ' + label); }
}

function sq(name) { return { row: 8 - parseInt(name[1], 10), col: name.charCodeAt(0) - 97 }; }
function uciParts(uci) {
    return {
        fr: 8 - parseInt(uci[1], 10), fc: uci.charCodeAt(0) - 97,
        tr: 8 - parseInt(uci[3], 10), tc: uci.charCodeAt(2) - 97,
        promo: uci.length === 5 ? uci[4] : undefined,
    };
}
function newGame(fen, turn) {
    const g = new ChessGame();
    g.loadFromFEN(fen);
    if (turn) g.currentTurn = turn;
    g.gameOver = false;
    return g;
}
function isLegal(g, uci) {
    const m = uciParts(uci);
    const moves = g.getValidMoves(m.fr, m.fc);
    return moves.some(v => v.row === m.tr && v.col === m.tc);
}
function apply(g, uci) {
    const m = uciParts(uci);
    const promoMap = { q: 'queen', r: 'rook', b: 'bishop', n: 'knight' };
    return g.makeMove(m.fr, m.fc, m.tr, m.tc, m.promo ? promoMap[m.promo] : undefined);
}

// ── Lecciones a verificar ────────────────────────────────────────────────
// type: 'accepted' (todas las jugadas legales), 'stars' (secuencia),
//       'any' (acceptedMoves null), extra: 'check' | 'stalemate' tras la 1ª jugada aceptada
const tests = [
    { lesson: 'inter-tablero', steps: [
        { fen: '8/8/8/8/8/8/8/1R6 w - - 0 1', stars: ['a1'] },
        { fen: '8/8/8/8/8/2N5/8/8 w - - 0 1', stars: ['b1'] },
        { fen: '8/8/8/8/8/B7/8/8 w - - 0 1', stars: ['c1'] },
        { fen: '8/8/8/3Q4/8/8/8/8 w - - 0 1', stars: ['d1'] },
        { fen: '8/8/8/8/8/8/4K3/8 w - - 0 1', stars: ['e1'] },
        { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', any: true },
    ]},
    { lesson: 'inter-enroque', steps: [
        { fen: '4k3/8/8/8/8/8/8/4K2R w K - 0 1', accepted: ['e1g1'] },
        { fen: '4k3/8/8/8/8/8/8/R3K3 w Q - 0 1', accepted: ['e1c1'] },
        { fen: '4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1', accepted: ['e1g1', 'e1c1'] },
        { fen: '4k3/8/b7/8/8/8/8/R3K2R w KQ - 0 1', accepted: ['e1c1'], illegal: ['e1g1'] },
        { fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', accepted: ['e1g1'] },
    ]},
    { lesson: 'inter-alpaso', steps: [
        { fen: '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1', accepted: ['e5d6'] },
        { fen: '4k3/8/8/3pPp2/8/8/8/4K3 w - f6 0 1', accepted: ['e5f6'], illegal: ['e5d6'] },
        { fen: '4k3/8/8/3PpP2/8/8/8/4K3 w - e6 0 1', accepted: ['d5e6', 'f5e6'] },
        { fen: '4k3/8/8/pP6/8/8/8/4K3 w - a6 0 1', accepted: ['b5a6'] },
    ]},
    { lesson: 'inter-ahogado', steps: [
        { fen: 'k7/8/1K6/8/8/8/2Q5/8 w - - 0 1', accepted: ['c2c7'], extra: 'stalemate' },
        { fen: '8/8/8/5K2/8/8/1Q6/7k w - - 0 1', accepted: ['b2f2'], extra: 'stalemate' },
        { fen: '7k/7P/5K2/8/8/8/8/8 w - - 0 1', accepted: ['f6g6'], extra: 'stalemate' },
        { fen: 'k7/7R/1K6/8/8/8/8/8 w - - 0 1', accepted: ['h7b7'], extra: 'stalemate' },
    ]},
    { lesson: 'av-valor', steps: [
        { fen: '6k1/3r4/8/8/6n1/8/8/3Q2K1 w - - 0 1', accepted: ['d1d7'] },
        { fen: 'r5k1/8/8/8/4Q3/8/8/1n4K1 w - - 0 1', accepted: ['e4a8'] },
        { fen: '3k4/3r4/8/7b/8/8/8/3Q2K1 w - - 0 1', accepted: ['d1h5'] },
        { fen: 'k7/8/8/p7/8/8/7K/R4b2 w - - 0 1', accepted: ['a1f1'] },
        { fen: 'k7/4r3/8/3N4/8/2p5/8/6K1 w - - 0 1', accepted: ['d5e7'] },
    ]},
    { lesson: 'av-jaque2', steps: [
        { fen: '4k3/p7/8/4p3/8/8/8/R5K1 w - - 0 1', accepted: ['a1a6'], auto: 'e5e4',
          nextFen: '4k3/p7/R7/8/4p3/8/8/6K1 w - - 0 1' },
        { fen: '4k3/p7/R7/8/4p3/8/8/6K1 w - - 0 1', accepted: ['a6e6'], extra: 'check' },
        { fen: '8/6kp/8/6P1/3P4/8/8/2B3K1 w - - 0 1', accepted: ['c1a3'], auto: 'h7h6',
          nextFen: '8/6k1/7p/6P1/3P4/B7/8/6K1 w - - 0 1' },
        { fen: '8/6k1/7p/6P1/3P4/B7/8/6K1 w - - 0 1', accepted: ['a3f8'], extra: 'check' },
        { fen: '4k3/p7/8/5P2/8/6N1/8/6K1 w - - 0 1', accepted: ['g3e4'], auto: 'a7a6',
          nextFen: '4k3/8/p7/5P2/4N3/8/8/6K1 w - - 0 1' },
        { fen: '4k3/8/p7/5P2/4N3/8/8/6K1 w - - 0 1', accepted: ['e4d6', 'e4f6'], extra: 'check' },
        { fen: '4r1k1/p4ppp/8/8/8/8/8/3Q2K1 w - - 0 1', accepted: ['d1d8'], auto: 'a7a6',
          nextFen: '3Qr1k1/5ppp/p7/8/8/8/8/6K1 w - - 0 1' },
        { fen: '3Qr1k1/5ppp/p7/8/8/8/8/6K1 w - - 0 1', accepted: ['d8e8'], extra: 'check' },
    ]},
    { lesson: 'horquilla (fix)', steps: [
        { fen: 'r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', accepted: ['d5c7'], extra: 'check', auto: 'e8f8',
          nextFen: 'r4k2/2N5/8/8/8/8/8/4K3 w - - 0 1' },
        { fen: 'r4k2/2N5/8/8/8/8/8/4K3 w - - 0 1', accepted: ['c7a8'] },
    ]},
];

tests.forEach(t => {
    console.log('\n== ' + t.lesson + ' ==');
    t.steps.forEach((s, i) => {
        const label = 'paso ' + (i + 1);
        if (s.stars) {
            // Simular captura de estrellas en orden con cualquier pieza blanca
            const g = newGame(s.fen, 'white');
            let allOk = true;
            s.stars.forEach(starName => {
                const target = sq(starName);
                let found = null;
                for (let r = 0; r < 8 && !found; r++) for (let c = 0; c < 8 && !found; c++) {
                    const p = g.getPiece(r, c);
                    if (!p || p.color !== 'white') continue;
                    if (g.getValidMoves(r, c).some(m => m.row === target.row && m.col === target.col)) {
                        found = { r, c };
                    }
                }
                if (!found) { allOk = false; return; }
                g.makeMove(found.r, found.c, target.row, target.col);
                g.currentTurn = 'white';
                g.gameOver = false;
            });
            ok(allOk, label + ' estrellas alcanzables en orden: ' + s.stars.join(','));
            return;
        }
        if (s.any) {
            const g = newGame(s.fen, 'white');
            let hasMove = false;
            for (let r = 0; r < 8 && !hasMove; r++) for (let c = 0; c < 8 && !hasMove; c++) {
                const p = g.getPiece(r, c);
                if (p && p.color === 'white' && g.getValidMoves(r, c).length) hasMove = true;
            }
            ok(hasMove, label + ' hay movimientos legales');
            return;
        }
        const turn = s.fen.split(' ')[1] === 'b' ? 'black' : 'white';
        (s.accepted || []).forEach(uci => {
            const g = newGame(s.fen, turn);
            ok(isLegal(g, uci), label + ' legal: ' + uci);
            if (s.extra || s.auto || s.nextFen) {
                apply(g, uci);
                if (s.extra === 'check') {
                    ok(g.isInCheck('black'), label + ' ' + uci + ' da jaque');
                }
                if (s.extra === 'stalemate') {
                    g.currentTurn = 'black';
                    const inCheck = g.isInCheck('black');
                    let hasMove = false;
                    for (let r = 0; r < 8 && !hasMove; r++) for (let c = 0; c < 8 && !hasMove; c++) {
                        const p = g.getPiece(r, c);
                        if (p && p.color === 'black' && g.getValidMoves(r, c).length) hasMove = true;
                    }
                    ok(!inCheck && !hasMove, label + ' ' + uci + ' produce ahogado');
                }
                if (s.auto) {
                    g.currentTurn = 'black';
                    g.gameOver = false;
                    ok(isLegal(g, s.auto), label + ' autoResponse legal: ' + s.auto);
                    apply(g, s.auto);
                    if (s.nextFen) {
                        const got = g.toFEN().split(' ')[0];
                        const want = s.nextFen.split(' ')[0];
                        ok(got === want, label + ' fen siguiente coincide (' + got + ')');
                    }
                }
            }
        });
        (s.illegal || []).forEach(uci => {
            const g = newGame(s.fen, turn);
            ok(!isLegal(g, uci), label + ' ilegal (esperado): ' + uci);
        });
    });
});

console.log('\n' + (failures ? failures + ' FALLOS' : 'TODO OK'));
process.exit(failures ? 1 : 0);
