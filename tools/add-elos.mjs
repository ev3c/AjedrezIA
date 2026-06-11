/**
 * add-elos.mjs
 * Añade etiquetas WhiteElo / BlackElo a los PGN de las partidas maestras clásicas
 * que carecen de ELO en FAMOUS_GAMES (app.js).
 *
 * Fuentes:
 *  - FIDE rating lists 1971-2023 (listas oficiales)
 *  - Estimaciones históricas retroactivas (Chessmetrics / bases de datos públicas)
 *    para partidas pre-1970
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const APP_JS = resolve('h:/Mi unidad/AI code/games/AjedrezIA/app.js');

// ─────────────────────────────────────────────────────────────────────────────
// Mapa:  clave_juego → [WhiteElo, BlackElo]
//  - null  → jugador sin ELO (máquina) → se omite esa etiqueta
//  - string → ELO a insertar
// ─────────────────────────────────────────────────────────────────────────────
const ELO_MAP = {
  // ── Era FIDE (1970+) ─────────────────────────────────────────────
  'larsen-spassky-70':        ['2660', '2660'],   // 1970  Buenos Aires
  'polugaevsky-tal':          ['2610', '2625'],   // 1969  Alma-Ata (estimado pre-FIDE)
  'fischer-taimanov-71':      ['2785', '2620'],   // 1971  FIDE list jul-71
  'fischer-larsen-71':        ['2785', '2660'],   // 1971  Candidatos
  'fischer-spassky':          ['2785', '2660'],   // 1972  Campeonato del Mundo (jul-72)
  'spassky-fischer-72-g1':    ['2660', '2785'],   // 1972  Campeonato del Mundo G1
  'spassky-tal-73':           ['2640', '2620'],   // 1973  USSR Championship
  'karpov-unzicker':          ['2700', '2530'],   // 1974  Nice Olympiad
  'korchnoi-karpov-78':       ['2665', '2725'],   // 1978  Candidatos final
  'kasparov-portisch-83':     ['2690', '2630'],   // 1983  Niksic
  'karpov-kasparov-85':       ['2720', '2700'],   // 1985  WCh G16 (jul-85)
  'karpov-kasparov-85-g24':   ['2720', '2700'],   // 1985  WCh G24
  'karpov-kasparov-87':       ['2740', '2700'],   // 1987  WCh Sevilla (jan-87: Kasparov 2740, Karpov 2700)
  'kasparov-karpov-90':       ['2800', '2730'],   // 1990  WCh Lyon G24
  'short-timman':             ['2660', '2630'],   // 1991  Tilburg
  'ivanchuk-yusupov':         ['2700', '2620'],   // 1991  Brussels Candidatos
  'kasparov-shirov-94':       ['2805', '2710'],   // 1994  Linares (ene-94)
  'illescas-karpov':          ['2590', '2740'],   // 1994  Linares
  'kasparov-anand-95':        ['2795', '2725'],   // 1995  WCh PCA match
  'kasparov-kramnik-96':      ['2785', '2775'],   // 1996  Dos Hermanas
  'kasparov-topalov':         ['2812', '2700'],   // 1999  Wijk aan Zee (ene-99)
  'kramnik-kasparov-2000':    ['2770', '2849'],   // 2000  WCh Brainies match
  'vallejo-shirov':           ['2650', '2715'],   // 2002  Linares
  'anand-topalov-05':         ['2788', '2788'],   // 2005  Sofia WCh G5
  'carlsen-nakamura-11':      ['2826', '2758'],   // 2011  Wijk aan Zee
  'carlsen-anand-13':         ['2775', '2870'],   // 2013  WCh G6 (White=Anand, Black=Carlsen)
  'anand-carlsen-14':         ['2863', '2792'],   // 2014  WCh G11 (White=Carlsen, Black=Anand)
  'nakamura-carlsen-16':      ['2772', '2881'],   // 2014  Zurich CC (Carlsen was rated 2881)
  'carlsen-karjakin-16':      ['2853', '2772'],   // 2016  WCh G13
  'carlsen-caruana-18':       ['2835', '2832'],   // 2018  WCh G3
  'ding-nepomniachtchi-23':   ['2788', '2795'],   // 2023  WCh Astana G12

  // ── Estimaciones históricas 1960-1969 ────────────────────────────
  // (Basadas en Chessmetrics y bases de datos retroactivas)
  'petrosian-spassky-66':     ['2645', '2625'],   // 1966  WCh G10
  'tal-larsen-65':            ['2630', '2630'],   // 1965  Candidatos
  'tal-tringov-64':           ['2620', '2490'],   // 1964  Amsterdam Olympiad
  'tal-botvinnik-60':         ['2680', '2580'],   // 1960  WCh (White=Botvinnik, Black=Tal)
  'tal-hecht-62':             ['2615', '2490'],   // 1962  Leipzig Olympiad
  'pomar-fischer':            ['2490', '2600'],   // 1966  Havana Olympiad
  'fischer-pomar-62':         ['2560', '2490'],   // 1962  Stockholm Interzonal
  'byrne-fischer-63':         ['2510', '2570'],   // 1963  US Championship (R. Byrne vs Fischer)
  'fischer-11-0':             ['2570', '2510'],   // 1963  US Championship G3 (Fischer vs Benko)
  'game-of-century':          ['2480', '2400'],   // 1956  Rosenwald Tr. (D. Byrne vs Fischer, 13 años)
  'nezhmetdinov-chernikov':   ['2540', '2450'],   // 1962  Russia RSFSR Ch.

  // ── Estimaciones históricas 1950s ─────────────────────────────────
  'geller-euwe':              ['2570', '2580'],   // 1953  Candidatos Zurich
  'keres-spassky-55':         ['2625', '2545'],   // 1955  Goteborg Interzonal
  'smyslov-reshevsky':        ['2660', '2590'],   // 1945  USA-USSR Radio Match

  // ── Jugadores sin ELO (máquinas) → solo el ELO humano ─────────────
  // White = Deep Blue (null), Black = Kasparov
  'deepblue-kasparov-96':     [null, '2795'],     // 1996  Filadelfia G2
  // White = Deep Blue (null), Black = Kasparov
  'kasparov-deepblue':        [null, '2785'],     // 1997  Nueva York G6
};

// ─────────────────────────────────────────────────────────────────────────────

let src = readFileSync(APP_JS, 'utf8');
let changes = 0;
let skipped = 0;

for (const [gameKey, [whiteElo, blackElo]] of Object.entries(ELO_MAP)) {
  // Encontrar la entrada en FAMOUS_GAMES: buscar la clave entre comillas
  const keyPattern = new RegExp(
    `(['"])${gameKey}\\1\\s*:\\s*\\{[^}]*?pgn\\s*:\\s*(['"\`])`,
    's'
  );

  const m = keyPattern.exec(src);
  if (!m) {
    console.warn(`⚠  clave no encontrada: ${gameKey}`);
    skipped++;
    continue;
  }

  // Encontrar el valor del PGN (string posiblemente multiline con template literal o string normal)
  const pgnStart = m.index + m[0].length - 1; // posición del quote inicial del pgn
  const quoteChar = m[2]; // ', " o `

  // Extraer el contenido del PGN buscando el cierre del string
  let pgnEnd = pgnStart + 1;
  let escaped = false;
  while (pgnEnd < src.length) {
    const ch = src[pgnEnd];
    if (escaped) { escaped = false; pgnEnd++; continue; }
    if (ch === '\\') { escaped = true; pgnEnd++; continue; }
    if (ch === quoteChar) break;
    pgnEnd++;
  }

  const pgnContent = src.slice(pgnStart + 1, pgnEnd);

  // Comprobar si ya tiene WhiteElo o BlackElo
  if (pgnContent.includes('[WhiteElo') || pgnContent.includes('[BlackElo')) {
    // ya tiene ELO, saltar
    skipped++;
    continue;
  }

  // Construir las etiquetas a insertar
  const whiteTag = whiteElo ? `[WhiteElo "${whiteElo}"]\\n` : '';
  const blackTag = blackElo ? `[BlackElo "${blackElo}"]\\n` : '';
  if (!whiteTag && !blackTag) { skipped++; continue; }
  const eloTags = whiteTag + blackTag;

  // Insertar DESPUÉS de [Black "..."] en el PGN
  // El PGN tiene los headers al inicio, y el literal está escapado con \\n
  // Buscamos la posición después de la etiqueta [Black "..."]
  const blackHeaderPattern = /(\[Black\s+"[^"]*"\]\\n)/;
  const mm = blackHeaderPattern.exec(pgnContent);
  if (!mm) {
    console.warn(`⚠  no se encontró [Black "..."] en PGN de ${gameKey}`);
    skipped++;
    continue;
  }

  const insertPos = pgnStart + 1 + mm.index + mm[0].length;
  src = src.slice(0, insertPos) + eloTags + src.slice(insertPos);
  changes++;
  console.log(`✅  ${gameKey}  W:${whiteElo ?? '-'}  B:${blackElo ?? '-'}`);
}

writeFileSync(APP_JS, src, 'utf8');
console.log(`\nListo: ${changes} partidas actualizadas, ${skipped} omitidas.`);
