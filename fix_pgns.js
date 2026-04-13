const fs = require('fs');
let code = fs.readFileSync('./app.js', 'utf8');

const corrections = {
    'tal-tringov-64': {
        name: 'Tal vs Tringov, Ámsterdam 1964 — Sacrificio brillante',
        pgn: '[Event "Amsterdam Interzonal"]\\n[Site "Amsterdam"]\\n[Date "1964"]\\n[White "Mikhail Tal"]\\n[Black "Georgi Tringov"]\\n[Result "1-0"]\\n\\n1.e4 g6 2.d4 Bg7 3.Nc3 d6 4.Nf3 c6 5.Bg5 Qb6 6.Qd2 Qxb2 7.Rb1 Qa3 8.Bc4 Qa5 9.O-O e6 10.Rfe1 a6 11.Bf4 e5 12.dxe5 dxe5 13.Qd6 Qxc3 14.Red1 Nd7 15.Bxf7+ Kxf7 16.Ng5+ Ke8 17.Qe6+ 1-0'
    },
    'kasparov-portisch-83': {
        name: 'Kasparov vs Portisch, Niksic 1983 — Doble sacrificio de alfil',
        pgn: '[Event "Niksic"]\\n[Site "Niksic"]\\n[Date "1983"]\\n[White "Garry Kasparov"]\\n[Black "Lajos Portisch"]\\n[Result "1-0"]\\n\\n1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.Nc3 Bb7 5.a3 d5 6.cxd5 Nxd5 7.e3 Nxc3 8.bxc3 Be7 9.Bb5+ c6 10.Bd3 c5 11.O-O Nc6 12.Bb2 Rc8 13.Qe2 O-O 14.Rad1 Qc7 15.c4 cxd4 16.exd4 Na5 17.d5 exd5 18.cxd5 Bxd5 19.Bxh7+ Kxh7 20.Rxd5 Kg8 21.Bxg7 Kxg7 22.Ne5 Rfd8 23.Qg4+ Kf8 24.Qf5 f6 25.Nd7+ Rxd7 26.Rxd7 Qc5 27.Qh7 Rc7 28.Qh8+ Kf7 29.Rd3 Nc4 30.Rfd1 Ne5 31.Qh7+ Ke6 32.Qg8+ Kf5 33.g4+ Kf4 34.Rd4+ Kf3 35.Qb3+ 1-0'
    },
    'kasparov-shirov-94': {
        name: 'Kasparov vs Shirov, Horgen 1994 — Sacrificio de torre',
        pgn: '[Event "Credit Suisse Masters"]\\n[Site "Horgen"]\\n[Date "1994"]\\n[White "Garry Kasparov"]\\n[Black "Alexei Shirov"]\\n[Result "1-0"]\\n\\n1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 Nc6 6.Ndb5 d6 7.Bf4 e5 8.Bg5 a6 9.Na3 b5 10.Nd5 Be7 11.Bxf6 Bxf6 12.c3 Bb7 13.Nc2 Nb8 14.a4 bxa4 15.Rxa4 Nd7 16.Rb4 Nc5 17.Rxb7 Nxb7 18.b4 Bg5 19.Na3 O-O 20.Nc4 a5 21.Bd3 axb4 22.cxb4 Qb8 23.h4 Bh6 24.Ncb6 Ra2 25.O-O Rd2 26.Qf3 Qa7 27.Nd7 Nd8 28.Nxf8 Kxf8 29.b5 Qa3 30.Qf5 Ke8 31.Bc4 Rc2 32.Qxh7 Rxc4 33.Qg8+ Kd7 34.Nb6+ Ke7 35.Nxc4 Qc5 36.Ra1 Qd4 37.Ra3 Bc1 38.Ne3 1-0'
    },
    'korchnoi-karpov-78': {
        name: 'Korchnoi vs Karpov, Mundial 1978 G17 — La Guerra Fría',
        pgn: '[Event "World Championship"]\\n[Site "Baguio City"]\\n[Date "1978"]\\n[White "Viktor Korchnoi"]\\n[Black "Anatoly Karpov"]\\n[Result "0-1"]\\n\\n1.c4 Nf6 2.Nc3 e6 3.d4 Bb4 4.e3 O-O 5.Bd3 c5 6.d5 b5 7.dxe6 fxe6 8.cxb5 a6 9.Nge2 d5 10.O-O e5 11.a3 axb5 12.Bxb5 Bxc3 13.bxc3 Ba6 14.Rb1 Qd6 15.c4 d4 16.Ng3 Nc6 17.a4 Na5 18.Qd3 Qe6 19.exd4 cxd4 20.c5 Rfc8 21.f4 Rxc5 22.Bxa6 Qxa6 23.Qxa6 Rxa6 24.Ba3 Rd5 25.Nf5 Kf7 26.fxe5 Rxe5 27.Rb5 Nc4 28.Rb7+ Ke6 29.Nxd4+ Kd5 30.Nf3 Nxa3 31.Nxe5 Kxe5 32.Re7+ Kd4 33.Rxg7 Nc4 34.Rf4+ Ne4 35.Rd7+ Ke3 36.Rf3+ Ke2 37.Rxh7 Ncd2 38.Ra3 Rc6 39.Ra1 Nf3+ 0-1'
    },
    'kasparov-kramnik-96': {
        name: 'Kasparov vs Kramnik, Dos Hermanas 1996 — Sacrificio posicional',
        pgn: '[Event "Dos Hermanas"]\\n[Site "Dos Hermanas"]\\n[Date "1996"]\\n[White "Garry Kasparov"]\\n[Black "Vladimir Kramnik"]\\n[Result "0-1"]\\n\\n1.d4 d5 2.c4 c6 3.Nc3 Nf6 4.Nf3 e6 5.e3 Nbd7 6.Bd3 dxc4 7.Bxc4 b5 8.Bd3 Bb7 9.O-O a6 10.e4 c5 11.d5 c4 12.Bc2 Qc7 13.Nd4 Nc5 14.b4 cxb3 15.axb3 b4 16.Na4 Ncxe4 17.Bxe4 Nxe4 18.dxe6 Bd6 19.exf7+ Qxf7 20.f3 Qh5 21.g3 O-O 22.fxe4 Qh3 23.Nf3 Bxg3 24.Nc5 Rxf3 25.Rxf3 Qxh2+ 26.Kf1 Bc6 27.Bg5 Bb5+ 28.Nd3 Re8 29.Ra2 Qh1+ 30.Ke2 Rxe4+ 31.Kd2 Qg2+ 32.Kc1 Qxa2 33.Rxg3 Qa1+ 34.Kc2 Qc3+ 35.Kb1 Rd4 0-1'
    },
    'anand-topalov-05': {
        name: 'Anand vs Topalov, Sofía 2005 — Victoria brillante',
        pgn: '[Event "M-Tel Masters"]\\n[Site "Sofia"]\\n[Date "2005.05.13"]\\n[White "Viswanathan Anand"]\\n[Black "Veselin Topalov"]\\n[Result "1/2-1/2"]\\n\\n1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e6 7.f3 b5 8.g4 h6 9.Qd2 b4 10.Na4 Nbd7 11.O-O-O Ne5 12.b3 Bd7 13.Nb2 d5 14.Bf4 Nxf3 15.Nxf3 Nxe4 16.Qd4 f6 17.Bd3 Bc5 18.Bxe4 Bxd4 19.Bg6+ Kf8 20.Rxd4 a5 21.Re1 Be8 22.Nh4 e5 23.Rd2 a4 24.bxa4 Kg8 25.Bg3 d4 26.Rd3 h5 27.Bxe8 Qxe8 28.g5 Rc8 29.g6 Rh6 30.Rxd4 Rxg6 31.Nxg6 Qxg6 32.Rd2 Rc3 33.Red1 Kh7 34.Kb1 Qf5 35.Be1 Ra3 36.Rd6 Rh3 37.a5 Rxh2 38.Rc1 Qe4 39.a6 Qa8 40.Bxb4 h4 41.Bc5 h3 42.Nd3 Rd2 43.Rb6 h2 44.Nf2 Qd5 45.Be3 Re2 46.Rb3 f5 47.a7 Rxe3 48.Rxe3 Qb7+ 49.Rb3 Qxa7 50.Nh1 f4 51.c4 e4 52.c5 e3 53.c6 e2 54.c7 Qxc7 55.Rxc7 e1=Q+ 56.Rc1 Qe4+ 57.Ka1 Qd4+ 58.Kb1 Qe4+ 59.Ka1 Qd4+ 60.Kb1 Qe4+ 1/2-1/2'
    }
};

let count = 0;
for (const [key, correction] of Object.entries(corrections)) {
    const keyStr = "'" + key + "'";
    const idx = code.indexOf(keyStr);
    if (idx === -1) { console.log('NOT FOUND: ' + key); continue; }
    
    const blockStart = code.lastIndexOf('\n', idx) + 1;
    const nameLineStart = code.indexOf('name:', idx);
    const closingBrace = code.indexOf('\n    },', nameLineStart);
    const closingEnd = closingBrace + '\n    },'.length;
    
    const oldBlock = code.substring(blockStart, closingEnd);
    const newBlock = `    '${key}': {\n        name: '${correction.name}',\n        pgn: '${correction.pgn}'\n    },`;
    
    if (code.includes(oldBlock)) {
        code = code.replace(oldBlock, newBlock);
        count++;
        console.log('FIXED: ' + key);
    } else {
        console.log('MATCH FAILED: ' + key);
    }
}

fs.writeFileSync('./app.js', code);
console.log('\nTotal fixed: ' + count);
