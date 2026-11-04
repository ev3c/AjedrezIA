// Sistema de idiomas para AjedrezIA.
// Uso: t('newGame')  ·  applyI18n()  ·  setAppLanguage('en')
//
// Para añadir un idioma nuevo:
//  1. Añade el código a I18N_LANGS (ej. 'fr').
//  2. Añade la traducción como siguiente columna en cada fila de I18N_PAIRS
//     y en i18n-content.js / i18n-variants.js (mismo orden que I18N_LANGS),
//     O registra un diccionario con registerI18nLang('fr', { clave: 'texto' })
//     en i18n-extra.js (generado por tools/build-i18n-extra.mjs).
//  3. Añade la opción en el menú Idioma de index.html.
//     Los botones de cabecera (ES/CAT/EN) son independientes.
//  4. Las claves nuevas se registran con registerI18n([['clave', 'es', 'en', ...]]).

const I18N_LANGS = ['es', 'en', 'ca', 'de', 'fr', 'it', 'pt', 'zh', 'ru', 'ar', 'ja', 'hi', 'ko'];
const I18N_RTL = { ar: true };
const I18N = {};
I18N_LANGS.forEach(function(lang) { I18N[lang] = {}; });

function isSupportedLang(lang) {
    return I18N_LANGS.indexOf(lang) !== -1;
}

function registerI18n(pairs) {
    if (!pairs || !pairs.length) return;
    pairs.forEach(function(row) {
        const key = row[0];
        I18N_LANGS.forEach(function(lang, i) {
            const val = row[i + 1];
            if (val != null) I18N[lang][key] = val;
        });
    });
}

function registerI18nLang(lang, dict) {
    if (!isSupportedLang(lang) || !dict) return;
    if (!I18N[lang]) I18N[lang] = {};
    Object.keys(dict).forEach(function(key) {
        I18N[lang][key] = dict[key];
    });
}

const I18N_PAIRS = [
    ['meta.title', 'AjedrezIA — Juega y aprende ajedrez con IA', 'AjedrezIA — Play and learn chess with AI', 'AjedrezIA — Juga i aprèn escacs amb IA'],
    ['meta.description', 'Juega contra la IA, resuelve problemas, estudia aperturas y partidas maestras. Gratis y sin registro.', 'Play against the AI, solve puzzles, study openings and master games. Free, no sign-up required.', 'Juga contra la IA, resol problemes, estudia obertures i partides mestres. De franc i sense registre.'],
    ['newGame', '♟ Nueva Partida', '♟ New Game', '♟ Nova partida'],
    ['panel.openings', '📖 Entrenar Aperturas', '📖 Train Openings', '📖 Entrena obertures'],
    ['panel.puzzles', '🧩 Problemas de Ajedrez', '🧩 Chess Puzzles', '🧩 Problemes d\'escacs'],
    ['panel.famous', '🏆 Partidas Maestras', '🏆 Master Games', '🏆 Partides mestres'],
    ['panel.catLeague', '🏁 Partides Lliga CAT', '🏁 Catalan League Games', '🏁 Partides Lliga CAT'],
    ['panel.learn', '📚 Aprende Ajedrez', '📚 Learn Chess', '📚 Aprèn escacs'],
    ['panel.clock', '⏱️ Reloj de Ajedrez', '⏱️ Chess Clock', '⏱️ Rellotge d\'escacs'],
    ['panel.chat', '💬 Chat', '💬 Chat', '💬 Xat'],
    ['panel.config', '⚙️ Configuración', '⚙️ Settings', '⚙️ Configuració'],
    ['panel.actions', '⚡ Acciones', '⚡ Actions', '⚡ Accions'],
    ['panel.stats', '📊 Estadísticas', '📊 Statistics', '📊 Estadístiques'],
    ['underConstruction', '(beta)', '(beta)', '(beta)', '(Beta)', '(bêta)', '(beta)', '(beta)', '(测试版)', '(бета)', '(تجريبي)', '(ベータ)', '(बीटा)', '(베타)'],
    ['learn.underConstruction', 'Versión beta: puede haber lecciones incompletas o cambios frecuentes.', 'Beta version: some lessons may be incomplete or change often.', 'Versió beta: pot haver-hi lliçons incompletes o canvis freqüents.', 'Beta-Version: einige Lektionen können unvollständig sein oder sich oft ändern.', 'Version bêta : certaines leçons peuvent être incomplètes ou changer souvent.', 'Versione beta: alcune lezioni possono essere incomplete o cambiare spesso.', 'Versão beta: algumas lições podem estar incompletas ou mudar com frequência.', '测试版：部分课程可能不完整或经常变动。', 'Бета-версия: некоторые уроки могут быть неполными или часто меняться.', 'إصدار تجريبي: قد تكون بعض الدروس ناقصة أو تتغيّر كثيراً.', 'ベータ版：一部のレッスンは未完成、または頻繁に変わることがあります。', 'बीटा संस्करण: कुछ पाठ अधूरे हो सकते हैं या अक्सर बदल सकते हैं।', '베타: 일부 레슨이 미완성이거나 자주 바뀔 수 있습니다.'],
    ['opening.select', 'Selecciona una apertura:', 'Select an opening:', 'Selecciona una obertura:'],
    ['opening.freeMode', '— Modo libre —', '— Free mode —', '— Mode lliure —'],
    ['opening.groupOpen', '1.e4 e5 — Juego Abierto', '1.e4 e5 — Open Games', '1.e4 e5 — Joc obert'],
    ['opening.groupSemi', '1.e4 — Semiabiertas', '1.e4 — Semi-Open', '1.e4 — Semiobertes'],
    ['opening.groupQG', '1.d4 — Gambito de Dama', '1.d4 — Queen’s Gambit', '1.d4 — Gambito de dama'],
    ['opening.groupIndian', '1.d4 Kf6 2.c4— Defensas Indias', '1.d4 Nf6 2.c4 — Indian Defences', '1.d4 Kf6 2.c4— Defenses índies'],
    ['opening.groupSystems', '1.d4 — Sistemas', '1.d4 — Systems', '1.d4 — Sistemes'],
    ['opening.groupOther', 'Otras Aperturas', 'Other Openings', 'Altres obertures'],
    ['opening.italiana', 'Apertura Italiana (Giuoco Piano) [C54]', 'Italian Game (Giuoco Piano) [C54]', 'Obertura italiana (Giuoco Piano) [C54]'],
    ['opening.evans', 'Gambito Evans [C51]', 'Evans Gambit [C51]', 'Gambito Evans [C51]'],
    ['opening.espanola', 'Apertura Española (Ruy López) [C60]', 'Ruy Lopez (Spanish Opening) [C60]', 'Obertura espanyola (Ruy López) [C60]'],
    ['opening.escocesa', 'Apertura Escocesa [C45]', 'Scotch Game [C45]', 'Obertura escocesa [C45]'],
    ['opening.petrov', 'Defensa Petrov [C42]', 'Petrov Defence [C42]', 'Defensa Petrov [C42]'],
    ['opening.fourKnights', 'Cuatro Caballos [C47]', 'Four Knights [C47]', 'Quatre cavalls [C47]'],
    ['opening.vienna', 'Apertura Vienesa [C25]', 'Vienna Game [C25]', 'Obertura vienesa [C25]'],
    ['opening.kingsGambit', 'Gambito de Rey [C30]', 'King’s Gambit [C30]', 'Gambito de rei [C30]'],
    ['opening.twoKnights', 'Dos Caballos [C55]', 'Two Knights Defence [C55]', 'Dos cavalls [C55]'],
    ['opening.philidor', 'Defensa Philidor [C41]', 'Philidor Defence [C41]', 'Defensa Philidor [C41]'],
    ['opening.sicilian', 'Defensa Siciliana [B20]', 'Sicilian Defence [B20]', 'Defensa siciliana [B20]'],
    ['opening.french', 'Defensa Francesa [C00]', 'French Defence [C00]', 'Defensa francesa [C00]'],
    ['opening.caroKann', 'Defensa Caro-Kann [B10]', 'Caro-Kann Defence [B10]', 'Defensa Caro-Kann [B10]'],
    ['opening.scandinavian', 'Defensa Escandinava [B01]', 'Scandinavian Defence [B01]', 'Defensa escandinava [B01]'],
    ['opening.pirc', 'Defensa Pirc [B07]', 'Pirc Defence [B07]', 'Defensa Pirc [B07]'],
    ['opening.alekhine', 'Defensa Alekhine [B02]', 'Alekhine Defence [B02]', 'Defensa Alekhine [B02]'],
    ['opening.modern', 'Defensa Moderna [B06]', 'Modern Defence [B06]', 'Defensa moderna [B06]'],
    ['opening.qga', 'Gambito de Dama Aceptado [D20]', 'Queen’s Gambit Accepted [D20]', 'Gambito de dama acceptat [D20]'],
    ['opening.qgd', 'GDR Ortodoxa [D60]', 'QGD Orthodox [D60]', 'GDR ortodoxa [D60]'],
    ['opening.slav', 'Defensa Eslava [D10]', 'Slav Defence [D10]', 'Defensa eslava [D10]'],
    ['opening.semiSlav', 'Semi-Eslava [D43]', 'Semi-Slav [D43]', 'Semi-eslava [D43]'],
    ['opening.grunfeld', 'Defensa Grünfeld [D85]', 'Grünfeld Defence [D85]', 'Defensa Grünfeld [D85]'],
    ['opening.kingsIndian', 'India de Rey [E60]', 'King’s Indian [E60]', 'Índia de rei [E60]'],
    ['opening.nimzo', 'Nimzo-India [E20]', 'Nimzo-Indian [E20]', 'Nimzoíndia [E20]'],
    ['opening.queensIndian', 'India de Dama [E12]', 'Queen’s Indian [E12]', 'Índia de dama [E12]'],
    ['opening.bogo', 'Bogo-India [E11]', 'Bogo-Indian [E11]', 'Bogoíndia [E11]'],
    ['opening.benoni', 'Benoni Moderna [A60]', 'Modern Benoni [A60]', 'Benoni moderna [A60]'],
    ['opening.budapest', 'Gambito Budapest [A52]', 'Budapest Gambit [A52]', 'Gambito Budapest [A52]'],
    ['opening.dutch', 'Defensa Holandesa [A80]', 'Dutch Defence [A80]', 'Defensa holandesa [A80]'],
    ['opening.london', 'Sistema Londres [D02]', 'London System [D02]', 'Sistema Londres [D02]'],
    ['opening.colle', 'Sistema Colle [D05]', 'Colle System [D05]', 'Sistema Colle [D05]'],
    ['opening.trompowsky', 'Apertura Trompowsky [A45]', 'Trompowsky Attack [A45]', 'Obertura Trompowsky [A45]'],
    ['opening.torre', 'Ataque Torre [A46]', 'Torre Attack [A46]', 'Atac Torre [A46]'],
    ['opening.english', 'Apertura Inglesa [A20]', 'English Opening [A20]', 'Obertura anglesa [A20]'],
    ['opening.reti', 'Apertura Réti [A09]', 'Réti Opening [A09]', 'Obertura Réti [A09]'],
    ['opening.catalan', 'Apertura Catalana [E01]', 'Catalan Opening [E01]', 'Obertura catalana [E01]'],
    ['opening.larsen', 'Apertura Larsen [A01]', 'Larsen’s Opening [A01]', 'Obertura Larsen [A01]'],
    ['opening.bird', 'Apertura Bird [A02]', 'Bird’s Opening [A02]', 'Obertura Bird [A02]'],
    ['opening.selectTraps', 'Trampas de apertura:', 'Opening traps:', 'Trampes d\'obertura:'],
    ['opening.trapNone', '— Elige una trampa —', '— Choose a trap —', '— Tria una trampa —'],
    ['opening.groupTraps', 'Trampas de apertura', 'Opening traps', 'Trampes d\'obertura'],
    ['opening.trapLegal', 'Mate de Legal (blancas)', 'Legal’s mate (White)', 'Mat de Legal (blanques)'],
    ['opening.trapElephant', 'Trampa del elefante (negras)', 'Elephant trap (Black)', 'Trampa de l\'elefant (negres)'],
    ['opening.trapNoah', 'Arca de Noé (negras)', 'Noah’s Ark trap (Black)', 'Arca de Noè (negres)'],
    ['opening.trapLasker', 'Trampa de Lasker (negras)', 'Lasker trap (Black)', 'Trampa de Lasker (negres)'],
    ['opening.trapBudapest', 'Budapest Kieninger (negras)', 'Budapest Kieninger (Black)', 'Budapest Kieninger (negres)'],
    ['opening.trapCaro', 'Caro-Kann Nd6# (blancas)', 'Caro-Kann Nd6# (White)', 'Caro-Kann Nd6# (blanques)'],
    ['opening.trapFried', 'Fegatello / Fried Liver (blancas)', 'Fried Liver (White)', 'Fegatello / Fried Liver (blanques)'],
    ['opening.trapBlackburne', 'Blackburne Shilling (negras)', 'Blackburne Shilling (Black)', 'Blackburne Shilling (negres)'],
    ['opening.trapFishing', 'Caña de pescar (negras)', 'Fishing Pole (Black)', 'Canya de pescar (negres)'],
    ['opening.trapScholar', 'Mate del pastor (blancas)', 'Scholar’s mate (White)', 'Mat del pastor (blanques)'],
    ['opening.trapDamiano', 'Trampa de Damiano (blancas)', 'Damiano trap (White)', 'Trampa de Damiano (blanques)'],
    ['opening.trapEnglund', 'Gambito Englund (negras)', 'Englund Gambit trap (Black)', 'Gambit Englund (negres)'],
    ['opening.trapSiberian', 'Trampa siberiana (negras)', 'Siberian trap (Black)', 'Trampa siberiana (negres)'],
    ['opening.trapMagnusSmith', 'Magnus Smith (blancas)', 'Magnus Smith trap (White)', 'Magnus Smith (blanques)'],
    ['opening.trapMonticelli', 'Monticelli (blancas)', 'Monticelli trap (White)', 'Monticelli (blanques)'],
    ['opening.trapTarrasch', 'Tarrasch Española (blancas)', 'Tarrasch trap (White)', 'Tarrasch Espanyola (blanques)'],
    ['opening.trapCambridge', 'Cambridge Springs (negras)', 'Cambridge Springs (Black)', 'Cambridge Springs (negres)'],
    ['opening.trapMortimer', 'Mortimer (negras)', 'Mortimer trap (Black)', 'Mortimer (negres)'],
    ['opening.trapWurzburger', 'Würzburger (blancas)', 'Würzburger trap (White)', 'Würzburger (blanques)'],
    ['opening.trapOpera', 'Mate de la Ópera (blancas)', 'Opera mate (White)', 'Mat de l\'Òpera (blanques)'],
    ['opening.trapTraxler', 'Traxler (negras)', 'Traxler counterattack (Black)', 'Traxler (negres)'],
    ['opening.trapStafford', 'Gambito Stafford (negras)', 'Stafford Gambit (Black)', 'Gambit Stafford (negres)'],
    ['opening.trapMatovinsky', 'Matovinsky (blancas)', 'Matovinsky gambit (White)', 'Matovinsky (blanques)'],
    ['opening.trapHalosar', 'Halosar (blancas)', 'Halosar trap (White)', 'Halosar (blanques)'],
    ['opening.trapFool', 'Mate del loco (negras)', 'Fool’s mate (Black)', 'Mat del boig (negres)'],
    ['opening.trapCatMate', 'Jaque mate', 'Checkmate', 'Escac i mat'],
    ['opening.trapCatQueen', 'Ganar dama', 'Win the queen', 'Guanyar dama'],
    ['opening.trapCatPiece', 'Ganar pieza', 'Win a piece', 'Guanyar peça'],
    ['opening.trapCatTrap', 'Cazar pieza', 'Trap a piece', 'Caçar peça'],
    ['opening.trapCatAttack', 'Ataque al rey', 'Attack the king', 'Atac al rei'],
    ['opening.trapLolli', 'Ataque Lolli (blancas)', 'Lolli Attack (White)', 'Atac Lolli (blanques)'],
    ['opening.trapHalloween', 'Gambito Halloween (blancas)', 'Halloween Gambit (White)', 'Gambit Halloween (blanques)'],
    ['opening.trapDanish', 'Gambito danés (blancas)', 'Danish Gambit (White)', 'Gambit danès (blanques)'],
    ['opening.trapPonziani', 'Ponziani Fraser (blancas)', 'Ponziani Fraser (White)', 'Ponziani Fraser (blanques)'],
    ['opening.trapScandi', 'Escandinava alfil (blancas)', 'Scandinavian bishop (White)', 'Escandinava alfil (blanques)'],
    ['opening.trapAlekhine', 'Alekhine c7 (blancas)', 'Alekhine c7 (White)', 'Alekhine c7 (blanques)'],
    ['opening.trapEnglish', 'Inglesa Nxe5 (blancas)', 'English Nxe5 (White)', 'Anglesa Nxe5 (blanques)'],
    ['opening.trapFrom', 'Gambito From (negras)', 'From’s Gambit (Black)', 'Gambit From (negres)'],
    ['opening.trapGrob', 'Grob / Spike (blancas)', 'Grob / Spike (White)', 'Grob / Spike (blanques)'],
    ['opening.trapSokolsky', 'Sokolsky 1.b4 (blancas)', 'Sokolsky 1.b4 (White)', 'Sokolsky 1.b4 (blanques)'],
    ['opening.trapFajarowicz', 'Fajarowicz (negras)', 'Fajarowicz (Black)', 'Fajarowicz (negres)'],
    ['opening.trapHillbilly', 'Hillbilly Caro-Kann (blancas)', 'Hillbilly Caro-Kann (White)', 'Hillbilly Caro-Kann (blanques)'],
    ['opening.trapFrankenstein', 'Frankenstein-Drácula (blancas)', 'Frankenstein–Dracula (White)', 'Frankenstein-Dràcula (blanques)'],
    ['opening.trapCochrane', 'Cochrane Petrov (blancas)', 'Cochrane Petrov (White)', 'Cochrane Petrov (blanques)'],
    ['opening.trapGreco', 'Greco Italiana (blancas)', 'Greco Italian (White)', 'Greco italiana (blanques)'],
    ['opening.trapCadet', 'Mate del cadete (blancas)', 'Sea-cadet mate (White)', 'Mat del cadet (blanques)'],
    ['opening.trapWinter', 'Winter Caro-Kann (blancas)', 'Winter Caro-Kann (White)', 'Winter Caro-Kann (blanques)'],
    ['opening.trapMarshall', 'Marshall Francesa (blancas)', 'Marshall French (White)', 'Marshall francesa (blanques)'],
    ['opening.trapMuzio', 'Muzio Gambito de Rey (blancas)', 'Muzio King’s Gambit (White)', 'Muzio gambito de rei (blanques)'],
    ['opening.trapAllgaier', 'Allgaier Gambito de Rey (blancas)', 'Allgaier King’s Gambit (White)', 'Allgaier gambito de rei (blanques)'],
    ['opening.trapLatvian', 'Gambito letón (blancas)', 'Latvian Gambit (White)', 'Gambit letó (blanques)'],
    ['opening.trapJerome', 'Jerome (blancas)', 'Jerome Gambit (White)', 'Jerome (blanques)'],
    ['opening.trapStaunton', 'Staunton Holandesa (blancas)', 'Staunton Dutch (White)', 'Staunton holandesa (blanques)'],
    ['opening.trapGrunfeld', 'Grünfeld Bg4 (blancas)', 'Grünfeld Bg4 (White)', 'Grünfeld Bg4 (blanques)'],
    ['opening.trapRiga', 'Riga Española (blancas)', 'Riga Spanish (White)', 'Riga espanyola (blanques)'],
    ['opening.trapMaxLange', 'Max Lange (blancas)', 'Max Lange (White)', 'Max Lange (blanques)'],
    ['opening.trapElephGambit', 'Gambito de elefante (blancas)', 'Elephant Gambit (White)', 'Gambit d\'elefant (blanques)'],
    ['opening.trapNapoleon', 'Mate de Napoleón (blancas)', 'Napoleon’s mate (White)', 'Mat de Napoleó (blanques)'],
    ['opening.trapWayward', 'Wayward Queen (blancas)', 'Wayward Queen (White)', 'Wayward Queen (blanques)'],
    ['opening.trapRousseau', 'Rousseau (blancas)', 'Rousseau Gambit (White)', 'Rousseau (blanques)'],
    ['opening.trapWinawer', 'Winawer peón envenenado (blancas)', 'Winawer Poisoned Pawn (White)', 'Winawer peó enverinat (blanques)'],
    ['opening.trapNakhmanson', 'Nakhmanson (blancas)', 'Nakhmanson Gambit (White)', 'Nakhmanson (blanques)'],
    ['opening.trapPhilidorCg', 'Contragambito Philidor (blancas)', 'Philidor Countergambit (White)', 'Contragambit Philidor (blanques)'],
    ['opening.trapPortuguese', 'Portugués Escandinava (blancas)', 'Portuguese Scandinavian (White)', 'Portuguès escandinava (blanques)'],
    ['opening.trapMonkeys', 'Monkey’s Bum (blancas)', 'Monkey’s Bum (White)', 'Monkey’s Bum (blanques)'],
    ['opening.trapSchliemann', 'Schliemann / Jaenisch (blancas)', 'Schliemann / Jaenisch (White)', 'Schliemann / Jaenisch (blanques)'],
    ['opening.trapForWhite', '♔ Buena para blancas', '♔ Good for White', '♔ Bona per a blanques'],
    ['opening.trapForBlack', '♚ Buena para negras', '♚ Good for Black', '♚ Bona per a negres'],
    ['opening.trapDubious', 'Espectacular / dudosa si no pican', 'Spectacular / dubious if they do not fall for it', 'Espectacular / dubtosa si no piquen'],
    ['opening.trapWhy', 'Por qué funciona:', 'Why it works:', 'Per què funciona:'],
    ['opening.trapRefute', 'Cómo evitarla:', 'How to avoid it:', 'Com evitar-la:'],
    ['opening.startTraining', '♟ Iniciar Entrenamiento', '♟ Start Training', '♟ Inicia l\'entrenament'],
    ['opening.knownVariants', '📖 Variantes Conocidas', '📖 Known Variations', '📖 Variants conegudes'],
    ['opening.quiz', '🧠 Quiz: Adivina el Movimiento', '🧠 Quiz: Guess the Move', '🧠 Quiz: Endevina el moviment'],
    ['opening.completed', 'Apertura completada', 'Opening completed', 'Obertura completada'],
    ['opening.pressVariants', 'Pulsa variantes sobre el tablero para reemprender apertura', 'Tap variations on the board to resume the opening', 'Prem variants sobre el tauler per reprendre l\'obertura'],
    ['opening.tapToSeeVariants', 'Pulsa para ver las variantes', 'Tap to see the variations', 'Prem per veure les variants'],
    ['opening.continueGame', '▶ Continuar Partida', '▶ Continue Game', '▶ Continua la partida'],
    ['opening.continueOpening', '📖 Continuar Apertura', '📖 Continue Opening', '📖 Continua l\'obertura'],
    ['opening.variantsHint', 'Selecciona una variante para continuar', 'Select a variation to continue', 'Selecciona una variant per continuar'],
    ['opening.variantsTitle', '📖 Variantes conocidas ({n})', '📖 Known variations ({n})', '📖 Variants conegudes ({n})'],
    ['opening.unknownVariant', 'Variante desconocida', 'Unknown variation', 'Variant desconeguda'],
    ['opening.variantsExampleAlt', 'Ejemplo de variantes mostradas sobre el tablero', 'Example of variations shown on the board', 'Exemple de variants mostrades sobre el tauler'],
    ['puzzle.millions', '~5,5 millones de problemas', '~5.5 million puzzles', '~5,5 milions de problemes'],
    ['puzzle.category', 'Categoría:', 'Category:', 'Categoria:'],
    ['puzzle.all', '— Todas —', '— All —', '— Totes —'],
    ['puzzle.mate1', '♔ Mate en 1', '♔ Mate in 1', '♔ Mat en 1'],
    ['puzzle.mate2', '♔ Mate en 2', '♔ Mate in 2', '♔ Mat en 2'],
    ['puzzle.mate3', '♔ Mate en 3', '♔ Mate in 3', '♔ Mat en 3'],
    ['puzzle.mate4', '♔ Mate en 4', '♔ Mate in 4', '♔ Mat en 4'],
    ['puzzle.mate5', '♔ Mate en 5', '♔ Mate in 5', '♔ Mat en 5'],
    ['puzzle.fork', '⚔️ Horquilla / Doble ataque', '⚔️ Fork / Double attack', '⚔️ Forquilla / Doble atac'],
    ['puzzle.pin', '📌 Clavada', '📌 Pin', '📌 Clavada'],
    ['puzzle.sacrifice', '💎 Sacrificio', '💎 Sacrifice', '💎 Sacrifici'],
    ['puzzle.attack', '⚡ Ataque', '⚡ Attack', '⚡ Atac'],
    ['puzzle.defense', '🛡️ Defensa', '🛡️ Defence', '🛡️ Defensa'],
    ['puzzle.endgame', '♟ Finales', '♟ Endgames', '♟ Finals'],
    ['puzzle.center', '🎯 Control central', '🎯 Central control', '🎯 Control central'],
    ['puzzle.capture', '🔄 Captura táctica', '🔄 Tactical capture', '🔄 Captura tàctica'],
    ['puzzle.development', '📐 Desarrollo', '📐 Development', '📐 Desenvolupament'],
    ['puzzle.tactic', '🧠 Táctica general', '🧠 General tactics', '🧠 Tàctica general'],
    ['puzzle.other', '🎲 Otros', '🎲 Other', '🎲 Altres'],
    ['puzzle.hint', '💡 Pista', '💡 Hint', '💡 Pista'],
    ['puzzle.solution', '👁 Ver solución', '👁 Show solution', '👁 Veure solució'],
    ['puzzle.prev', 'Problema anterior', 'Previous puzzle', 'Problema anterior'],
    ['puzzle.next', 'Siguiente problema', 'Next puzzle', 'Següent problema'],
    ['puzzle.close', 'Cerrar problemas', 'Close puzzles', 'Tanca els problemes'],
    ['famous.selected', '⭐ Partidas Seleccionadas', '⭐ Selected Games', '⭐ Partides seleccionades'],
    ['famous.choose', '— Elegir partida —', '— Choose a game —', '— Tria partida —'],
    ['famous.immortalGroup', '♔ Partidas Inmortales y Clásicas', '♔ Immortal and Classic Games', '♔ Partides immortals i clàssiques'],
    ['famous.worldChamps', '⚔️ Campeonatos del Mundo', '⚔️ World Championships', '⚔️ Campionats del món'],
    ['famous.candidates', '🏆 FIDE Candidates 2026 Cyprus', '🏆 FIDE Candidates 2026 Cyprus', '🏆 FIDE Candidates 2026 Cyprus'],
    ['famous.otherMasters', '🌟 Otros Maestros', '🌟 Other Masters', '🌟 Altres mestres'],
    ['famous.library', '📚 Biblioteca de jugadores', '📚 Player library', '📚 Biblioteca de jugadors'],
    ['famous.selectPlayer', 'Selecciona un jugador:', 'Select a player:', 'Selecciona un jugador:'],
    ['famous.allPlayers', '— Todos los jugadores —', '— All players —', '— Tots els jugadors —'],
    ['famous.selectGame', 'Selecciona una partida:', 'Select a game:', 'Selecciona una partida:'],
    ['famous.loadingLibrary', 'Cargando biblioteca…', 'Loading library…', 'Carregant biblioteca…'],
    ['learn.hint', '💡 Pista', '💡 Hint', '💡 Pista'],
    ['learn.exit', '✕ Salir', '✕ Exit', '✕ Surt'],
    ['clock.white', 'Blancas', 'White', 'Blanques'],
    ['clock.black', 'Negras', 'Black', 'Negres'],
    ['chat.placeholder', 'Escribe un mensaje…', 'Type a message…', 'Escriu un missatge…'],
    ['chat.aria', 'Mensaje para el oponente', 'Message to opponent', 'Missatge per a l\'oponent'],
    ['chat.send', 'Enviar', 'Send', 'Envia'],
    ['config.language', 'Idioma:', 'Language:', 'Idioma:'],
    ['config.playAs', 'Juegas con:', 'You play as:', 'Jugues amb:'],
    ['config.playVs', 'Juegas Contra:', 'You play against:', 'Jugues contra:'],
    ['config.difficulty', 'Nivel de Dificultad:', 'Difficulty level:', 'Nivell de dificultat:'],
    ['config.time', 'Control de Tiempo:', 'Time control:', 'Control de temps:'],
    ['config.theme', 'Tema del Tablero:', 'Board theme:', 'Tema del tauler:'],
    ['config.pieces', 'Estilo de Piezas:', 'Piece style:', 'Estil de peces:'],
    ['config.coords', ' Coordenadas en Casillas', ' Square coordinates', ' Coordenades a les caselles'],
    ['config.board3d', ' Tablero 3D', ' 3D board', ' Tauler 3D'],
    ['config.moveArrow', ' Flecha movimiento', ' Move arrow', ' Fletxa de moviment'],
    ['config.helpMsgs', ' Mensajes de Ayuda', ' Help messages', ' Missatges d\'ajuda'],
    ['config.sounds', ' Sonidos', ' Sounds', ' Sons'],
    ['config.zoom', '🔍 Zoom — ', '🔍 Zoom — ', '🔍 Zoom — '],
    ['config.videoHelp', '❓ Ayuda en Vídeo', '❓ Video Help', '❓ Ajuda en vídeo'],
    ['login.start', 'Iniciar Sesión', 'Sign In', 'Inicia sessió'],
    ['login.startTitle', 'Iniciar sesión online', 'Sign in online', 'Inicia sessió en línia'],
    ['color.white', 'Blancas', 'White', 'Blanques'],
    ['color.black', 'Negras', 'Black', 'Negres'],
    ['color.random', 'Aleatorio', 'Random', 'Aleatori'],
    ['color.playWhite', 'Jugar con blancas', 'Play as White', 'Jugar amb blanques'],
    ['color.playBlack', 'Jugar con negras', 'Play as Black', 'Jugar amb negres'],
    ['color.playRandom', 'Color aleatorio', 'Random colour', 'Color aleatori'],
    ['opp.ai', 'IA', 'AI', 'IA'],
    ['opp.online', 'On-line', 'Online', 'En línia'],
    ['opp.mail', 'Por Correo', 'By Email', 'Per correu'],
    ['opp.pvp', 'Persona vs Persona', 'Person vs Person', 'Persona vs persona'],
    ['opp.aiTitle', 'Inteligencia Artificial', 'Artificial Intelligence', 'Intel·ligència artificial'],
    ['opp.onlineTitle', 'Jugar online', 'Play online', 'Jugar en línia'],
    ['opp.mailTitle', 'Por correo', 'By email', 'Per correu'],
    ['opp.pvpTitle', 'Persona vs persona', 'Person vs person', 'Persona vs persona'],
    ['level.1', 'Muy Fácil (~400 ELO)', 'Very Easy (~400 ELO)', 'Molt fàcil (~400 ELO)'],
    ['level.2', 'Fácil (~600 ELO)', 'Easy (~600 ELO)', 'Fàcil (~600 ELO)'],
    ['level.3', 'Principiante (~800 ELO)', 'Beginner (~800 ELO)', 'Principiant (~800 ELO)'],
    ['level.4', 'Aficionado (~1000 ELO)', 'Club player (~1000 ELO)', 'Aficionat (~1000 ELO)'],
    ['level.5', 'Intermedio (~1200 ELO)', 'Intermediate (~1200 ELO)', 'Intermedi (~1200 ELO)'],
    ['level.6', 'Avanzado (~1500 ELO)', 'Advanced (~1500 ELO)', 'Avançat (~1500 ELO)'],
    ['level.7', 'Experto (~1800 ELO)', 'Expert (~1800 ELO)', 'Expert (~1800 ELO)'],
    ['level.8', 'Maestro (~2200 ELO)', 'Master (~2200 ELO)', 'Mestre (~2200 ELO)'],
    ['time.bullet', '⚡ Bullet', '⚡ Bullet', '⚡ Bullet'],
    ['time.blitz', '⚔️ Blitz', '⚔️ Blitz', '⚔️ Blitz'],
    ['time.rapid', '🎯 Rápidas', '🎯 Rapid', '🎯 Ràpides'],
    ['time.classic', '♔ Clásicas', '♔ Classical', '♔ Clàssiques'],
    ['time.1min', '1 min', '1 min', '1 min'],
    ['time.1plus1', '1 min + 1 seg', '1 min + 1 sec', '1 min + 1 seg'],
    ['time.2plus1', '2 min + 1 seg', '2 min + 1 sec', '2 min + 1 seg'],
    ['time.3min', '3 min', '3 min', '3 min'],
    ['time.3plus2', '3 min + 2 seg', '3 min + 2 sec', '3 min + 2 seg'],
    ['time.5min', '5 min', '5 min', '5 min'],
    ['time.5plus3', '5 min + 3 seg', '5 min + 3 sec', '5 min + 3 seg'],
    ['time.10min', '10 min', '10 min', '10 min'],
    ['time.10plus5', '10 min + 5 seg', '10 min + 5 sec', '10 min + 5 seg'],
    ['time.15plus10', '15 min + 10 seg', '15 min + 10 sec', '15 min + 10 seg'],
    ['time.30min', '30 min', '30 min', '30 min'],
    ['time.60min', '60 min', '60 min', '60 min'],
    ['time.90plus30', '90 min + 30 seg', '90 min + 30 sec', '90 min + 30 seg'],
    ['theme.classic', 'Clásico', 'Classic', 'Clàssic'],
    ['theme.wood', 'Madera', 'Wood', 'Fusta'],
    ['theme.blue', 'Azul', 'Blue', 'Blau'],
    ['theme.green', 'Verde', 'Green', 'Verd'],
    ['theme.gray', 'Gris', 'Grey', 'Gris'],
    ['config.appearance', 'Apariencia:', 'Appearance:', 'Aparença:'],
    ['appearance.auto', 'Automática (sistema)', 'Automatic (system)', 'Automàtica (sistema)'],
    ['appearance.light', 'Clara', 'Light', 'Clara'],
    ['appearance.dark', 'Oscura', 'Dark', 'Fosca'],
    ['pieces.letter', 'Letras', 'Letters', 'Lletres'],
    ['action.resign', 'Abandonar', 'Resign', 'Abandonar'],
    ['action.draw', 'Pedir Tablas', 'Offer Draw', 'Demana taules'],
    ['action.continue', 'Continuar Partida', 'Continue Game', 'Continua la partida'],
    ['action.undo', 'Deshacer Movimiento', 'Undo Move', 'Desfés el moviment'],
    ['action.hint', 'Sugerencia de IA', 'AI Hint', 'Suggeriment de la IA'],
    ['action.analyze', 'Analizar Partida', 'Analyse Game', 'Analitza la partida'],
    ['action.copyPgn', 'Copiar PGN', 'Copy PGN', 'Copia el PGN'],
    ['action.exportPgn', 'Exportar PGN', 'Export PGN', 'Exporta el PGN'],
    ['action.importPgn', 'Importar PGN', 'Import PGN', 'Importa el PGN'],
    ['action.share', '🔗 Compartir partida (+10 ELO)', '🔗 Share game (+10 ELO)', '🔗 Comparteix la partida (+10 ELO)'],
    ['action.shareShort', 'Compartir', 'Share', 'Comparteix'],
    ['action.viewAnalysis', '📊 Ver análisis post-partida', '📊 View post-game analysis', '📊 Veure l\'anàlisi postpartida'],
    ['action.resignBtn', '🏳️ Abandonar', '🏳️ Resign', '🏳️ Abandonar'],
    ['action.drawBtn', '🤝 Pedir Tablas', '🤝 Offer Draw', '🤝 Demana taules'],
    ['action.continueBtn', '▶ Continuar Partida', '▶ Continue Game', '▶ Continua la partida'],
    ['action.undoBtn', '↺ Deshacer Movimiento', '↺ Undo Move', '↺ Desfés el moviment'],
    ['action.hintBtn', '💡 Sugerencia de IA', '💡 AI Hint', '💡 Suggeriment de la IA'],
    ['action.analyzeBtn', '📊 Analizar Partida', '📊 Analyse Game', '📊 Analitza la partida'],
    ['action.copyBtn', '📋 Copiar PGN', '📋 Copy PGN', '📋 Copia el PGN'],
    ['action.exportBtn', '📄 Exportar PGN', '📄 Export PGN', '📄 Exporta el PGN'],
    ['action.importBtn', '📥 Importar PGN', '📥 Import PGN', '📥 Importa el PGN'],
    ['stats.wins', 'Ganadas', 'Wins', 'Guanyades'],
    ['stats.draws', 'Tablas', 'Draws', 'Taules'],
    ['stats.losses', 'Perdidas', 'Losses', 'Perdudes'],
    ['stats.eloTitle', 'Tu ELO', 'Your ELO', 'El teu ELO'],
    ['feedback.link', 'Informar de errores/mejoras', 'Report bugs / suggestions', 'Informa d\'errors/millores'],
    ['feedback.title', '📧 Informar de errores/mejoras', '📧 Report bugs / suggestions', '📧 Informa d\'errors/millores'],
    ['feedback.prompt', '¿Has encontrado algún fallo o tienes una idea para mejorar AjedrezIA? Tu opinión nos ayuda mucho.', 'Found a bug or have an idea to improve AjedrezIA? Your feedback helps a lot.', 'Has trobat algun error o tens una idea per millorar AjedrezIA? La teva opinió ens ajuda molt.'],
    ['feedback.form', 'Cuéntanos qué falla o qué se podría mejorar. Se enviará por correo al equipo de AjedrezIA.', 'Tell us what is wrong or what could be improved. It will be emailed to the AjedrezIA team.', 'Explica\'ns què falla o què es podria millorar. S\'enviarà per correu a l\'equip d\'AjedrezIA.'],
    ['help.menu', 'Ayuda en vídeo', 'Video help', 'Ajuda en vídeo'],
    ['help.intro', 'Elige un tema para ver el tutorial en YouTube.', 'Choose a topic to watch the YouTube tutorial.', 'Tria un tema per veure el tutorial a YouTube.'],
    ['help.fullTutorial', '📚 Tutorial Completo', '📚 Full Tutorial', '📚 Tutorial complet'],
    ['help.analysis', '📊 Análisis', '📊 Analysis', '📊 Anàlisi'],
    ['help.share', '📤 Compartir', '📤 Share', '📤 Comparteix'],
    ['help.titleIntro', 'Ayuda · Introducción', 'Help · Introduction', 'Ajuda · Introducció'],
    ['help.enableSound', 'Activar sonido', 'Enable sound', 'Activa el so'],
    ['help.openYoutube', 'Abrir en YouTube', 'Open on YouTube', 'Obre a YouTube'],
    ['help.dontShow', ' No volver a mostrar', ' Don’t show again', ' No ho tornis a mostrar'],
    ['close', 'Cerrar', 'Close', 'Tanca'],
    ['cancel', 'Cancelar', 'Cancel', 'Cancel·la'],
    ['confirm', 'Confirmar', 'Confirm', 'Confirma'],
    ['accept', 'Aceptar', 'Accept', 'Accepta'],
    ['ok', 'OK', 'OK', 'OK'],
    ['continue', 'Continuar', 'Continue', 'Continua'],
    ['login.subtitle', 'Inicia sesión con tu usuario o Google para jugar online o invitar por correo.', 'Sign in with your username or Google to play online or invite by email.', 'Inicia sessió amb el teu usuari o Google per jugar en línia o convidar per correu.', 'Melde dich mit Benutzername oder Google an, um online zu spielen oder per E-Mail einzuladen.', 'Connecte-toi avec ton identifiant ou Google pour jouer en ligne ou inviter par e-mail.', 'Accedi con il tuo utente o Google per giocare online o invitare per e-mail.', 'Inicia sessão com o teu utilizador ou Google para jogar online ou convidar por e-mail.', '使用用户名或 Google 登录，以便在线对弈或通过邮件邀请。', 'Войди с ником или через Google, чтобы играть онлайн или пригласить по почте.', 'سجّل الدخول باسمك أو عبر Google للعب عبر الإنترنت أو الدعوة بالبريد.', 'オンライン対局やメール招待には、ユーザー名または Google でサインインしてください。', 'ऑनलाइन खेलने या ईमेल से आमंत्रित करने के लिए यूज़रनेम या Google से साइन इन करें।', '온라인 대국이나 이메일 초대를 하려면 사용자 이름 또는 Google로 로그인하세요.'],
    ['login.connecting', 'Conectando…', 'Connecting…', 'Connectant…'],
    ['login.user', 'Usuario:', 'Username:', 'Usuari:'],
    ['login.password', 'Contraseña:', 'Password:', 'Contrasenya:'],
    ['login.nickPlaceholder', 'Tu nickname', 'Your nickname', 'El teu sobrenom'],
    ['login.pwdPlaceholder', 'Tu contraseña', 'Your password', 'La teva contrasenya'],
    ['login.showPwd', 'Ver contraseña', 'Show password', 'Mostra la contrasenya'],
    ['login.or', 'o', 'or', 'o'],
    ['login.google', 'Continuar con Google', 'Continue with Google', 'Continua amb Google'],
    ['login.guest', 'Acceder como Invitado', 'Continue as Guest', 'Accedir com a convidat'],
    ['login.guestProvider', '👤 Acceso como Invitado', '👤 Guest access', '👤 Accés com a convidat'],
    ['login.legalBefore', 'Al continuar aceptas los ', 'By continuing you accept the ', 'En continuar acceptes els '],
    ['login.legalAnd', ' y la ', ' and the ', ' i la '],
    ['login.legal', 'Al continuar aceptas los Términos de servicio y la Política de privacidad.', 'By continuing you accept the Terms of Service and the Privacy Policy.', 'En continuar acceptes els Termes del servei i la Política de privadesa.'],
    ['login.terms', 'Términos de servicio', 'Terms of Service', 'Termes del servei'],
    ['login.privacy', 'Política de privacidad', 'Privacy Policy', 'Política de privadesa'],
    ['login.inviteOnline', '⚔️ Invitar a partida online', '⚔️ Invite to an online game', '⚔️ Convida a una partida en línia'],
    ['login.findPlayer', '🌐 Buscar jugador online', '🌐 Find an online player', '🌐 Cerca un jugador en línia'],
    ['login.signOut', 'Cerrar sesión', 'Sign out', 'Tanca la sessió'],
    ['users.title', '🌐 Jugadores Registrados', '🌐 Registered Players', '🌐 Jugadors registrats'],
    ['users.searching', 'Buscando jugadores…', 'Looking for players…', 'Cercant jugadors…'],
    ['users.refresh', '🔄 Actualizar', '🔄 Refresh', '🔄 Actualitza'],
    ['users.empty', 'No hay jugadores online ahora mismo.', 'There are no players online right now.', 'No hi ha jugadors en línia ara mateix.'],
    ['onlineNow.title', 'Conectados', 'Online now', 'Connectats', 'Online', 'En ligne', 'Online', 'Ligados', '在线', 'В сети', 'متصلون', 'オンライン', 'ऑनलाइन', '온라인'],
    ['onlineNow.empty', 'Nadie conectado ahora', 'No one is online right now', 'Ningú connectat ara', 'Gerade ist niemand online', 'Personne en ligne pour le moment', 'Nessuno è online adesso', 'Ninguém ligado agora', '当前没有人在线', 'Сейчас никого нет в сети', 'لا أحد متصل الآن', '今オンラインの人はいません', 'अभी कोई ऑनलाइन नहीं है', '지금 온라인인 사람이 없습니다'],
    ['users.registered', '{n} jugadores registrados', '{n} registered players', '{n} jugadors registrats'],
    ['users.online', '{n} online', '{n} online', '{n} en línia'],
    ['users.available', '{n} disponible', '{n} available', '{n} disponible'],
    ['users.availablePlural', '{n} disponibles', '{n} available', '{n} disponibles'],
    ['users.sample', ' (datos de ejemplo)', ' (sample data)', ' (dades d\'exemple)'],
    ['invite.title', '⚔️ Invitar a jugar', '⚔️ Invite to play', '⚔️ Convida a jugar'],
    ['invite.playAs', 'Juego con:', 'I play as:', 'Jugo amb:'],
    ['invite.clock', 'Reloj / Tiempo:', 'Clock / Time:', 'Rellotge / Temps:'],
    ['invite.waiting', 'Esperando respuesta…', 'Waiting for a reply…', 'Esperant resposta…'],
    ['invite.challenge', 'Te reto a una partida on-line', 'I challenge you to an online game', 'Et reto a una partida en línia'],
    ['invite.accept', '✅ Aceptar', '✅ Accept', '✅ Accepta'],
    ['invite.send', '📨 Enviar invitación', '📨 Send invitation', '📨 Envia la invitació'],
    ['feedback.report', '📨 Informar', '📨 Report', '📨 Informa'],
    ['feedback.notNow', 'Ahora no', 'Not now', 'Ara no'],
    ['feedback.error', 'Error:', 'Bug:', 'Error:'],
    ['feedback.improve', 'Mejora:', 'Suggestion:', 'Millora:'],
    ['feedback.errorPh', 'Describe aquí el error encontrado (opcional)', 'Describe the bug you found (optional)', 'Descriu aquí l\'error trobat (opcional)'],
    ['feedback.improvePh', 'Describe aquí tu sugerencia de mejora (opcional)', 'Describe your suggestion (optional)', 'Descriu aquí el teu suggeriment de millora (opcional)'],
    ['feedback.send', 'Enviar', 'Send', 'Envia'],
    ['feedback.osLine', 'Sistema operativo: {os}', 'Operating system: {os}', 'Sistema operatiu: {os}', 'Betriebssystem: {os}', 'Système d’exploitation : {os}', 'Sistema operativo: {os}', 'Sistema operativo: {os}', '操作系统：{os}', 'Операционная система: {os}', 'نظام التشغيل: {os}', 'OS: {os}', 'ऑपरेटिंग सिस्टम: {os}', '운영 체제: {os}'],
    ['feedback.screenLine', 'Pantalla: {screen}', 'Screen: {screen}', 'Pantalla: {screen}', 'Bildschirm: {screen}', 'Écran : {screen}', 'Schermo: {screen}', 'Ecrã: {screen}', '屏幕：{screen}', 'Экран: {screen}', 'الشاشة: {screen}', '画面: {screen}', 'स्क्रीन: {screen}', '화면: {screen}'],
    ['install.prompt', '¿Quieres instalar la web como app?', 'Do you want to install the site as an app?', 'Vols instal·lar el web com a app?', 'Möchtest du die Website als App installieren?', 'Veux-tu installer le site comme application ?', 'Vuoi installare il sito come app?', 'Queres instalar o site como aplicação?', '要把网站安装成应用吗？', 'Установить сайт как приложение?', 'هل تريد تثبيت الموقع كتطبيق؟', 'このサイトをアプリとしてインストールしますか？', 'क्या आप वेबसाइट को ऐप के रूप में इंस्टॉल करना चाहते हैं?', '이 사이트를 앱으로 설치할까요?'],
    ['draw.acceptBtn', 'Aceptar tablas', 'Accept draw', 'Accepta les taules'],
    ['draw.rejectBtn', 'Rechazar', 'Decline', 'Rebutja'],
    ['resign.confirmBtn', 'Abandonar', 'Resign', 'Abandonar'],
    ['draw.title', 'Tu rival ofrece tablas', 'Your opponent offers a draw', 'El teu rival ofereix taules'],
    ['draw.subtitle', '¿Aceptas las tablas?', 'Do you accept the draw?', 'Acceptes les taules?'],
    ['resign.title', '¿Abandonar la partida?', 'Resign the game?', 'Vols abandonar la partida?'],
    ['resign.subtitle', 'Se registrará como derrota y el rival ganará la partida.', 'It will count as a loss and your opponent will win the game.', 'Es registrarà com a derrota i el rival guanyarà la partida.'],
    ['analysis.title', '📊 Análisis post-partida', '📊 Post-game analysis', '📊 Anàlisi postpartida'],
    ['analysis.loading', 'Movimientos analizados: {done} / {total}', 'Moves analysed: {done} / {total}', 'Moviments analitzats: {done} / {total}'],
    ['analysis.loadingDefault', 'Movimientos analizados: 0 / 0', 'Moves analysed: 0 / 0', 'Moviments analitzats: 0 / 0'],
    ['analysis.summaryNav', 'Ver resumen del análisis', 'View analysis summary', 'Veure el resum de l\'anàlisi'],
    ['analysis.prevError', 'Error anterior', 'Previous error', 'Error anterior'],
    ['analysis.nextError', 'Siguiente error', 'Next error', 'Següent error'],
    ['analysis.close', 'Cerrar análisis', 'Close analysis', 'Tanca l\'anàlisi'],
    ['analysis.exists', 'Ya hay un análisis de esta partida.', 'This game already has an analysis.', 'Ja hi ha una anàlisi d\'aquesta partida.'],
    ['analysis.whatToDo', '¿Qué quieres hacer?', 'What do you want to do?', 'Què vols fer?'],
    ['analysis.viewExisting', 'Ver análisis existente', 'View existing analysis', 'Veure l\'anàlisi existent'],
    ['analysis.new', 'Nuevo análisis', 'New analysis', 'Nova anàlisi'],
    ['promo.title', 'Promocionar peón a:', 'Promote pawn to:', 'Promociona el peó a:'],
    ['thinking', 'La IA está calculando...', 'The AI is thinking...', 'La IA està calculant...'],
    ['nav.first', 'Ir al inicio', 'Go to start', 'Vés a l\'inici'],
    ['nav.prev', 'Movimiento anterior', 'Previous move', 'Moviment anterior'],
    ['nav.next', 'Siguiente movimiento', 'Next move', 'Següent moviment'],
    ['nav.last', 'Ir al final', 'Go to end', 'Vés al final'],
    ['flipBoard', 'Girar tablero', 'Flip board', 'Gira el tauler'],
    ['captured.white', 'Blancas: ', 'White: ', 'Blanques: '],
    ['captured.black', 'Negras: ', 'Black: ', 'Negres: '],
    ['rotateDevice', 'Gira el dispositivo a vertical para jugar', 'Rotate the device to portrait to play', 'Gira el dispositiu a vertical per jugar'],
    ['continue.title', 'Continuar Partida', 'Continue Game', 'Continua la partida'],
    ['continue.text', 'Configura la IA y el tiempo para continuar desde esta posición:', 'Set the AI and time to continue from this position:', 'Configura la IA i el temps per continuar des d\'aquesta posició:'],
    ['continue.level', 'Nivel de dificultad:', 'Difficulty level:', 'Nivell de dificultat:'],
    ['continue.time', 'Tiempo partida:', 'Game time:', 'Temps de la partida:'],
    ['continue.btn', '▶ Continuar', '▶ Continue', '▶ Continua'],
    ['turn.white', 'Blancas', 'White', 'Blanques'],
    ['turn.black', 'Negras', 'Black', 'Negres'],
    ['turn.label', 'Turno: {side}', 'Turn: {side}', 'Torn: {side}'],
    ['nav.hint', 'Pulsa ◀ ▶ para navegar', 'Press ◀ ▶ to browse', 'Prem ◀ ▶ per navegar'],
    ['pressContinue', 'Pulsa Continuar Partida', 'Press Continue Game', 'Prem Continua la partida'],
    ['welcome', '¡Bienvenido, {name}! 🎉', 'Welcome, {name}! 🎉', 'Benvingut, {name}! 🎉'],
    ['guestAccess', 'Acceso como {name} 🎉', 'Signed in as {name} 🎉', 'Accés com a {name} 🎉'],
    ['signedOut', 'Sesión cerrada correctamente.', 'Signed out successfully.', 'Sessió tancada correctament.'],
    ['signedOutGuest', 'Sesión cerrada. Continúas como {name}.', 'Signed out. You continue as {name}.', 'Sessió tancada. Continues com a {name}.', 'Abgemeldet. Du machst als {name} weiter.', 'Session fermée. Tu continues en tant que {name}.', 'Sessione chiusa. Continui come {name}.', 'Sessão terminada. Continuas como {name}.', '已退出登录。你将以 {name} 继续。', 'Сеанс завершён. Вы продолжаете как {name}.', 'تم إغلاق الجلسة. تتابع بصفة {name}.', 'ログアウトしました。{name} として続行します。', 'सत्र बंद। आप {name} के रूप में जारी रहते हैं।', '로그아웃했습니다. {name}(으)로 계속합니다.'],
    ['noGame', 'No hay partida en curso', 'There is no game in progress', 'No hi ha cap partida en curs'],
    ['gameNotStarted', 'La partida aún no ha empezado', 'The game has not started yet', 'La partida encara no ha començat'],
    ['noPosition', 'No hay una posición para continuar', 'There is no position to continue from', 'No hi ha una posició per continuar'],
    ['onlineCantChange', 'No puedes cambiar de posición durante una partida online', 'You cannot change position during an online game', 'No pots canviar de posició durant una partida en línia'],
    ['aiTurn', 'Turno de la IA…', 'AI to move…', 'Torn de la IA…'],
    ['continueSides', 'Continúa la partida: mueven {side}', 'Game continues: {side} to move', 'Continua la partida: mouen {side}'],
    ['side.white', 'blancas', 'White', 'blanques'],
    ['side.black', 'negras', 'Black', 'negres'],
    ['checkmate', '¡Jaque Mate! Ganan las {winner}', 'Checkmate! {winner} wins', 'Escac i mat! Guanyen les {winner}'],
    ['stalemate', 'Tablas por ahogado', 'Draw by stalemate', 'Taules per ofegat'],
    ['whiteResigns', 'Negras abandonan — Ganan Blancas', 'Black resigns — White wins', 'Les negres abandonen — Guanyen les blanques'],
    ['blackResigns', 'Blancas abandonan — Ganan Negras', 'White resigns — Black wins', 'Les blanques abandonen — Guanyen les negres'],
    ['drawAgreed', 'Tablas por acuerdo', 'Draw by agreement', 'Taules per acord'],
    ['gameOver', 'Partida finalizada', 'Game over', 'Partida finalitzada'],
    ['positionFinished', 'Esta posición ya está finalizada', 'This position is already finished', 'Aquesta posició ja està finalitzada'],
    ['exitApp', '¿Quieres salir de AjedrezIA?', 'Do you want to leave AjedrezIA?', 'Vols sortir d\'AjedrezIA?'],
    ['noPuzzles', 'No hay problemas con estos filtros', 'No puzzles match these filters', 'No hi ha problemes amb aquests filtres'],
    ['shareOwnLink', 'Este enlace lo enviaste tú. Compártelo con otro jugador.', 'You sent this link. Share it with another player.', 'Aquest enllaç l\'has enviat tu. Comparteix-lo amb un altre jugador.'],
    ['mustLogin', 'Debes iniciar sesión para aceptar.', 'You must sign in to accept.', 'Has d\'iniciar sessió per acceptar.'],
    ['inviteRejected', 'Invitación rechazada.', 'Invitation declined.', 'Invitació rebutjada.'],
    ['drawRejected', 'Has rechazado las tablas.', 'You declined the draw.', 'Has rebutjat les taules.'],
    ['drawOfferRejected', 'Has rechazado la oferta de tablas.', 'You declined the draw offer.', 'Has rebutjat l\'oferta de taules.'],
    ['copyLink', 'Copiar enlace', 'Copy link', 'Copia l\'enllaç'],
    ['copied', '✔ Copiado', '✔ Copied', '✔ Copiat'],
    ['sending', 'Enviando…', 'Sending…', 'Enviant…'],
    ['thanksFeedback', '¡Gracias! Tu mensaje se ha enviado correctamente.', 'Thanks! Your message was sent successfully.', 'Gràcies! El teu missatge s\'ha enviat correctament.'],
    ['feedbackEmpty', 'Escribe al menos un error o una mejora antes de enviar.', 'Write at least one bug or suggestion before sending.', 'Escriu almenys un error o una millora abans d\'enviar.'],
    ['feedbackFail', 'No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.', 'The message could not be sent. Please try again later.', 'No s\'ha pogut enviar el missatge. Torna-ho a provar més tard.'],
    ['feedbackNet', 'Error de conexión al enviar el mensaje.', 'Network error while sending the message.', 'Error de connexió en enviar el missatge.'],
    ['status.available', 'disponible', 'available', 'disponible'],
    ['status.busy', 'ocupado', 'busy', 'ocupat'],
    ['status.offline', 'offline', 'offline', 'offline'],
    ['user.offline', 'Offline', 'Offline', 'Offline'],
    ['user.busy', 'Ocupado', 'Busy', 'Ocupat'],
    ['user.free', 'Libre', 'Free', 'Lliure', 'Frei', 'Libre', 'Libero', 'Livre', '空闲', 'Свободен', 'متاح', '空き', 'खाली', '대기'],
    ['user.onlineStatus', 'Online', 'Online', 'En línia'],
    ['user.cameOnlineBody', '{name} conectado', '{name} connected', '{name} connectat', '{name} verbunden', '{name} connecté', '{name} connesso', '{name} ligado', '{name} 已上线', '{name} в сети', '{name} متصل', '{name} が接続中', '{name} जुड़ा है', '{name} 접속 중'],
    ['user.wentOffline', '{name} se ha desconectado', '{name} disconnected', '{name} s\'ha desconnectat', '{name} hat die Verbindung getrennt', '{name} s\'est déconnecté', '{name} si è disconnesso', '{name} desligou-se', '{name} 已离线', '{name} отключился', '{name} قطع الاتصال', '{name} が切断しました', '{name} डिस्कनेक्ट हो गया', '{name} 연결이 끊겼습니다'],
    ['user.busyYou', 'Ocupado (tú)', 'Busy (you)', 'Ocupat (tu)'],
    ['user.freeYou', 'Libre (tú)', 'Free (you)', 'Lliure (tu)', 'Frei (du)', 'Libre (toi)', 'Libero (tu)', 'Livre (tu)', '空闲（你）', 'Свободен (вы)', 'متاح (أنت)', '空き（あなた）', 'खाली (आप)', '대기 (나)'],
    ['user.onlineYou', 'Online (tú)', 'Online (you)', 'En línia (tu)'],
    ['newVersion', '🆕 Nueva Versión {v}', '🆕 New Version {v}', '🆕 Nova versió {v}'],
    ['opening.seeVariants', 'Ver {n} variantes', 'See {n} variations', 'Veure {n} variants'],
    ['help.video.soon', 'Vídeo disponible próximamente', 'Video coming soon', 'Vídeo disponible properament'],
    ['help.video.intro', '🎬 Introducción a AjedrezIA', '🎬 Introduction to AjedrezIA', '🎬 Introducció a AjedrezIA'],
    ['changelog.3.5.71', 'Al abrir AjedrezIA, el idioma sigue el del navegador (español o inglés) y se recuerda entre sesiones', 'On launch, AjedrezIA follows the browser language (Spanish or English) and remembers it between sessions', 'En obrir AjedrezIA, l\'idioma segueix el del navegador (espanyol o anglès) i es recorda entre sessions'],
    ['changelog.3.5.70', 'Todo el contenido dinámico (mensajes, lecciones, aperturas, problemas y compartir) usa el sistema bilingüe ES/EN', 'All dynamic content (messages, lessons, openings, puzzles and sharing) uses the ES/EN bilingual system', 'Tot el contingut dinàmic (missatges, lliçons, obertures, problemes i compartir) fa servir el sistema bilingüe ES/EN'],
    ['start', 'Comenzar', 'Start', 'Comença'],
    ['newGame.sendInvite', 'Enviar invitación', 'Send invitation', 'Envia la invitació', 'Einladung senden', 'Envoyer l\'invitation', 'Invia invito', 'Enviar convite', '发送邀请', 'Отправить приглашение', 'إرسال الدعوة', '招待を送る', 'आमंत्रण भेजें', '초대 보내기'],
    ['save', '💾 Guardar', '💾 Save', '💾 Desa'],
    ['nameLabel', 'Nombre:', 'Name:', 'Nom:'],
    ['fileName', 'Nombre del archivo:', 'File name:', 'Nom de l\'arxiu:'],
    ['newGameTitle', 'Nueva Partida', 'New Game', 'Nova partida'],
    ['saveGame', 'Guardar Partida', 'Save Game', 'Desa la partida'],
    ['savedGames', 'Partidas Guardadas', 'Saved Games', 'Partides desades'],
    ['gameN', 'Partida {n}', 'Game {n}', 'Partida {n}'],
    ['movesCount', '{n} mov.', '{n} moves', '{n} mov.'],
    ['deleteGame', 'Eliminar partida', 'Delete game', 'Elimina la partida'],
    ['pgnFile', 'Archivo PGN', 'PGN file', 'Arxiu PGN'],
    ['copiedExcl', '¡Copiado!', 'Copied!', 'Copiat!'],
    ['copiedCheck', '✓ Copiado', '✓ Copied', '✓ Copiat'],
    ['copyClipboard', '📋 Copiar', '📋 Copy', '📋 Copia'],
    ['share.email', 'Correo', 'Email', 'Correu'],
    ['share.look', '¡Echa un vistazo en AjedrezIA!', 'Check it out on AjedrezIA!', 'Fes-hi una ullada a AjedrezIA!'],
    ['share.kind.problema', 'Problema de ajedrez y 30 más', 'Chess puzzle and 30 more', 'Problema d\'escacs i 30 més'],
    ['share.kind.partida', 'Partida', 'Game', 'Partida'],
    ['share.kind.apertura', 'Apertura', 'Opening', 'Obertura'],
    ['share.kind.trampa', 'Trampa de apertura', 'Opening trap', 'Trampa d\'obertura'],
    ['share.kind.maestra', 'Partida maestra', 'Master game', 'Partida mestra'],
    ['share.kind.home', 'AjedrezIA', 'AjedrezIA', 'AjedrezIA'],
    ['share.openingNamed', 'Apertura: {name}', 'Opening: {name}', 'Obertura: {name}'],
    ['share.trapNamed', 'Trampa de apertura: {name}', 'Opening trap: {name}', 'Trampa d\'obertura: {name}'],
    ['share.btn.partida', '🔗 Compartir partida', '🔗 Share game', '🔗 Comparteix la partida'],
    ['share.btn.apertura', '🔗 Compartir apertura', '🔗 Share opening', '🔗 Comparteix l\'obertura'],
    ['share.btn.problemas', '🔗 Compartir problemas', '🔗 Share puzzles', '🔗 Comparteix els problemes'],
    ['share.btn.maestra', '🔗 Compartir partida maestra', '🔗 Share master game', '🔗 Comparteix la partida mestra'],
    ['share.btn.generico', '🔗 Compartir', '🔗 Share', '🔗 Comparteix'],
    ['share.inviteMsg', '¡Te reto a una partida en AjedrezIA!\nPartida online', 'I challenge you to a game on AjedrezIA!\nOnline game', 'Et reto a una partida a AjedrezIA!\nPartida en línia'],
    ['share.inviteTitle', 'Invitar online (+10 ELO)', 'Invite online (+10 ELO)', 'Convida en línia (+10 ELO)'],
    ['share.eloSuffix', ' (+{n} ELO)', ' (+{n} ELO)', ' (+{n} ELO)'],
    ['analysis.complete', 'Análisis completo ({done}/{total} movimientos)', 'Full analysis ({done}/{total} moves)', 'Anàlisi completa ({done}/{total} moviments)'],
    ['analysis.partial', 'Análisis parcial ({done}/{total} movimientos)', 'Partial analysis ({done}/{total} moves)', 'Anàlisi parcial ({done}/{total} moviments)'],
    ['analysis.startTitle', 'Iniciar Análisis de Partida', 'Start game analysis', 'Inicia l\'anàlisi de la partida'],
    ['analysis.startBody', 'Se analizarán {n} movimientos online.<br>Esto puede tardar unos segundos.', '{n} moves will be analysed online.<br>This may take a few seconds.', 'S\'analitzaran {n} moviments en línia.<br>Això pot tardar uns segons.'],
    ['analysis.blunder', 'Error grave', 'Blunder', 'Error greu'],
    ['analysis.inaccuracy', 'Imprecisión', 'Inaccuracy', 'Imprecisió'],
    ['analysis.better', 'Mejor: {san}', 'Best: {san}', 'Millor: {san}'],
    ['puzzle.nav', '{theme} ({n} de {total})', '{theme} ({n} of {total})', '{theme} ({n} de {total})'],
    ['puzzle.generic', 'Problema', 'Puzzle', 'Problema'],
    ['puzzle.loadingAll', 'Cargando Todos los Problemas…', 'Loading all puzzles…', 'Carregant tots els problemes…'],
    ['puzzle.loadingTheme', 'Cargando Problemas de {theme}…', 'Loading {theme} puzzles…', 'Carregant problemes de {theme}…'],
    ['puzzle.diff.1', '⭐ Fácil', '⭐ Easy', '⭐ Fàcil'],
    ['puzzle.diff.2', '⭐⭐ Media', '⭐⭐ Medium', '⭐⭐ Mitjana'],
    ['puzzle.diff.3', '⭐⭐⭐ Difícil', '⭐⭐⭐ Hard', '⭐⭐⭐ Difícil'],
    ['puzzle.diff.4', '⭐⭐⭐⭐ Experto', '⭐⭐⭐⭐ Expert', '⭐⭐⭐⭐ Expert'],
    ['puzzle.correctContinue', '¡Correcto! Continúa...', 'Correct! Continue...', 'Correcte! Continua...'],
    ['puzzle.errorBanner', '¡Error en Problema! ({elo})', 'Puzzle error! ({elo})', 'Error al problema! ({elo})'],
    ['puzzle.wrongHint', 'Incorrecto. Las casillas marcadas muestran el movimiento correcto. Inténtalo de nuevo.', 'Incorrect. The marked squares show the right move. Try again.', 'Incorrecte. Les caselles marcades mostren el moviment correcte. Torna-ho a provar.'],
    ['puzzle.yourTurn', 'Tu turno. Encuentra el mejor movimiento.', 'Your turn. Find the best move.', 'El teu torn. Troba el millor moviment.'],
    ['puzzle.streak', ' | Racha: {n}', ' | Streak: {n}', ' | Ratxa: {n}'],
    ['puzzle.hadErrors', ' — hubo fallos ({elo})', ' — there were mistakes ({elo})', ' — hi ha hagut errors ({elo})'],
    ['puzzle.solvedSidebar', '🎉 ¡Problema resuelto!{elo} Aciertos: {ok} | Fallos: {fail} | Precisión: {pct}%{streak}', '🎉 Puzzle solved!{elo} Hits: {ok} | Misses: {fail} | Accuracy: {pct}%{streak}', '🎉 Problema resolt!{elo} Encerts: {ok} | Errors: {fail} | Precisió: {pct}%{streak}'],
    ['puzzle.solvedBanner', '🎉 ¡Problema Resuelto!', '🎉 Puzzle solved!', '🎉 Problema resolt!'],
    ['puzzle.unsolved', '❌ No resuelto — La solución era: {sol}', '❌ Unsolved — The solution was: {sol}', '❌ No resolt — La solució era: {sol}'],
    ['puzzle.hintArrow', '💡 Mueve la pieza señalada con la flecha azul', '💡 Move the piece marked with the blue arrow', '💡 Mou la peça senyalada amb la fletxa blava'],
    ['puzzle.seeSolution', '💡 Ver solución ({elo})', '💡 Show solution ({elo})', '💡 Veure solució ({elo})'],
    ['puzzle.playingSolution', '💡 Reproduciendo la solución…', '💡 Playing the solution…', '💡 Reproduint la solució…'],
    ['puzzle.solutionNow', '💡 Solución: {sol} — Inténtalo ahora', '💡 Solution: {sol} — Try it now', '💡 Solució: {sol} — Prova-ho ara'],
    ['puzzle.solutionOnly', '💡 Solución: {sol}', '💡 Solution: {sol}', '💡 Solució: {sol}'],
    ['learn.exercise', 'Ejercicio', 'Exercise', 'Exercici'],
    ['learn.cat.piezas', '♟ Piezas', '♟ Pieces', '♟ Peces'],
    ['learn.cat.basico', '⚡ Básico', '⚡ Basics', '⚡ Bàsic'],
    ['learn.cat.intermedio', '🎓 Intermedio', '🎓 Intermediate', '🎓 Intermedi'],
    ['learn.cat.avanzado', '🏆 Avanzado', '🏆 Advanced', '🏆 Avançat'],
    ['learn.cat.jaque', '⚠️ Jaque', '⚠️ Check', '⚠️ Escac'],
    ['learn.cat.mate', '♔ Mate', '♔ Mate', '♔ Mat'],
    ['learn.cat.tacticas', '⚔️ Tácticas', '⚔️ Tactics', '⚔️ Tàctiques'],
    ['learn.cat.ejercicios', '⭐ Ejercicios de Estrellas', '⭐ Star exercises', '⭐ Exercicis d\'estrelles'],
    ['learn.banner.piezas', 'Ejercicio de Piezas', 'Piece exercise', 'Exercici de peces'],
    ['learn.banner.basico', 'Ejercicio Básico', 'Basic exercise', 'Exercici bàsic'],
    ['learn.banner.intermedio', 'Ejercicio Intermedio', 'Intermediate exercise', 'Exercici intermedi'],
    ['learn.banner.avanzado', 'Ejercicio Avanzado', 'Advanced exercise', 'Exercici avançat'],
    ['learn.exerciseN', 'Ejercicio {n}', 'Exercise {n}', 'Exercici {n}'],
    ['learn.star', 'estrella', 'star', 'estrella'],
    ['learn.stars', 'estrellas', 'stars', 'estrelles'],
    ['learn.wrongMove', 'Movimiento incorrecto. ¡Inténtalo de nuevo!', 'Wrong move. Try again!', 'Moviment incorrecte. Torna-ho a provar!'],
    ['learn.completedBanner', '¡Lección Completada! 🎉', 'Lesson complete! 🎉', 'Lliçó completada! 🎉'],
    ['opening.view', '👁 Ver Apertura', '👁 View opening', '👁 Veure l\'obertura'],
    ['lib.summary', '~{players} jugadores · ~{games} partidas', '~{players} players · ~{games} games', '~{players} jugadors · ~{games} partides'],
    ['lib.unavailable', 'Biblioteca no disponible', 'Library unavailable', 'Biblioteca no disponible'],
    ['lib.loadingGames', '⏳ Cargando partidas de {name}…', '⏳ Loading games by {name}…', '⏳ Carregant partides de {name}…'],
    ['quiz.intro', '<span class="notice-action-start"></span><p class="notice-kicker">Quiz</p><strong>{name}</strong><p class="notice-body">Juegas los dos bandos, un movimiento cada vez. Si fallas, se marcan las casillas y puedes repetirlo.</p><p class="notice-line"><span>Línea</span>{san}</p><p class="notice-count"><b>{n}</b><span>movimientos</span></p>', '<span class="notice-action-start"></span><p class="notice-kicker">Quiz</p><strong>{name}</strong><p class="notice-body">You play both sides, one move at a time. If you miss, the squares are marked and you can try again.</p><p class="notice-line"><span>Line</span>{san}</p><p class="notice-count"><b>{n}</b><span>moves</span></p>', '<span class="notice-action-start"></span><p class="notice-kicker">Quiz</p><strong>{name}</strong><p class="notice-body">Jugues els dos bàndols, un moviment cada vegada. Si falles, es marquen les caselles i pots repetir-lo.</p><p class="notice-line"><span>Línia</span>{san}</p><p class="notice-count"><b>{n}</b><span>moviments</span></p>'],
    ['quiz.done', '<p class="notice-kicker">Quiz</p><strong>Quiz completado</strong><p class="notice-body">{name}</p><div class="quiz-stats"><div><b>{ok}</b><span>Aciertos</span></div><div><b>{fail}</b><span>Fallos</span></div><div><b>{pct}%</b><span>Precisión</span></div><div><b>{elo}</b><span>ELO</span></div></div><p class="notice-line"><span>Línea</span>{san}</p>', '<p class="notice-kicker">Quiz</p><strong>Quiz complete</strong><p class="notice-body">{name}</p><div class="quiz-stats"><div><b>{ok}</b><span>Hits</span></div><div><b>{fail}</b><span>Misses</span></div><div><b>{pct}%</b><span>Accuracy</span></div><div><b>{elo}</b><span>ELO</span></div></div><p class="notice-line"><span>Line</span>{san}</p>', '<p class="notice-kicker">Quiz</p><strong>Quiz completat</strong><p class="notice-body">{name}</p><div class="quiz-stats"><div><b>{ok}</b><span>Encerts</span></div><div><b>{fail}</b><span>Errors</span></div><div><b>{pct}%</b><span>Precisió</span></div><div><b>{elo}</b><span>ELO</span></div></div><p class="notice-line"><span>Línia</span>{san}</p>'],
    ['insight.example', '💡 Ejemplo: ¡buena jugada! Controlas el centro del tablero.', '💡 Example: nice move! You control the centre of the board.', '💡 Exemple: bona jugada! Controls el centre del tauler.'],
    ['msg.invalidLinkMoves', 'El enlace de la partida no contiene movimientos válidos', 'The game link does not contain valid moves', 'L\'enllaç de la partida no conté moviments vàlids'],
    ['msg.illegalLinkMove', 'No se pudo reproducir toda la partida del enlace. Movimiento ilegal: {uci}', 'Could not replay the whole linked game. Illegal move: {uci}', 'No s\'ha pogut reproduir tota la partida de l\'enllaç. Moviment il·legal: {uci}'],
    ['msg.unknownMaster', 'Enlace: partida maestra desconocida. Clave: {key}', 'Link: unknown master game. Key: {key}', 'Enllaç: partida mestra desconeguda. Clau: {key}'],
    ['msg.unknownOpening', 'Enlace: apertura desconocida. Clave: {key}', 'Link: unknown opening. Key: {key}', 'Enllaç: obertura desconeguda. Clau: {key}'],
    ['msg.unknownPuzzle', 'Enlace: problema de ajedrez desconocido. Id: {id}', 'Link: unknown chess puzzle. Id: {id}', 'Enllaç: problema d\'escacs desconegut. Id: {id}'],
    ['msg.invalidPuzzleLink', 'Enlace de problema inválido o corrupto.', 'Invalid or corrupt puzzle link.', 'Enllaç de problema invàlid o corrupte.'],
    ['msg.noGameAnalyze', 'No hay partida para analizar', 'There is no game to analyse', 'No hi ha partida per analitzar'],
    ['msg.noMovesAnalyze', 'No hay movimientos para analizar', 'There are no moves to analyse', 'No hi ha moviments per analitzar'],
    ['msg.inviteStatus', 'La invitación fue {status}.', 'The invitation was {status}.', 'La invitació va ser {status}.'],
    ['status.rejected', 'rechazada', 'declined', 'rebutjada'],
    ['status.cancelled', 'cancelada', 'cancelled', 'cancel·lada'],
    ['msg.inviteSendFail', '⚠️ No se pudo enviar la invitación al invitador.', '⚠️ Could not send the invitation to the challenger.', '⚠️ No s\'ha pogut enviar la invitació a qui convida.'],
    ['msg.inviteAcceptFail', '⚠️ No se pudo aceptar la invitación.', '⚠️ Could not accept the invitation.', '⚠️ No s\'ha pogut acceptar la invitació.'],
    ['msg.moveSyncFail', '⚠️ No se pudo sincronizar el movimiento.', '⚠️ Could not sync the move.', '⚠️ No s\'ha pogut sincronitzar el moviment.'],
    ['msg.moveNetFail', '⚠️ Error de conexión al enviar movimiento.', '⚠️ Network error while sending the move.', '⚠️ Error de connexió en enviar el moviment.'],
    ['msg.drawReplyFail', 'Error al responder la oferta de tablas.', 'Error responding to the draw offer.', 'Error en respondre l\'oferta de taules.'],
    ['msg.chatFail', '⚠️ No se pudo enviar el mensaje: {err}', '⚠️ Could not send the message: {err}', '⚠️ No s\'ha pogut enviar el missatge: {err}'],
    ['msg.chatNet', '⚠️ Error de red al enviar el mensaje.', '⚠️ Network error while sending the message.', '⚠️ Error de xarxa en enviar el missatge.'],
    ['msg.tooSoonDraw', 'Es muy pronto para pedir tablas', 'It is too soon to offer a draw', 'És massa aviat per demanar taules'],
    ['msg.drawSim', 'Oferta de tablas enviada (simulación)', 'Draw offer sent (simulation)', 'Oferta de taules enviada (simulació)'],
    ['msg.drawSent', '🤝 Oferta de tablas enviada al oponente…', '🤝 Draw offer sent to opponent…', '🤝 Oferta de taules enviada a l\'oponent…'],
    ['msg.drawSendFail', 'No se pudo enviar la oferta de tablas.', 'Could not send the draw offer.', 'No s\'ha pogut enviar l\'oferta de taules.'],
    ['msg.drawNet', 'Error de conexión al ofrecer tablas.', 'Network error while offering a draw.', 'Error de connexió en oferir taules.'],
    ['msg.closeAnalysis', 'Cierra Modo Análisis para continuar', 'Close Analysis Mode to continue', 'Tanca el mode anàlisi per continuar'],
    ['msg.noVariants', 'No se encontraron variantes conocidas', 'No known variations found', 'No s\'han trobat variants conegudes'],
    ['msg.undoOnline', 'No puedes deshacer movimientos en partida online', 'You cannot undo moves in an online game', 'No pots desfer moviments en una partida en línia'],
    ['msg.noUndo', 'No hay movimientos para deshacer', 'There are no moves to undo', 'No hi ha moviments per desfer'],
    ['msg.gameEnded', 'El juego ha terminado', 'The game is over', 'El joc ha acabat'],
    ['msg.hintFail', 'Error al obtener sugerencia: {err}', 'Error getting hint: {err}', 'Error en obtenir el suggeriment: {err}'],
    ['msg.gameSaved', 'Partida guardada correctamente', 'Game saved successfully', 'Partida desada correctament'],
    ['msg.noSaved', 'No hay partidas guardadas', 'There are no saved games', 'No hi ha partides desades'],
    ['msg.noSavedLeft', 'No quedan partidas guardadas', 'No saved games left', 'No queden partides desades'],
    ['msg.noExport', 'No hay movimientos para exportar', 'There are no moves to export', 'No hi ha moviments per exportar'],
    ['msg.pgnAnalysisAdded', '📊 Se añade Análisis de Partida al PGN', '📊 Game analysis is added to the PGN', '📊 S\'afegeix l\'anàlisi de la partida al PGN'],
    ['msg.noCopy', 'No hay movimientos para copiar', 'There are no moves to copy', 'No hi ha moviments per copiar'],
    ['msg.videoDlCopy', '🎬 Vídeo descargado y texto copiado para la publicación', '🎬 Video downloaded and text copied for posting', '🎬 Vídeo descarregat i text copiat per a la publicació'],
    ['msg.videoFb', '🎬 Vídeo descargado — súbelo al abrir Facebook', '🎬 Video downloaded — upload it when Facebook opens', '🎬 Vídeo descarregat — puja\'l en obrir Facebook'],
    ['msg.videoIg', '🎬 Vídeo descargado — súbelo al abrir Instagram', '🎬 Video downloaded — upload it when Instagram opens', '🎬 Vídeo descarregat — puja\'l en obrir Instagram'],
    ['msg.imgIg', '📸 Imagen copiada — ábrela en Instagram y pégala en tu historia o post', '📸 Image copied — open Instagram and paste it in your story or post', '📸 Imatge copiada — obre-la a Instagram i enganxa-la a la teva història o publicació'],
    ['msg.tiktokOk', 'TikTok abierto · texto copiado y archivo descargado para tu nuevo post', 'TikTok opened · text copied and file downloaded for your new post', 'TikTok obert · text copiat i arxiu descarregat per a la teva nova publicació'],
    ['msg.tiktokNo', 'TikTok no está disponible en el menú de compartir de este dispositivo', 'TikTok is not available in this device’s share menu', 'TikTok no està disponible al menú de compartir d\'aquest dispositiu'],
    ['msg.noShareMoves', 'No hay movimientos para compartir', 'There are no moves to share', 'No hi ha moviments per compartir'],
    ['msg.noPgnMoves', 'No se encontraron movimientos en el PGN', 'No moves were found in the PGN', 'No s\'han trobat moviments al PGN'],
    ['msg.pgnImportFail', 'Error al importar el archivo PGN', 'Error importing the PGN file', 'Error en importar l\'arxiu PGN'],
    ['msg.onlineCantContinue', 'No puedes continuar otra partida durante una partida online', 'You cannot continue another game during an online game', 'No pots continuar una altra partida durant una partida en línia'],
    ['msg.noContinue', 'No hay partida en curso para continuar', 'There is no game in progress to continue', 'No hi ha cap partida en curs per continuar'],
    ['msg.continued', 'Partida continuada correctamente', 'Game continued successfully', 'Partida continuada correctament'],
    ['msg.continueFail', 'Error al continuar la partida', 'Error continuing the game', 'Error en continuar la partida'],
    ['msg.aiParse', 'Error al parsear el movimiento de la IA', 'Error parsing the AI move', 'Error en interpretar el moviment de la IA'],
    ['msg.aiInvalid', 'La IA no pudo generar un movimiento válido', 'The AI could not generate a valid move', 'La IA no ha pogut generar un moviment vàlid'],
    ['msg.aiFail', 'Error al obtener movimiento de la IA: {err}', 'Error getting the AI move: {err}', 'Error en obtenir el moviment de la IA: {err}'],
    ['banner.checkmate', '♚ ¡JAQUE MATE! — Ganan {winner}', '♚ CHECKMATE! — {winner} wins', '♚ ESCAC I MAT! — Guanyen {winner}'],
    ['banner.stalemate', '½ TABLAS — Ahogado', '½ DRAW — Stalemate', '½ TAULES — Ofegat'],
    ['banner.threefold', '½ TABLAS — Triple repetición', '½ DRAW — Threefold repetition', '½ TAULES — Triple repetició'],
    ['banner.check', '♔ ¡JAQUE!', '♔ CHECK!', '♔ ESCAC!'],
    ['banner.drawAgreed', '½ TABLAS — Acordadas', '½ DRAW — Agreed', '½ TAULES — Acordades'],
    ['banner.drawAccepted', '½ TABLAS — Aceptadas', '½ DRAW — Accepted', '½ TAULES — Acceptades'],
    ['banner.resigned', '🏳️ HAS ABANDONADO', '🏳️ YOU RESIGNED', '🏳️ HAS ABANDONAT'],
    ['banner.timeoutBlack', '⏱️ TIEMPO AGOTADO — Ganan Negras', '⏱️ TIME OUT — Black wins', '⏱️ TEMPS ESGOTAT — Guanyen les negres'],
    ['banner.timeoutWhite', '⏱️ TIEMPO AGOTADO — Ganan Blancas', '⏱️ TIME OUT — White wins', '⏱️ TEMPS ESGOTAT — Guanyen les blanques'],
    ['online.finished', 'Partida online finalizada', 'Online game finished', 'Partida en línia finalitzada'],
    ['online.whiteWins', '♔ Ganan blancas', '♔ White wins', '♔ Guanyen les blanques'],
    ['online.blackWins', '♚ Ganan negras', '♚ Black wins', '♚ Guanyen les negres'],
    ['online.draw', '½–½ Tablas', '½–½ Draw', '½–½ Taules'],
    ['online.playAs', 'Juegas con {color}', 'You play as {color}', 'Jugues amb {color}'],
    ['online.aborted', '⚠️ Partida abortada', '⚠️ Game aborted', '⚠️ Partida avortada'],
    ['online.oppResigned', '🏳️ {name} ha abandonado la partida. ¡Ganas tú!', '🏳️ {name} left the game. You win!', '🏳️ {name} ha abandonat la partida. Guanyes tu!', '🏳️ {name} hat die Partie verlassen. Du gewinnst!', '🏳️ {name} a quitté la partie. Tu gagnes !', '🏳️ {name} ha abbandonato la partita. Hai vinto!', '🏳️ {name} abandonou a partida. Ganhaste!', '🏳️ {name} 已离开对局。你赢了！', '🏳️ {name} покинул партию. Вы победили!', '🏳️ غادر {name} المباراة. لقد فزت!', '🏳️ {name} が対局を離れました。あなたの勝ちです！', '🏳️ {name} ने खेल छोड़ दिया। आप जीत गए!', '🏳️ {name} 님이 대국을 떠났습니다. 승리했습니다!'],
    ['online.oppLeft', '⚠️ {name} ha cerrado la partida', '⚠️ {name} closed the game', '⚠️ {name} ha tancat la partida', '⚠️ {name} hat die Partie geschlossen', '⚠️ {name} a fermé la partie', '⚠️ {name} ha chiuso la partita', '⚠️ {name} fechou a partida', '⚠️ {name} 关闭了对局', '⚠️ {name} закрыл партию', '⚠️ أغلق {name} المباراة', '⚠️ {name} が対局を閉じました', '⚠️ {name} ने खेल बंद कर दिया', '⚠️ {name} 님이 대국을 닫았습니다'],
    ['online.yourTurn', 'Tu turno', 'Your turn', 'El teu torn'],
    ['online.wait', 'Espera al rival…', 'Waiting for opponent…', 'Espera el rival…'],
    ['online.leaveTitle', 'Abandonar partida', 'Resign game', 'Abandonar la partida'],
    ['online.confirmLeave', '¿Abandonar la partida online?', 'Resign the online game?', 'Vols abandonar la partida en línia?'],
    ['invite.pickColorTime', 'Elige color y tiempo para tu invitación', 'Choose colour and time for your invitation', 'Tria color i temps per a la teva invitació'],
    ['invite.colorWhite', 'Blancas ♔', 'White ♔', 'Blanques ♔'],
    ['invite.colorBlack', 'Negras ♚', 'Black ♚', 'Negres ♚'],
    ['invite.colorRandom', 'Aleatorio 🎲', 'Random 🎲', 'Aleatori 🎲'],
    ['level.n', 'Nivel {n} (~{elo} ELO)', 'Level {n} (~{elo} ELO)', 'Nivell {n} (~{elo} ELO)'],
    ['aria.aiLevel', 'Nivel de dificultad de la IA', 'AI difficulty level', 'Nivell de dificultat de la IA'],
    ['aria.gameTime', 'Tiempo de la partida', 'Game time', 'Temps de la partida'],
    ['browser.copyLink', 'Enlace copiado. Pégalo en Chrome, Firefox o Safari para iniciar sesión.', 'Link copied. Paste it in Chrome, Firefox or Safari to sign in.', 'Enllaç copiat. Enganxa\'l a Chrome, Firefox o Safari per iniciar sessió.'],
    ['browser.promptLink', 'Copia este enlace y ábrelo en Chrome, Firefox o Safari:', 'Copy this link and open it in Chrome, Firefox or Safari:', 'Copia aquest enllaç i obre\'l a Chrome, Firefox o Safari:'],
    ['chat.notSent', 'No enviado: {err}', 'Not sent: {err}', 'No enviat: {err}'],
    ['chat.netError', 'Error de red', 'Network error', 'Error de xarxa'],
    ['link.type.invite', 'Invitación online', 'Online invitation', 'Invitació en línia'],
    ['link.type.game', 'Partida', 'Game', 'Partida'],
    ['link.type.puzzle', 'Problema', 'Puzzle', 'Problema'],
    ['link.type.opening', 'Apertura', 'Opening', 'Obertura'],
    ['link.type.master', 'Partida maestra', 'Master game', 'Partida mestra'],
    ['insight.castleShort', 'corto', 'kingside', 'curt'],
    ['insight.castleLong', 'largo', 'queenside', 'llarg'],
    ['piece.pawn', 'peón', 'pawn', 'peó'],
    ['piece.knight', 'caballo', 'knight', 'cavall'],
    ['piece.bishop', 'alfil', 'bishop', 'alfil'],
    ['piece.rook', 'torre', 'rook', 'torre'],
    ['piece.queen', 'dama', 'queen', 'dama'],
    ['piece.king', 'rey', 'king', 'rei'],
    ['tc.1+0', 'Bullet 1 min', 'Bullet 1 min', 'Bullet 1 min'],
    ['tc.1+1', 'Bullet 1+1', 'Bullet 1+1', 'Bullet 1+1'],
    ['tc.2+1', 'Bullet 2+1', 'Bullet 2+1', 'Bullet 2+1'],
    ['tc.3+0', 'Blitz 3 min', 'Blitz 3 min', 'Blitz 3 min'],
    ['tc.3+2', 'Blitz 3+2', 'Blitz 3+2', 'Blitz 3+2'],
    ['tc.5+0', 'Blitz 5 min', 'Blitz 5 min', 'Blitz 5 min'],
    ['tc.5+3', 'Blitz 5+3', 'Blitz 5+3', 'Blitz 5+3'],
    ['tc.10+0', 'Rápida 10 min', 'Rapid 10 min', 'Ràpida 10 min'],
    ['tc.10+5', 'Rápida 10+5', 'Rapid 10+5', 'Ràpida 10+5'],
    ['tc.15+10', 'Rápida 15+10', 'Rapid 15+10', 'Ràpida 15+10'],
    ['tc.30+0', 'Rápida 30 min', 'Rapid 30 min', 'Ràpida 30 min'],
    ['tc.60+0', 'Clásica 60 min', 'Classical 60 min', 'Clàssica 60 min'],
    ['tc.90+30', 'Clásica 90+30', 'Classical 90+30', 'Clàssica 90+30'],
    ['online.started', '🌐 <strong>Partida online iniciada</strong><br>Oponente: {nick}', '🌐 <strong>Online game started</strong><br>Opponent: {nick}', '🌐 <strong>Partida en línia iniciada</strong><br>Oponent: {nick}'],
    ['vsBot', '🤖 <strong>Partida contra {nick}</strong><br>ELO {elo}', '🤖 <strong>Game vs {nick}</strong><br>ELO {elo}', '🤖 <strong>Partida contra {nick}</strong><br>ELO {elo}'],
    ['pgn.whiteWins', '1-0 · Ganan blancas', '1-0 · White wins', '1-0 · Guanyen les blanques'],
    ['pgn.blackWins', '0-1 · Ganan negras', '0-1 · Black wins', '0-1 · Guanyen les negres'],
    ['pgn.draw', '½-½ · Tablas', '½-½ · Draw', '½-½ · Taules'],
    ['pgn.inProgress', 'En curso', 'In progress', 'En curs'],
    ['pgn.whiteWinsParen', '1-0 (Ganan blancas)', '1-0 (White wins)', '1-0 (Guanyen les blanques)'],
    ['pgn.blackWinsParen', '0-1 (Ganan negras)', '0-1 (Black wins)', '0-1 (Guanyen les negres)'],
    ['pgn.drawParen', '½-½ (Tablas)', '½-½ (Draw)', '½-½ (Taules)'],
    ['pgn.date', 'Fecha: {date}', 'Date: {date}', 'Data: {date}'],
    ['pgn.result', 'Resultado: {result}', 'Result: {result}', 'Resultat: {result}'],
    ['pgn.tournament', 'Torneo: {event}', 'Event: {event}', 'Torneig: {event}'],
    ['pgn.round', 'Ronda: {round}', 'Round: {round}', 'Ronda: {round}'],
    ['playerDefault', 'Jugador', 'Player', 'Jugador'],
    ['insight.castle', '🏰 ¡Enroque {side}! Rey a salvo y torre activa', '🏰 {side} castling! King safe and rook active', '🏰 Enroc {side}! Rei a salv i torre activa'],
    ['insight.checkCapture', '⚡ ¡Captura con jaque! Ganas tempo y material', '⚡ Capture with check! You gain tempo and material', '⚡ Captura amb escac! Guanyes tempo i material'],
    ['insight.checkKnight', '⚡ ¡Jaque de caballo! Difícil de bloquear', '⚡ Knight check! Hard to block', '⚡ Escac de cavall! Difícil de bloquejar'],
    ['insight.checkPawn', '⚡ ¡Jaque de peón! Amenaza inesperada', '⚡ Pawn check! An unexpected threat', '⚡ Escac de peó! Amenaça inesperada'],
    ['insight.checkReact', '⚡ ¡Jaque! Obligas al rival a reaccionar', '⚡ Check! You force the opponent to react', '⚡ Escac! Obliges el rival a reaccionar'],
    ['insight.checkPressure', '⚡ ¡Jaque! Presión directa sobre el rey', '⚡ Check! Direct pressure on the king', '⚡ Escac! Pressió directa sobre el rei'],
    ['insight.takeQueen', '💎 ¡Capturas la dama! Ventaja decisiva', '💎 You take the queen! Decisive advantage', '💎 Captures la dama! Avantatge decisiva'],
    ['insight.winPiece', '💎 ¡Ganas {piece}! Ventaja de material clara', '💎 You win the {piece}! Clear material advantage', '💎 Guanyes {piece}! Avantatge de material clara'],
    ['insight.goodTrade', '💎 Capturas {piece} — ¡buen cambio!', '💎 You capture the {piece} — good trade!', '💎 Captures {piece} — bon canvi!'],
    ['insight.recaptureTrade', '🔄 ¡Recuperas pieza! Cambio de {got} por {gave}', '🔄 You recapture! {got} for {gave}', '🔄 Recuperes peça! Canvi de {got} per {gave}'],
    ['insight.trade', '🔄 Cambio de {got} por {gave}', '🔄 Trade of {got} for {gave}', '🔄 Canvi de {got} per {gave}'],
    ['insight.recapture', '🔄 ¡Recuperas pieza! Capturas {piece}', '🔄 You recapture! You take the {piece}', '🔄 Recuperes peça! Captures {piece}'],
    ['insight.cleanPawn', '💎 ¡Captura limpia! Ganas un peón', '💎 Clean capture! You win a pawn', '💎 Captura neta! Guanyes un peó'],
    ['insight.cleanPiece', '💎 ¡Captura limpia! Te llevas el {piece}', '💎 Clean capture! You take the {piece}', '💎 Captura neta! T\'emportes el {piece}'],
    ['insight.cleanWin', '💎 Captura limpia — ganas {piece}', '💎 Clean capture — you win the {piece}', '💎 Captura neta — guanyes {piece}'],
    ['insight.capture', '⚔️ Capturas {piece}', '⚔️ You capture the {piece}', '⚔️ Captures {piece}'],
    ['insight.forkKing', '🐴 ¡Horquilla al rey! El rival perderá material', '🐴 Fork on the king! The opponent will lose material', '🐴 Forquilla al rei! El rival perdrà material'],
    ['insight.forkTwo', '🐴 ¡Horquilla! Atacas {a} y {b}', '🐴 Fork! You attack the {a} and the {b}', '🐴 Forquilla! Atacs {a} i {b}'],
    ['insight.pawnFork', '♟ ¡Horquilla de peón! Atacas {a} y {b}', '♟ Pawn fork! You attack the {a} and the {b}', '♟ Forquilla de peó! Atacs {a} i {b}'],
    ['insight.pin', '📌 ¡Clavada! El {piece} enemigo no puede moverse', '📌 Pin! The enemy {piece} cannot move', '📌 Clavada! El {piece} enemic no es pot moure'],
    ['insight.skewer', '📌 ¡Enfilada! Amenazas {a} y {b} detrás', '📌 Skewer! You threaten the {a} and the {b} behind', '📌 Enfilada! Amenaces {a} i {b} al darrere'],
    ['insight.battery', '🔋 ¡Batería! {a} y {b} apuntan juntas', '🔋 Battery! {a} and {b} aim together', '🔋 Bateria! {a} i {b} apunten juntes'],
    ['insight.devCenter', '📐 Desarrollas {piece} hacia el centro — ¡buena actividad!', '📐 You develop the {piece} toward the centre — good activity!', '📐 Desenvolupes {piece} cap al centre — bona activitat!'],
    ['insight.devPiece', '📐 Desarrollas {piece} — una pieza más lista para jugar', '📐 You develop the {piece} — one more piece ready to play', '📐 Desenvolupes {piece} — una peça més a punt per jugar'],
    ['insight.fianchetto', '🏹 ¡Fianchetto! Tu alfil domina la gran diagonal', '🏹 Fianchetto! Your bishop dominates the long diagonal', '🏹 Fianchetto! El teu alfil domina la gran diagonal'],
    ['insight.earlyQueen', '⚠️ Dama temprana — puede ser atacada y perder tiempos', '⚠️ Early queen — it can be attacked and lose tempi', '⚠️ Dama primerenca — pot ser atacada i perdre temps'],
    ['insight.samePiece', '⚠️ Mueves la misma pieza dos veces — desarrolla las demás', '⚠️ You move the same piece twice — develop the others', '⚠️ Mous la mateixa peça dues vegades — desenvolupa les altres'],
    ['insight.undeveloped', '⚠️ Aún tienes {n} piezas en casa — ¡necesitan salir!', '⚠️ You still have {n} pieces at home — they need to come out!', '⚠️ Encara tens {n} peces a casa — han de sortir!'],
    ['insight.devComplete', '✅ ¡Desarrollo completo! Piezas activas y rey enrocado', '✅ Development complete! Active pieces and a castled king', '✅ Desenvolupament complet! Peces actives i rei enrocat'],
    ['insight.promo', '👑 ¡Coronación! Tu peón se transforma en pieza mayor', '👑 Promotion! Your pawn becomes a major piece', '👑 Coronació! El teu peó es transforma en peça major'],
    ['insight.almostPromo', '♟ ¡Peón a punto de coronar! Amenaza imparable', '♟ Pawn about to promote! An unstoppable threat', '♟ Peó a punt de coronar! Amenaça imparable'],
    ['insight.doubleCenter', '🎯 Peón doble al centro — ¡controlas casillas clave!', '🎯 Two pawns in the centre — you control key squares!', '🎯 Peó doble al centre — controls caselles clau!'],
    ['insight.centerPawn', '🎯 Peón al centro — espacio y control', '🎯 Pawn to the centre — space and control', '🎯 Peó al centre — espai i control'],
    ['insight.passedAdv', '♟ ¡Peón pasado avanzado! Muy peligroso', '♟ Advanced passed pawn! Very dangerous', '♟ Peó passat avançat! Molt perillós'],
    ['insight.passed', '♟ Peón pasado — sin peones rivales que lo frenen', '♟ Passed pawn — no enemy pawns to stop it', '♟ Peó passat — sense peons rivals que el frenin'],
    ['insight.isolated', '⚠️ Peón aislado — no tiene peones aliados que lo protejan', '⚠️ Isolated pawn — no friendly pawns to protect it', '⚠️ Peó aïllat — no té peons aliats que el protegeixin'],
    ['insight.doubled', '⚠️ Peones doblados en la misma columna — estructura débil', '⚠️ Doubled pawns on the same file — weak structure', '⚠️ Peons doblats a la mateixa columna — estructura feble'],
    ['insight.doubledRooks', '🗼 ¡Torres dobladas! Poder duplicado en la columna', '🗼 Doubled rooks! Doubled power on the file', '🗼 Torres doblades! Poder duplicat a la columna'],
    ['insight.connectedRooks', '🗼 Torres conectadas — se apoyan mutuamente', '🗼 Connected rooks — they support each other', '🗼 Torres connectades — s\'apuntalen mutuament'],
    ['insight.rook7', '🗼 ¡Torre en séptima fila! Ataca peones y encierra al rey', '🗼 Rook on the seventh! Attacks pawns and traps the king', '🗼 Torre a setena fila! Ataca peons i tanca el rei'],
    ['insight.rookOpen', '🗼 Torre en columna abierta — ¡máxima influencia!', '🗼 Rook on an open file — maximum influence!', '🗼 Torre en columna oberta — màxima influència!'],
    ['insight.rookSemi', '🗼 Torre en columna semi-abierta — presión sobre el peón rival', '🗼 Rook on a semi-open file — pressure on the enemy pawn', '🗼 Torre en columna semioberta — pressió sobre el peó rival'],
    ['insight.rookPassed', '🗼 Torre apoyando peón pasado — ¡combinación ganadora!', '🗼 Rook supporting a passed pawn — a winning combo!', '🗼 Torre donant suport al peó passat — combinació guanyadora!'],
    ['insight.knightCenter', '🐴 Caballo centralizado — controla hasta 8 casillas', '🐴 Centralised knight — controls up to 8 squares', '🐴 Cavall centralitzat — controla fins a 8 caselles'],
    ['insight.outpost', '🐴 ¡Puesto avanzado! Caballo protegido e inamovible', '🐴 Outpost! A protected, immovable knight', '🐴 Avançada! Cavall protegit i inamovible'],
    ['insight.kingEnd', '👑 Rey activo en el final — ¡pieza decisiva!', '👑 Active king in the endgame — a decisive piece!', '👑 Rei actiu al final — peça decisiva!'],
    ['insight.kingActivate', '👑 Activas el rey — en el final es una pieza fuerte', '👑 You activate the king — in the endgame it is a strong piece', '👑 Actives el rei — al final és una peça forta'],
    ['insight.kingExposed', '⚠️ Rey expuesto en el medio juego — puede ser peligroso', '⚠️ Exposed king in the middlegame — it can be dangerous', '⚠️ Rei exposat al migjoc — pot ser perillós'],
    ['insight.hangingFree', '🚨 ¡Tu {piece} puede ser capturada gratis!', '🚨 Your {piece} can be taken for free!', '🚨 El teu {piece} pot ser capturat de franc!'],
    ['insight.hangingDanger', '🚨 ¡{piece} en peligro! Está sin protección', '🚨 {piece} in danger! It is unprotected', '🚨 {piece} en perill! Està sense protecció'],
    ['insight.attacked', '⚠️ Tu {piece} queda en casilla atacada', '⚠️ Your {piece} sits on an attacked square', '⚠️ El teu {piece} queda en una casella atacada'],
    ['insight.lesserThreat', '⚠️ Tu {piece} puede caer ante pieza de menor valor', '⚠️ Your {piece} may fall to a piece of lower value', '⚠️ El teu {piece} pot caure davant d\'una peça de menor valor'],
    ['insight.leftHanging', '⚠️ Cuidado: tu {piece} ha quedado sin defensa', '⚠️ Careful: your {piece} has been left undefended', '⚠️ Compte: el teu {piece} ha quedat sense defensa'],
    ['insight.castlePawns', '⚠️ Avanzar peones del enroque debilita la defensa del rey', '⚠️ Pushing the castled pawns weakens the king’s defence', '⚠️ Avançar peons de l\'enroc afebleix la defensa del rei'],
    ['insight.knightRim', '⚠️ Caballo en el borde — pierde movilidad y fuerza', '⚠️ Knight on the rim — it loses mobility and strength', '⚠️ Cavall a la vora — perd mobilitat i força'],
    ['insight.badBishop', '⚠️ Alfil atrapado entre tus peones — busca abrirle diagonales', '⚠️ Bishop trapped behind your pawns — open diagonals for it', '⚠️ Alfil atrapat entre els teus peons — busca obrir-li diagonals'],
    ['insight.kingCenter', '⚠️ Tu rey sigue en el centro sin enrocar — ¡búscale refugio!', '⚠️ Your king is still in the centre uncastled — find it shelter!', '⚠️ El teu rei continua al centre sense enrocar — busca-li refugi!'],
    ['insight.matPlus', '💪 Ventaja material clara — simplifica y gana', '💪 Clear material advantage — simplify and win', '💪 Avantatge material clara — simplifica i guanya'],
    ['insight.matMinus', '🔍 Desventaja material — busca complicaciones tácticas', '🔍 Material disadvantage — look for tactical complications', '🔍 Desavantatge material — busca complicacions tàctiques'],
    ['insight.centerCtrl', '🎯 Controlas el centro del tablero', '🎯 You control the centre of the board', '🎯 Controls el centre del tauler'],
    ['insight.centerInfl', '♟ Refuerzas tu influencia en el centro', '♟ You strengthen your influence in the centre', '♟ Reforces la teva influència al centre'],
    ['insight.endPawn', '♟ Avanza peones en el final — cada paso cuenta', '♟ Push pawns in the endgame — every step counts', '♟ Avança peons al final — cada pas compta'],
    ['invite.cancel', 'Cancelar invitación', 'Cancel invitation', 'Cancel·la la invitació'],
    ['invite.reject', '✖ Rechazar', '✖ Decline', '✖ Rebutja'],
    ['invite.offersDraw', '{name} ofrece tablas', '{name} offers a draw', '{name} ofereix taules'],
    ['puzzle.playWhite', 'Juegan BLANCAS. Encuentra el mejor movimiento.', 'WHITE to move. Find the best move.', 'Juguen BLANQUES. Troba el millor moviment.'],
    ['puzzle.playBlack', 'Juegan NEGRAS. Encuentra el mejor movimiento.', 'BLACK to move. Find the best move.', 'Juguen NEGRES. Troba el millor moviment.'],
    ['puzzle.bannerWhite', '♔ Juegan Blancas', '♔ White to move', '♔ Juguen blanques'],
    ['puzzle.bannerBlack', '♚ Juegan Negras', '♚ Black to move', '♚ Juguen negres'],
    ['puzzle.counter', ' ({n} de {total})', ' ({n} of {total})', ' ({n} de {total})'],
    ['learn.goToStar', 'Muévete a la casilla con la estrella ★.', 'Move to the square with the star ★.', 'Mou-te a la casella amb l\'estrella ★.'],
    ['analysis.connectFail', 'No se pudo conectar con el servidor de análisis. Comprueba tu conexión e inténtalo de nuevo.', 'Could not connect to the analysis server. Check your connection and try again.', 'No s\'ha pogut connectar amb el servidor d\'anàlisi. Comprova la connexió i torna-ho a provar.'],
    ['users.loadFail', 'Error al cargar los jugadores. Inténtalo de nuevo.', 'Could not load players. Please try again.', 'Error en carregar els jugadors. Torna-ho a provar.'],
    ['msg.inviteSendError', 'No se pudo enviar la invitación.', 'Could not send the invitation.', 'No s\'ha pogut enviar la invitació.'],
    ['msg.inviteSendGeneric', 'Error al enviar', 'Send error', 'Error en enviar'],
    ['opponent', 'Oponente', 'Opponent', 'Oponent'],
    ['yourOpponent', 'Tu rival', 'Your opponent', 'El teu rival'],
    ['chat.empty', 'Saluda a tu rival. Los mensajes desaparecen 48 h después.', 'Say hello to your opponent. Messages disappear after 48 hours.', 'Saluda el teu rival. Els missatges desapareixen 48 h després.'],
    ['login.badPassword', 'Contraseña incorrecta.', 'Incorrect password.', 'Contrasenya incorrecta.'],
    ['login.fail', 'Error al iniciar sesión.', 'Sign-in failed.', 'Error en iniciar sessió.'],
    ['login.noServer', 'No se pudo conectar al servidor.', 'Could not connect to the server.', 'No s\'ha pogut connectar al servidor.'],
    ['login.googleLoadFail', 'No se pudo cargar Google Sign-In. Comprueba tu conexión a internet o usa otro navegador.', 'Could not load Google Sign-In. Check your internet connection or try another browser.', 'No s\'ha pogut carregar Google Sign-In. Comprova la connexió a internet o fes servir un altre navegador.'],
    ['login.googleProfileFail', 'No se pudo obtener el perfil de Google.', 'Could not get the Google profile.', 'No s\'ha pogut obtenir el perfil de Google.'],
    ['login.profileFail', 'Error al obtener el perfil.', 'Could not get the profile.', 'Error en obtenir el perfil.'],
    ['login.googleOpenFail', 'No se pudo abrir el inicio de sesión de Google. Abre AjedrezIA en Chrome, Firefox o Safari.', 'Could not open Google sign-in. Open AjedrezIA in Chrome, Firefox or Safari.', 'No s\'ha pogut obrir l\'inici de sessió de Google. Obre AjedrezIA a Chrome, Firefox o Safari.'],
    ['login.googleFlowFail', 'No se pudo iniciar el flujo de Google. Abre AjedrezIA en Chrome, Firefox o Safari.', 'Could not start Google sign-in. Open AjedrezIA in Chrome, Firefox or Safari.', 'No s\'ha pogut iniciar el flux de Google. Obre AjedrezIA a Chrome, Firefox o Safari.'],
    ['login.appleLoadFail', 'No se pudo cargar Apple Sign In. Comprueba tu conexión a internet.', 'Could not load Apple Sign In. Check your internet connection.', 'No s\'ha pogut carregar Apple Sign In. Comprova la connexió a internet.'],
    ['login.appleFail', 'Error al iniciar sesión con Apple.', 'Could not sign in with Apple.', 'Error en iniciar sessió amb Apple.'],
    ['login.nickGuest', 'Nickname asignado al acceso como invitado', 'Nickname assigned for guest access', 'Sobrenom assignat a l\'accés com a convidat'],
    ['login.nickLinked', 'Nickname vinculado a tu cuenta online', 'Nickname linked to your online account', 'Sobrenom vinculat al teu compte en línia'],
    ['login.needNick', 'Escribe un nickname para continuar.', 'Enter a nickname to continue.', 'Escriu un sobrenom per continuar.'],
    ['login.badNick', 'Nickname no válido. Usa 3–20 caracteres: letras, números, "_", "-" o ".".', 'Invalid nickname. Use 3–20 characters: letters, numbers, "_", "-" or ".".', 'Sobrenom no vàlid. Fes servir 3–20 caràcters: lletres, números, "_", "-" o ".".'],
    ['login.googleNoReply', 'No hemos recibido respuesta de Google. Si usas un navegador antiguo o dentro de una app, abre esta web en Chrome, Firefox o Safari.', 'We did not get a reply from Google. If you use an old browser or an in-app browser, open this site in Chrome, Firefox or Safari.', 'No hem rebut resposta de Google. Si fas servir un navegador antic o dins d\'una app, obre aquesta web a Chrome, Firefox o Safari.'],
    ['login.googleError', 'Error de Google: {err}', 'Google error: {err}', 'Error de Google: {err}'],
    ['confirm.resignInGame', 'Partida en curso ({n} ELO si abandonas)', 'Game in progress ({n} ELO if you resign)', 'Partida en curs ({n} ELO si abandones)'],
    ['confirm.offerDraw', '¿Quieres ofrecer tablas?', 'Do you want to offer a draw?', 'Vols oferir taules?'],
    ['confirm.continueHere', '¿Quieres continuar la partida desde aquí?', 'Continue the game from this position?', 'Vols continuar la partida des d\'aquí?'],
    ['msg.drawRejectedAdvantage', 'El rival rechaza las tablas (tiene ventaja)', 'The opponent declines the draw (has the advantage)', 'El rival rebutja les taules (té avantatge)'],
    ['msg.drawRejectedPlain', 'El rival rechaza las tablas', 'The opponent declines the draw', 'El rival rebutja les taules'],
    ['famous.loadFail', '❌ Error al cargar partidas', '❌ Could not load games', '❌ Error en carregar partides'],
    ['msg.gameLoaded', 'Partida cargada: {n} movimientos', 'Game loaded: {n} moves', 'Partida carregada: {n} moviments'],
    ['msg.pgnCopied', 'PGN copiado al portapapeles', 'PGN copied to the clipboard', 'PGN copiat al porta-retalls'],
    ['msg.pgnCopiedAnalysis', 'PGN copiado al portapapeles<br>📊 Se añade Análisis de Partida al PGN', 'PGN copied to the clipboard<br>📊 Game analysis is added to the PGN', 'PGN copiat al porta-retalls<br>📊 S\'afegeix l\'anàlisi de la partida al PGN'],
    ['msg.noMoves', 'No hay movimientos', 'No moves', 'No hi ha moviments'],
    ['share.copyImageTitle', 'Pulsa para copiar la imagen', 'Tap to copy the image', 'Prem per copiar la imatge'],
    ['share.layoutAria', 'Disposición de la imagen', 'Image layout', 'Disposició de la imatge'],
    ['share.layoutTop', 'Imagen vertical 9:16', 'Vertical 9:16 image', 'Imatge vertical 9:16'],
    ['share.layoutLeft', 'Imagen horizontal 16:9', 'Horizontal 16:9 image', 'Imatge horitzontal 16:9'],
    ['share.formatAria', 'Formato para compartir', 'Share format', 'Format per compartir'],
    ['share.formatImage', '🖼 Imagen', '🖼 Image', '🖼 Imatge'],
    ['share.formatVideo', '▶ Vídeo', '▶ Video', '▶ Vídeo'],
    ['share.preparingVideo', 'Preparando vídeo…', 'Preparing video…', 'Preparant el vídeo…'],
    ['share.downloadVideoTitle', 'Pulsa para descargar el vídeo', 'Tap to download the video', 'Prem per descarregar el vídeo'],
    ['share.copyHint', 'Pulsa texto / imagen para Copiar', 'Tap text / image to copy', 'Prem text / imatge per copiar'],
    ['share.videoFail', 'No se pudo generar el vídeo', 'Could not generate the video', 'No s\'ha pogut generar el vídeo'],
    ['share.videoMp4', 'Vídeo MP4', 'MP4 video', 'Vídeo MP4'],
    ['share.videoWebm', 'Vídeo WebM', 'WebM video', 'Vídeo WebM'],
    ['share.imageCopied', '✓ Imagen copiada', '✓ Image copied', '✓ Imatge copiada'],
    ['share.imageCopyFail', 'No se pudo copiar la imagen', 'Could not copy the image', 'No s\'ha pogut copiar la imatge'],
    ['share.findBest', '¿Encuentras la mejor jugada?', 'Can you find the best move?', 'Trobes la millor jugada?'],
    ['share.replay', 'Revívela jugada a jugada', 'Replay it move by move', 'Reviu-la jugada a jugada'],
    ['share.learnStep', 'Aprende esta apertura paso a paso', 'Learn this opening step by step', 'Aprèn aquesta obertura pas a pas'],
    ['share.learnTrap', 'Aprende esta trampa paso a paso', 'Learn this trap step by step', 'Aprèn aquesta trampa pas a pas'],
    ['share.learnOpenings', 'Aprende aperturas en AjedrezIA', 'Learn openings on AjedrezIA', 'Aprèn obertures a AjedrezIA'],
    ['share.myGame', 'Mi partida', 'My game', 'La meva partida'],
    ['share.playLearn', 'Juega y aprende ajedrez', 'Play and learn chess', 'Juga i aprèn escacs'],
    ['share.kind.chess', 'Ajedrez', 'Chess', 'Escacs'],
    ['share.videoBrowser', 'Este navegador no permite generar vídeo', 'This browser cannot generate video', 'Aquest navegador no permet generar vídeo'],
    ['share.videoMove', 'Jugada', 'Move', 'Jugada'],
    ['share.videoSolution', 'Solución', 'Solution', 'Solució'],
    ['share.videoStart', 'Posición inicial', 'Starting position', 'Posició inicial'],
    ['share.videoMoveN', '{label} {n} de {total}', '{label} {n} of {total}', '{label} {n} de {total}'],
    ['share.generatingVideo', 'Generando vídeo… {n} de {total}', 'Generating video… {n} of {total}', 'Generant vídeo… {n} de {total}'],
    ['share.videoCancelled', 'Generación cancelada', 'Generation cancelled', 'Generació cancel·lada'],
    ['opening.variantsOf', '📖 Variantes de: {name}', '📖 Variations of: {name}', '📖 Variants de: {name}'],
    ['opening.noMoreVariants', 'No hay más variantes en la base de datos', 'No more variations in the database', 'No hi ha més variants a la base de dades'],
    ['exportPgn', 'Exportar PGN', 'Export PGN', 'Exporta el PGN'],
    ['pgn.opening', 'Apertura: {eco}', 'Opening: {eco}', 'Obertura: {eco}'],
    ['pgn.site', 'Lugar: {site}', 'Site: {site}', 'Lloc: {site}'],
    ['pgn.movesCount', 'Movimientos: {n}', 'Moves: {n}', 'Moviments: {n}'],
    ['pgn.movesOf', 'Movimientos: {n} de {total}', 'Moves: {n} of {total}', 'Moviments: {n} de {total}'],
    ['pgn.errorAt', '⚠ Error en {move}', '⚠ Error at {move}', '⚠ Error a {move}'],
    ['pgn.analysisIncluded', '📊 Análisis Existente incluido en el PGN', '📊 Existing analysis included in the PGN', '📊 Anàlisi existent inclosa al PGN'],
    ['pgnFileDesc', 'Archivo PGN', 'PGN file', 'Arxiu PGN'],
    ['invite.sentTo', 'Invitación enviada a {nick} ({time})', 'Invitation sent to {nick} ({time})', 'Invitació enviada a {nick} ({time})'],
    ['invite.willInvite', 'Vas a invitar a {nick} (ELO {elo})', 'You are inviting {nick} (ELO {elo})', 'Convidaràs {nick} (ELO {elo})'],
    ['changelog.more', '... y más mejoras en AjedrezIA ...', '... and more improvements in AjedrezIA ...', '... i més millores a AjedrezIA ...'],
    ['changelog.3.6.95', 'Quienes comparten el comienzo del nombre pasan a Invitado-XXXXXX, sin repetir invitados reales que están desconectados', 'Players who share the start of a name become Invitado-XXXXXX, without reusing real guests who are offline', 'Qui comparteix el començament del nom passa a Invitado-XXXXXX, sense repetir convidats reals que estan desconnectats', 'Wer denselben Namensanfang hat, heißt Invitado-XXXXXX, ohne echte Gäste zu wiederholen, die offline sind', 'Ceux qui partagent le début du nom deviennent Invitado-XXXXXX, sans reprendre un invité réel déconnecté', 'Chi condivide l’inizio del nome diventa Invitado-XXXXXX, senza riusare invitati reali scollegati', 'Quem partilha o início do nome passa a Invitado-XXXXXX, sem repetir convidados reais que estão desligados', '名字开头相同的人改为 Invitado-XXXXXX，并且不会占用当前离线的真实访客名', 'У кого совпадает начало имени, тот становится Invitado-XXXXXX, без имён реальных гостей не в сети', 'من يتشارك بداية الاسم يصبح Invitado-XXXXXX دون استخدام أسماء الضيوف الحقيقيين غير المتصلين', '名前の書き出しが同じ人は Invitado-XXXXXX になり、今オフラインの本物のゲスト名は使いません', 'जिनका नाम एक ही शुरुआत से है वे Invitado-XXXXXX हो जाते हैं, और ऑफ़लाइन असली अतिथियों के नाम नहीं लिए जाते', '이름이 같은 시작을 가진 사람은 Invitado-XXXXXX가 되며, 지금 오프라인인 실제 게스트 이름은 쓰지 않습니다'],
    ['changelog.3.6.94', 'Los Bot_XXX aparecen justo después de los jugadores libres', 'Bot_XXX appears right after the free players', 'Els Bot_XXX apareixen just després dels jugadors lliures', 'Bot_XXX steht direkt nach den freien Spielern', 'Les Bot_XXX apparaissent juste après les joueurs libres', 'I Bot_XXX compaiono subito dopo i giocatori liberi', 'Os Bot_XXX aparecem logo a seguir aos jogadores livres', 'Bot_XXX 紧接在空闲玩家之后', 'Bot_XXX идут сразу после свободных игроков', 'يظهر Bot_XXX مباشرة بعد اللاعبين المتاحين', 'Bot_XXX は空きの人のすぐ後に出ます', 'Bot_XXX खाली खिलाड़ियों के ठीक बाद दिखते हैं', 'Bot_XXX는 대기 중인 사람 바로 다음에 나옵니다'],
    ['changelog.3.6.94.clock', 'El reloj de la partida online cuenta seguido, sin saltos', 'The online game clock counts steadily, without jumps', 'El rellotge de la partida en línia compta seguit, sense salts', 'Die Uhr der Online-Partie zählt gleichmäßig, ohne Sprünge', 'L’horloge de la partie en ligne compte régulièrement, sans sauts', 'L’orologio della partita online scorre continuo, senza salti', 'O relógio da partida online conta seguido, sem saltos', '在线对局的棋钟连续计时，不再乱跳', 'Часы онлайн-партии идут ровно, без скачков', 'ساعة المباراة عبر الإنترنت تعد بانتظام ومن دون قفزات', 'オンライン対局の時計は途切れず、飛ばずに進みます', 'ऑनलाइन खेल की घड़ी बिना उछाल के लगातार चलती है', '온라인 대국 시계가 튀지 않고 계속 갑니다'],
    ['changelog.3.6.93', 'En Conectados y en Jugadores registrados también se ven los jugadores ocupados', 'Online now and Registered players also show the players who are busy', 'A Connectats i a Jugadors registrats també es veuen els jugadors ocupats', 'Unter Verbunden und Registrierte Spieler sind auch die beschäftigten Spieler zu sehen', 'Connectés et Joueurs inscrits affichent aussi les joueurs occupés', 'In Connessi e in Giocatori registrati si vedono anche i giocatori occupati', 'Em Ligados e em Jogadores registados também aparecem os jogadores ocupados', '在线列表和注册玩家里也会显示正在对局的玩家', 'В списке подключённых и среди зарегистрированных видны и занятые игроки', 'في المتصلين واللاعبين المسجلين يظهر أيضاً اللاعبون المشغولون', '接続中と登録プレイヤーにも、対局中の人が表示されます', 'जुड़े लोगों और पंजीकृत खिलाड़ियों में व्यस्त खिलाड़ी भी दिखते हैं', '접속자와 등록 플레이어에도 대국 중인 사람이 보입니다'],
    ['changelog.3.6.92', 'Al cerrar la página, el jugador sale de Conectados al momento', 'Closing the page removes the player from Online now right away', 'En tancar la pàgina, el jugador surt de Connectats a l’instant', 'Wer die Seite schließt, verschwindet sofort aus Verbunden', 'Fermer la page retire le joueur de Connectés tout de suite', 'Chiudendo la pagina il giocatore esce subito da Connessi', 'Ao fechar a página, o jogador sai de Ligados na hora', '关闭页面后，该玩家会马上从在线列表消失', 'При закрытии страницы игрок сразу пропадает из списка подключённых', 'عند إغلاق الصفحة يختفي اللاعب فورًا من المتصلين', 'ページを閉じると、その人はすぐに接続中から消えます', 'पेज बंद करते ही खिलाड़ी जुड़े लोगों से तुरंत हट जाता है', '페이지를 닫으면 그 플레이어가 접속 목록에서 바로 사라집니다'],
    ['changelog.3.6.91', 'El aviso verde de quien se conecta solo dice su nombre y «conectado», y no se puede pulsar', 'The green notice when someone connects only shows their name and “connected”, and it cannot be clicked', 'L’avís verd de qui es connecta només diu el seu nom i «connectat», i no es pot prémer', 'Der grüne Hinweis zeigt nur den Namen und „verbunden“ und lässt sich nicht anklicken', 'L’avis vert n’affiche que le nom et « connecté », et on ne peut pas cliquer dessus', 'L’avviso verde mostra solo il nome e «connesso», e non si può cliccare', 'O aviso verde mostra só o nome e «ligado», e não se pode clicar', '上线的绿色提示只显示名字和“已上线”，并且不能点击', 'Зелёное уведомление показывает только имя и «в сети», и его нельзя нажать', 'التنبيه الأخضر يعرض الاسم و«متصل» فقط، ولا يمكن الضغط عليه', '接続の緑の表示は名前と「接続中」だけで、クリックできません', 'हरा संदेश केवल नाम और «जुड़ा है» दिखाता है, और उसे दबाया नहीं जा सकता', '접속 알림은 이름과 «접속 중»만 보여 주며 누를 수 없습니다'],
    ['changelog.3.6.90', 'En el móvil, Conectados aparece debajo de Nueva partida', 'On mobile, Online now appears under New Game', 'Al mòbil, Connectats apareix sota Nova partida', 'Auf dem Handy steht Verbunden unter Neues Spiel', 'Sur mobile, Connectés s’affiche sous Nouvelle partie', 'Sul cellulare, Connessi compare sotto Nuova partita', 'No telemóvel, Ligados aparece debaixo de Nova partida', '在手机上，在线列表显示在新对局下方', 'На телефоне список подключённых идёт под новой партией', 'على الهاتف تظهر قائمة المتصلين تحت مباراة جديدة', 'スマホでは接続中の一覧が新しい対局の下に出ます', 'फ़ोन पर जुड़े लोगों की सूची नई चाल के नीचे दिखती है', '휴대폰에서는 접속자 목록이 새 대국 아래에 나옵니다'],
    ['changelog.3.6.89', 'Al terminar la partida online, los dos jugadores vuelven a estar libres', 'When an online game ends, both players are free again', 'En acabar la partida en línia, els dos jugadors tornen a estar lliures', 'Nach einer Online-Partie sind beide Spieler wieder frei', 'À la fin d’une partie en ligne, les deux joueurs redeviennent libres', 'A fine partita online, entrambi i giocatori tornano liberi', 'Ao terminar a partida online, os dois jogadores voltam a ficar livres', '在线对局结束后，双方重新变为空闲', 'После онлайн-партии оба игрока снова свободны', 'عند انتهاء المباراة عبر الإنترنت يعود اللاعبان إلى متاح', 'オンライン対局が終わると、両者は再び空きになります', 'ऑनलाइन खेल खत्म होने पर दोनों खिलाड़ी फिर खाली हो जाते हैं', '온라인 대국이 끝나면 두 사람 모두 다시 대기가 됩니다'],
    ['changelog.3.6.88', 'Al retar a un conectado, Nueva partida muestra su ficha en lugar de los botones de oponente', 'When challenging someone online, New Game shows their card instead of the opponent buttons', 'En reptar un connectat, Nova partida mostra la seva fitxa en lloc dels botons d’oponent', 'Beim Herausfordern eines Verbundenen zeigt Neues Spiel dessen Karte statt der Gegner-Schaltflächen', 'En défiant un connecté, Nouvelle partie affiche sa fiche à la place des boutons d’adversaire', 'Sfidando un connesso, Nuova partita mostra la sua scheda al posto dei pulsanti avversario', 'Ao desafiar um ligado, Nova partida mostra a ficha em vez dos botões de adversário', '挑战在线玩家时，新对局显示其资料卡，而不是对手按钮', 'При вызове подключённого игрока новая партия показывает его карточку вместо кнопок соперника', 'عند تحدي متصل، تعرض المباراة الجديدة بطاقته بدل أزرار الخصم', '接続中の人に対戦を申し込むと、新しい対局は相手ボタンの代わりにその人のカードを表示します', 'किसी जुड़े खिलाड़ी को चुनौती देने पर नई चाल विरोधी बटन की जगह उसकी फाइल दिखाती है', '접속자에게 대국을 신청하면 새 대국은 상대 버튼 대신 그 사람의 카드를 보여 줍니다'],
    ['changelog.3.6.87', 'Quitado el botón Copiar PGN de debajo del tablero', 'Removed the Copy PGN button from under the board', 'Eliminat el botó Copia el PGN de sota el tauler', 'Die Schaltfläche PGN kopieren unter dem Brett wurde entfernt', 'Le bouton Copier le PGN sous l’échiquier a été retiré', 'Rimosso il pulsante Copia PGN sotto la scacchiera', 'Removido o botão Copiar PGN debaixo do tabuleiro', '棋盘下方的复制 PGN 按钮已去掉', 'Кнопка «Копировать PGN» под доской убрана', 'أُزيل زر نسخ PGN من أسفل الرقعة', '盤面の下の PGN をコピーするボタンを外しました', 'बोर्ड के नीचे वाला PGN कॉपी बटन हटाया गया', '보드 아래의 PGN 복사 버튼을 없앴습니다'],
    ['changelog.3.6.86', 'Al abandonar o cerrar una partida online, el rival recibe el aviso', 'When you resign or close an online game, your opponent is notified', 'En abandonar o tancar una partida en línia, el rival rep l’avís', 'Wer eine Online-Partie aufgibt oder schließt, benachrichtigt den Gegner', 'Quand tu abandonnes ou fermes une partie en ligne, ton adversaire est prévenu', 'Se abbandoni o chiudi una partita online, l’avversario riceve l’avviso', 'Ao abandonar ou fechar uma partida online, o adversário recebe o aviso', '放弃或关闭在线对局时，对手会收到通知', 'Если вы сдаётесь или закрываете онлайн-партию, соперник получает уведомление', 'عند الانسحاب من مباراة عبر الإنترنت أو إغلاقها يصل التنبيه إلى المنافس', 'オンライン対局を投了または閉じると、相手に通知が届きます', 'ऑनलाइन खेल छोड़ने या बंद करने पर प्रतिद्वंद्वी को सूचना मिलती है', '온라인 대국을 기권하거나 닫으면 상대에게 알림이 갑니다'],
    ['changelog.3.6.85', 'En Jugadores registrados, los conectados se ven como bajo Nueva partida y aparecen antes de Bot_400', 'In Registered players, online users look like under New Game and appear before Bot_400', 'A Jugadors registrats, els connectats es veuen com sota Nova partida i surten abans de Bot_400', 'Bei Registrierte Spieler sehen Verbundene aus wie unter Neues Spiel und stehen vor Bot_400', 'Dans Joueurs inscrits, les connectés s’affichent comme sous Nouvelle partie et passent avant Bot_400', 'In Giocatori registrati, i connessi si vedono come sotto Nuova partita e compaiono prima di Bot_400', 'Em Jogadores registados, os ligados aparecem como sob Nova partida e ficam antes de Bot_400', '在注册玩家中，在线玩家的显示与新对局下方相同，并排在 Bot_400 之前', 'В списке зарегистрированных подключённые выглядят как под новой партией и идут перед Bot_400', 'في اللاعبين المسجلين يظهر المتصلون كما تحت مباراة جديدة وقبل Bot_400', '登録プレイヤーでは、接続中の人が新しい対局の下と同じ表示で、Bot_400 より前に出ます', 'पंजीकृत खिलाड़ियों में जुड़े लोग नई चाल के नीचे जैसे दिखते हैं और Bot_400 से पहले आते हैं', '등록 플레이어에서 접속자는 새 대국 아래와 같게 보이며 Bot_400보다 앞에 나옵니다'],
    ['changelog.3.6.84', 'El aviso Te reto usa los minutos elegidos en Nueva partida', 'The challenge notice uses the minutes chosen in New Game', 'L’avís Et reto fa servir els minuts triats a Nova partida', 'Der Hinweis zur Herausforderung nutzt die Minuten aus Neues Spiel', 'L’avis de défi utilise les minutes choisies dans Nouvelle partie', 'L’avviso di sfida usa i minuti scelti in Nuova partita', 'O aviso de desafio usa os minutos escolhidos em Nova partida', '挑战提示使用新对局里选择的分钟数', 'Приглашение использует минуты, выбранные в новой партии', 'تنبيه التحدي يستخدم الدقائق المختارة في مباراة جديدة', '対戦の案内は新しい対局で選んだ分数を使います', 'चुनौती संदेश नई चाल में चुने मिनट दिखाता है', '대국 신청 안내는 새 대국에서 고른 시간을 사용합니다'],
    ['changelog.3.6.83', 'El jugador invitado ve el aviso para aceptar la partida', 'The invited player sees the prompt to accept the game', 'El jugador convidat veu l’avís per acceptar la partida', 'Der eingeladene Spieler sieht den Hinweis, die Partie anzunehmen', 'Le joueur invité voit l’avis pour accepter la partie', 'Il giocatore invitato vede l’avviso per accettare la partita', 'O jogador convidado vê o aviso para aceitar a partida', '被邀请的棋手会看到接受对局的提示', 'Приглашённый игрок видит предложение принять партию', 'يرى اللاعب المدعو التنبيه لقبول المباراة', '招待された相手に対局を受ける案内が出ます', 'आमंत्रित खिलाड़ी को चाल स्वीकार करने का संदेश दिखता है', '초대받은 플레이어에게 대국 수락 안내가 나타납니다'],
    ['changelog.3.6.82', 'Al pulsar un conectado, Nueva partida abre con Juegas contra On-line', 'Tapping someone in Online now opens New Game with Online selected', 'En prémer un connectat, Nova partida s’obre amb Jugues contra En línia', 'Tippt man einen Spieler unter Online an, öffnet sich Neues Spiel mit Online', 'En appuyant sur un joueur en ligne, Nouvelle partie s’ouvre avec Contre en ligne', 'Toccando un connesso, Nuova partita si apre con Giochi contro Online', 'Ao premir um ligado, Nova partida abre com Joga contra Online', '点击在线玩家时，新对局打开并选中在线', 'При нажатии на игрока «В сети» новая партия открывается с режимом онлайн', 'عند الضغط على متصل تُفتح مباراة جديدة مع «أونلاين»', '接続中の名前を押すと新しい対局がオンライン選択で開きます', 'कनेक्टेड नाम दबाने पर नई चाल ऑनलाइन चयन के साथ खुलती है', '접속자 이름을 누르면 새 대국이 온라인 선택으로 열립니다'],
    ['changelog.3.6.81', 'Al pulsar un conectado se abre Nueva partida con IA y Comenzar envía la invitación', 'Tapping someone in Online now opens New Game with AI selected, and Start sends the invitation', 'En prémer un connectat s’obre Nova partida amb IA i Començar envia la invitació', 'Ein Tippen auf einen Spieler unter Online öffnet Neues Spiel mit KI, und Start sendet die Einladung', 'Appuyer sur un joueur en ligne ouvre Nouvelle partie avec IA, et Commencer envoie l’invitation', 'Toccare un connesso apre Nuova partita con IA e Inizia invia l’invito', 'Premir um ligado abre Nova partida com IA e Começar envia o convite', '点击在线玩家会打开新对局并选中人工智能，开始会发出邀请', 'Нажатие на игрока «В сети» открывает «Новая партия» с ИИ, а «Начать» отправляет приглашение', 'الضغط على متصل يفتح مباراة جديدة مع الذكاء الاصطناعي والبدء يرسل الدعوة', '接続中の名前を押すと対IAの新しい対局が開き、開始で招待を送ります', 'कनेक्टेड नाम दबाने पर नई चाल IA के साथ खुलती है और शुरू निमंत्रण भेजता है', '접속자 이름을 누르면 AI가 선택된 새 대국이 열리고 시작이 초대를 보냅니다'],
    ['changelog.3.6.80', 'En Conectados, el nombre y el ELO van en la misma línea, sin icono', 'In Online now, the name and ELO sit on the same line, without an icon', 'A Connectats, el nom i l’ELO van a la mateixa línia, sense icona', 'Unter Online stehen Name und ELO in einer Zeile, ohne Symbol', 'Dans En ligne, le nom et l’ELO sont sur la même ligne, sans icône', 'In Online, nome ed ELO stanno sulla stessa riga, senza icona', 'Em Ligados, o nome e o ELO ficam na mesma linha, sem ícone', '在线列表里，名字和等级分在同一行，不显示图标', 'В списке «В сети» имя и ELO в одной строке, без значка', 'في المتصلين، الاسم والتقييم في السطر نفسه، دون أيقونة', '接続中では名前とELOを同じ行に表示し、アイコンは出しません', 'कनेक्टेड में नाम और ELO एक ही पंक्ति में हैं, आइकन के बिना', '접속 목록에서 이름과 ELO를 같은 줄에 보여주고 아이콘은 뺍니다'],
    ['changelog.3.6.79', 'Al cerrar sesión se continúa como Invitado-XXXXXX', 'Signing out continues as Guest-XXXXXX', 'En tancar la sessió es continua com a Invitado-XXXXXX', 'Nach dem Abmelden geht es als Invitado-XXXXXX weiter', 'Après la déconnexion, on continue comme Invitado-XXXXXX', 'Dopo la disconnessione si continua come Invitado-XXXXXX', 'Ao terminar a sessão continua-se como Invitado-XXXXXX', '退出登录后以 Invitado-XXXXXX 继续', 'После выхода сеанс продолжается как Invitado-XXXXXX', 'بعد تسجيل الخروج يُتابع الدخول كـ Invitado-XXXXXX', 'ログアウト後は Invitado-XXXXXX として続きます', 'सत्र बंद करने पर Invitado-XXXXXX के रूप में जारी रहता है', '로그아웃하면 Invitado-XXXXXX로 계속합니다'],
    ['changelog.3.6.78', 'Al abrir la web, tu Invitado-XXXXXX se anuncia y los demás lo ven en Conectados', 'When the site opens, your Guest-XXXXXX checks in so others see you in Online now', 'En obrir el web, el teu Convidat-XXXXXX s’anuncia i la resta el veu a Connectats', 'Beim Öffnen meldet sich dein Gast-XXXXXX an und die anderen sehen dich unter Online', 'À l’ouverture, ton Invité-XXXXXX se signale et les autres le voient dans En ligne', 'All’apertura il tuo Ospite-XXXXXX si annuncia e gli altri lo vedono in Online', 'Ao abrir o site, o teu Convidado-XXXXXX anuncia-se e os outros veem-no em Ligados', '打开网站时，你的访客会报到，其他人会在在线列表里看到你', 'При открытии сайта твой Гость-XXXXXX отмечается, и остальные видят его в списке «В сети»', 'عند فتح الموقع يسجّل ضيفك حضوره ويراه الآخرون في المتصلين', 'サイトを開くとゲストが在席を知らせ、ほかの人の接続中に表示されます', 'साइट खुलते ही तुम्हारा अतिथि हाज़िर होता है और बाकी लोग उसे कनेक्टेड में देखते हैं', '사이트를 열면 게스트가 접속을 알리고 다른 사람의 접속 목록에 나타납니다'],
    ['changelog.3.6.77', 'Los invitados que tienen la web abierta aparecen en Conectados', 'Guests who have the site open appear in Online now', 'Els convidats que tenen el web obert apareixen a Connectats', 'Gäste, die die Website geöffnet haben, erscheinen unter Online', 'Les invités qui ont le site ouvert apparaissent dans En ligne', 'Gli ospiti che hanno il sito aperto compaiono in Online', 'Os convidados que têm o site aberto aparecem em Ligados', '打开着网站的访客会显示在在线列表中', 'Гости с открытым сайтом видны в списке «В сети»', 'الضيوف الذين فتحوا الموقع يظهرون في المتصلين', 'サイトを開いているゲストは接続中に表示されます', 'साइट खोले हुए अतिथि कनेक्टेड में दिखते हैं', '사이트를 열어 둔 게스트가 접속 목록에 나타납니다'],
    ['changelog.3.6.76', 'Al entrar se accede como Invitado-XXXXXX y, si esa cuenta ya existía, se usa la misma', 'Opening the site signs you in as Guest-XXXXXX and reuses that account if it already exists', 'En entrar s’accedeix com a Invitado-XXXXXX i, si aquest compte ja existia, es fa servir el mateix', 'Beim Öffnen meldet man sich als Invitado-XXXXXX an, und dasselbe Konto wird wiederverwendet', 'À l’ouverture on entre comme Invitado-XXXXXX et, si ce compte existait déjà, on réutilise le même', 'All’apertura si entra come Invitado-XXXXXX e, se quell’account esisteva già, si riusa lo stesso', 'Ao entrar acede-se como Invitado-XXXXXX e, se essa conta já existia, usa-se a mesma', '打开网站时以 Invitado-XXXXXX 进入；若该账号已存在，则继续使用同一账号', 'При входе выполняется вход как Invitado-XXXXXX, а если такой аккаунт уже был, используется он же', 'عند الدخول يتم الوصول كـ Invitado-XXXXXX، وإذا كان الحساب موجوداً يُستخدم نفسه', '開くと Invitado-XXXXXX として入り、そのアカウントが既にあれば同じものを使います', 'खोलते ही Invitado-XXXXXX के रूप में प्रवेश होता है, और वही खाता पहले से हो तो वही चलता है', '열면 Invitado-XXXXXX로 들어가고, 그 계정이 이미 있으면 같은 계정을 씁니다'],
    ['changelog.3.6.76.guestBtn', 'En Iniciar sesión ya no aparece Acceder como invitado', 'Sign-in no longer shows Continue as Guest', 'A Iniciar sessió ja no apareix Accedir com a convidat', 'Bei Anmelden erscheint nicht mehr Als Gast fortfahren', 'Dans Connexion, Continuer en invité n’apparaît plus', 'In Accedi non compare più Continua come ospite', 'Em Iniciar sessão já não aparece Entrar como convidado', '登录窗口不再显示以访客身份继续', 'Во входе больше нет кнопки «Продолжить как гость»', 'في تسجيل الدخول لم يعد يظهر الدخول كضيف', 'ログインに「ゲストで続ける」は出ません', 'साइन-इन में अतिथि के रूप में जारी रखें नहीं दिखता', '로그인에 게스트로 계속하기가 더 이상 나오지 않습니다'],
    ['changelog.3.6.76.guestClick', 'Pulsar Invitado-XXXXXX en Configuración abre Iniciar sesión', 'Clicking Guest-XXXXXX in Settings opens Sign-in', 'Prémer Invitado-XXXXXX a Configuració obre Iniciar sessió', 'Ein Klick auf Invitado-XXXXXX in den Einstellungen öffnet Anmelden', 'Cliquer sur Invitado-XXXXXX dans Paramètres ouvre Connexion', 'Fare clic su Invitado-XXXXXX in Impostazioni apre Accedi', 'Premir Invitado-XXXXXX nas Definições abre Iniciar sessão', '在设置中点击 Invitado-XXXXXX 会打开登录', 'Нажатие Invitado-XXXXXX в настройках открывает вход', 'النقر على Invitado-XXXXXX في الإعدادات يفتح تسجيل الدخول', '設定の Invitado-XXXXXX を押すとログインが開きます', 'सेटिंग्स में Invitado-XXXXXX दबाने पर साइन-इन खुलता है', '설정의 Invitado-XXXXXX를 누르면 로그인이 열립니다'],
    ['changelog.3.6.75', 'La lista de conectados también muestra a los demás jugadores que están en línea', 'The online list also shows the other players who are online', 'La llista de connectats també mostra els altres jugadors que estan en línia', 'Die Liste der Verbundenen zeigt auch die anderen Spieler, die online sind', 'La liste des connectés montre aussi les autres joueurs qui sont en ligne', 'L’elenco dei connessi mostra anche gli altri giocatori che sono online', 'A lista de ligados também mostra os outros jogadores que estão online', '在线列表也会显示其他正在在线的玩家', 'Список подключённых показывает и других игроков, которые в сети', 'قائمة المتصلين تعرض أيضاً اللاعبين الآخرين الموجودين على الإنترنت', '接続中リストには、オンラインの他のプレイヤーも表示されます', 'कनेक्टेड सूची में ऑनलाइन बाकी खिलाड़ी भी दिखते हैं', '접속 목록에 온라인인 다른 플레이어도 표시됩니다'],
    ['changelog.3.6.73', 'Si la web ya está instalada como app, no aparece la viñeta para instalarla', 'If the site is already installed as an app, the install callout does not appear', 'Si el web ja està instal·lat com a app, no apareix la vinyeta per instal·lar-lo', 'Wenn die Website schon als App installiert ist, erscheint die Installationsblase nicht', 'Si le site est déjà installé comme appli, la bulle d’installation n’apparaît pas', 'Se il sito è già installato come app, la nuvoletta per installarlo non compare', 'Se o site já estiver instalado como app, o balão para instalar não aparece', '如果网站已安装为应用，则不再显示安装提示气泡', 'Если сайт уже установлен как приложение, подсказка установки не показывается', 'إذا كان الموقع مثبتاً كتطبيق، لا تظهر فقاعة التثبيت', 'サイトがすでにアプリとしてインストール済みなら、インストールの吹き出しは出ません', 'साइट ऐप के रूप में इंस्टॉल हो चुकी हो तो इंस्टॉल का बुलबुला नहीं दिखता', '사이트가 이미 앱으로 설치되어 있으면 설치 말풍선이 나오지 않습니다'],
    ['changelog.3.6.73.list', 'La lista de jugadores conectados se actualiza sola', 'The list of connected players updates on its own', 'La llista de jugadors connectats s’actualitza sola', 'Die Liste der verbundenen Spieler aktualisiert sich von selbst', 'La liste des joueurs connectés se met à jour toute seule', 'L’elenco dei giocatori connessi si aggiorna da solo', 'A lista de jogadores ligados atualiza-se sozinha', '在线玩家列表会自动更新', 'Список подключённых игроков обновляется сам', 'قائمة اللاعبين المتصلين تتحدث من تلقاء نفسها', '接続中のプレイヤー一覧は自動で更新されます', 'जुड़े खिलाड़ियों की सूची अपने आप अपडेट होती है', '접속한 플레이어 목록이 저절로 갱신됩니다'],
    ['changelog.3.6.72', 'Quien ha iniciado sesión aparece ocupado solo si está jugando una partida en línea', 'A signed-in player shows as busy only while playing an online game', 'Qui ha iniciat la sessió apareix ocupat només si juga una partida en línia', 'Wer angemeldet ist, gilt nur als beschäftigt, wenn eine Online-Partie läuft', 'Une personne connectée n’apparaît occupée que si elle joue une partie en ligne', 'Chi ha effettuato l’accesso risulta occupato solo se sta giocando una partita online', 'Quem iniciou sessão aparece ocupado só se estiver a jogar uma partida online', '已登录的玩家仅在进行在线对局时显示为忙碌', 'Вошедший игрок показан занятым только во время онлайн-партии', 'يظهر اللاعب الذي سجّل الدخول مشغولاً فقط إذا كان يلعب مباراة عبر الإنترنت', 'ログイン中のプレイヤーは、オンライン対局中だけ対局中と表示されます', 'साइन-इन खिलाड़ी केवल ऑनलाइन पार्टी खेलते समय व्यस्त दिखता है', '로그인한 플레이어는 온라인 대국 중일 때만 대국 중으로 표시됩니다'],
    ['changelog.3.6.72.list', 'Debajo de Nueva partida se ve quién está conectado, libre u ocupado', 'Under New Game you see who is online, free or busy', 'Sota Nova partida es veu qui està connectat, lliure o ocupat', 'Unter Neue Partie steht, wer online, frei oder beschäftigt ist', 'Sous Nouvelle partie on voit qui est en ligne, libre ou occupé', 'Sotto Nuova partita si vede chi è online, libero o occupato', 'Por baixo de Nova partida vê-se quem está ligado, livre ou ocupado', '在新对局下方可以看到谁在线、空闲或忙碌', 'Под «Новая партия» видно, кто в сети, свободен или занят', 'تحت مباراة جديدة يظهر من هو متصل، متاح أو مشغول', '新規対局の下に、オンラインで空きか対局中かが表示されます', 'नई पार्टी के नीचे दिखता है कौन ऑनलाइन है, खाली या व्यस्त', '새 대국 아래에 누가 온라인인지, 대기인지 대국 중인지 보입니다'],
    ['changelog.3.6.71', 'El aviso a info@ajedrezia.com incluye la medida de la pantalla', 'The notice to info@ajedrezia.com includes the screen size', 'L’avís a info@ajedrezia.com inclou la mida de la pantalla', 'Die Meldung an info@ajedrezia.com enthält die Bildschirmgröße', 'L’avis à info@ajedrezia.com inclut la taille de l’écran', 'L’avviso a info@ajedrezia.com include la misura dello schermo', 'O aviso para info@ajedrezia.com inclui o tamanho do ecrã', '发给 info@ajedrezia.com 的通知包含屏幕尺寸', 'Уведомление на info@ajedrezia.com включает размер экрана', 'يتضمن التنبيه إلى info@ajedrezia.com مقاس الشاشة', 'info@ajedrezia.com への通知に画面サイズを含めます', 'info@ajedrezia.com की सूचना में स्क्रीन का आकार शामिल है', 'info@ajedrezia.com 알림에 화면 크기가 포함됩니다'],
    ['changelog.3.6.71.install', 'En la primera visita, si la web no está instalada como app, se muestra una viñeta para instalarla', 'On the first visit, if the site is not installed as an app, a callout invites you to install it', 'En la primera visita, si el web no està instal·lat com a app, es mostra una vinyeta per instal·lar-lo', 'Beim ersten Besuch erscheint eine Sprechblase zum Installieren, wenn die Website nicht als App installiert ist', 'À la première visite, si le site n’est pas installé comme appli, une bulle propose de l’installer', 'Alla prima visita, se il sito non è installato come app, compare una nuvoletta per installarlo', 'Na primeira visita, se o site não estiver instalado como app, aparece um balão para o instalar', '首次访问时，若网站尚未安装为应用，会显示安装提示气泡', 'При первом визите, если сайт не установлен как приложение, показывается подсказка установить его', 'في أول زيارة، إذا لم يكن الموقع مثبتاً كتطبيق، تظهر فقاعة لتثبيته', '初回訪問時、サイトがアプリ未インストールならインストールの吹き出しを表示します', 'पहली बार आने पर, अगर साइट ऐप के रूप में इंस्टॉल नहीं है, तो इंस्टॉल करने का बुलबुला दिखता है', '첫 방문 때 사이트가 앱으로 설치되어 있지 않으면 설치 말풍선이 나타납니다'],
    ['changelog.3.6.70', 'En Informar de errores/mejoras los botones Enviar y Cancelar van uno al lado del otro', 'In Report bugs / suggestions the Send and Cancel buttons sit side by side', 'A Informa d’errors/millores els botons Envia i Cancel·la van un al costat de l’altre', 'Bei Fehler/Verbesserungen melden stehen Senden und Abbrechen nebeneinander', 'Dans Signaler des erreurs/améliorations les boutons Envoyer et Annuler sont côte à côte', 'In Segnala errori/migliorie i pulsanti Invia e Annulla sono affiancati', 'Em Informar erros/melhorias os botões Enviar e Cancelar ficam lado a lado', '在报告错误/改进中，发送和取消按钮并排显示', 'В «Сообщить об ошибках и улучшениях» кнопки «Отправить» и «Отмена» стоят рядом', 'في الإبلاغ عن الأخطاء/التحسينات زرا الإرسال والإلغاء جنباً إلى جنب', '不具合・改善の報告で「送信」と「キャンセル」が横並びになります', 'त्रुटि/सुधार बताने में भेजो और रद्द बटन अगल-बगल हैं', '오류/개선 알리기에서 보내기와 취소 버튼이 나란히 있습니다'],
    ['changelog.3.6.69', 'En Informar de errores/mejoras el botón dice Enviar', 'In Report bugs / suggestions the button says Send', 'A Informa d’errors/millores el botó diu Envia', 'Bei Fehler/Verbesserungen melden heißt die Schaltfläche Senden', 'Dans Signaler des erreurs/améliorations le bouton indique Envoyer', 'In Segnala errori/migliorie il pulsante dice Invia', 'Em Informar erros/melhorias o botão diz Enviar', '在报告错误/改进中，按钮为“发送”', 'В «Сообщить об ошибках и улучшениях» кнопка называется «Отправить»', 'في الإبلاغ عن الأخطاء/التحسينات الزر يقول إرسال', '不具合・改善の報告ではボタンが「送信」になります', 'त्रुटि/सुधार बताने में बटन «भेजो» कहता है', '오류/개선 알리기에서 버튼이 «보내기»입니다'],
    ['changelog.3.6.68', 'El aviso a info@ajedrezia.com se envía cada vez que se abre la web', 'The notice to info@ajedrezia.com is sent every time the site is opened', 'L’avís a info@ajedrezia.com s’envia cada vegada que s’obre el web', 'Die Meldung an info@ajedrezia.com wird bei jedem Öffnen der Website gesendet', 'L’avis à info@ajedrezia.com est envoyé à chaque ouverture du site', 'L’avviso a info@ajedrezia.com viene inviato a ogni apertura del sito', 'O aviso para info@ajedrezia.com é enviado sempre que o site é aberto', '每次打开网站都会向 info@ajedrezia.com 发送通知', 'Уведомление на info@ajedrezia.com отправляется при каждом открытии сайта', 'يُرسل التنبيه إلى info@ajedrezia.com في كل مرة يُفتح فيها الموقع', 'サイトを開くたびに info@ajedrezia.com へ通知を送ります', 'साइट खुलने पर हर बार info@ajedrezia.com को सूचना जाती है', '사이트를 열 때마다 info@ajedrezia.com으로 알림을 보냅니다'],
    ['changelog.3.6.68.login', 'Si un jugador inicia sesión, Chrome en Windows muestra su nombre y al pulsarlo se le invita a una partida', 'When a player signs in, Chrome on Windows shows their name and clicking it invites them to a game', 'Si un jugador inicia la sessió, Chrome a Windows mostra el seu nom i en prémer-lo se’l convida a una partida', 'Wenn ein Spieler sich anmeldet, zeigt Chrome unter Windows den Namen und ein Klick lädt zur Partie ein', 'Quand un joueur se connecte, Chrome sous Windows affiche son nom et un clic l’invite à une partie', 'Se un giocatore accede, Chrome su Windows mostra il nome e un clic lo invita a una partita', 'Se um jogador inicia sessão, o Chrome no Windows mostra o nome e um clique convida-o para uma partida', '有玩家登录时，Windows 上的 Chrome 会显示其名字，点击即可邀请对局', 'Когда игрок входит, Chrome в Windows показывает имя, и нажатие приглашает на партию', 'عند تسجيل دخول لاعب يعرض Chrome في ويندوز اسمه، والنقر عليه يدعوه إلى مباراة', 'プレイヤーがログインすると、Windows の Chrome に名前が表示され、クリックで対局に招待します', 'कोई खिलाड़ी साइन इन करे तो Windows के Chrome में उसका नाम दिखता है और क्लिक से पार्टी का निमंत्रण जाता है', '플레이어가 로그인하면 Windows Chrome에 이름이 표시되고, 누르면 대국에 초대합니다'],
    ['changelog.3.6.67', 'Al abrir la web, el aviso a info@ajedrezia.com obtiene el sistema operativo en el servidor', 'Opening the site, the notice to info@ajedrezia.com gets the operating system on the server', 'En obrir el web, l’avís a info@ajedrezia.com obté el sistema operatiu al servidor', 'Beim Öffnen der Website ermittelt die Meldung an info@ajedrezia.com das Betriebssystem auf dem Server', 'À l’ouverture du site, l’avis à info@ajedrezia.com obtient le système d’exploitation sur le serveur', 'All’apertura del sito, l’avviso a info@ajedrezia.com rileva il sistema operativo sul server', 'Ao abrir o site, o aviso para info@ajedrezia.com obtém o sistema operativo no servidor', '打开网站时，发给 info@ajedrezia.com 的通知由服务器识别操作系统', 'При открытии сайта уведомление на info@ajedrezia.com определяет операционную систему на сервере', 'عند فتح الموقع يحدد التنبيه إلى info@ajedrezia.com نظام التشغيل على الخادم', 'サイトを開いたときの info@ajedrezia.com への通知はサーバー側で OS を判定します', 'साइट खोलने पर info@ajedrezia.com की सूचना सर्वर पर ऑपरेटिंग सिस्टम पहचानती है', '사이트를 열 때 info@ajedrezia.com 알림이 서버에서 운영 체제를 확인합니다'],
    ['changelog.3.6.66', 'Al abrir la web, el aviso a info@ajedrezia.com incluye el sistema operativo', 'Opening the site includes the operating system in the notice to info@ajedrezia.com', 'En obrir el web, l’avís a info@ajedrezia.com inclou el sistema operatiu', 'Beim Öffnen der Website enthält die Meldung an info@ajedrezia.com das Betriebssystem', 'À l’ouverture du site, l’avis à info@ajedrezia.com inclut le système d’exploitation', 'All’apertura del sito, l’avviso a info@ajedrezia.com include il sistema operativo', 'Ao abrir o site, o aviso para info@ajedrezia.com inclui o sistema operativo', '打开网站时，发给 info@ajedrezia.com 的通知包含操作系统', 'При открытии сайта уведомление на info@ajedrezia.com включает операционную систему', 'عند فتح الموقع يتضمن التنبيه إلى info@ajedrezia.com نظام التشغيل', 'サイトを開いたときの info@ajedrezia.com への通知に OS を含めます', 'साइट खोलने पर info@ajedrezia.com की सूचना में ऑपरेटिंग सिस्टम शामिल है', '사이트를 열 때 info@ajedrezia.com 알림에 운영 체제가 포함됩니다'],
    ['changelog.3.6.63', 'Los títulos de los paneles tienen un fondo índigo suave', 'Panel titles have a soft indigo background', 'Els títols dels panells tenen un fons indi suau', 'Panel-Titel haben einen sanften Indigo-Hintergrund', 'Les titres des panneaux ont un fond indigo doux', 'I titoli dei pannelli hanno uno sfondo indaco tenue', 'Os títulos dos painéis têm um fundo índigo suave', '面板标题改为柔和的靛蓝色背景', 'У заголовков панелей мягкий индиговый фон', 'عناوين اللوحات بخلفية نيلي فاتحة', 'パネル見出しに淡い藍色の背景を追加', 'पैनल शीर्षकों पर हल्की नील पृष्ठभूमि', '패널 제목에 연한 남색 배경'],
    ['changelog.3.6.62', 'El inicio de sesión ya no muestra el texto de términos y privacidad', 'Sign-in no longer shows the terms and privacy text', 'L’inici de sessió ja no mostra el text de termes i privadesa', 'Die Anmeldung zeigt den Text zu Nutzungsbedingungen und Datenschutz nicht mehr', 'La connexion n’affiche plus le texte des conditions et de la confidentialité', 'L’accesso non mostra più il testo su termini e privacy', 'O início de sessão já não mostra o texto de termos e privacidade', '登录界面不再显示条款和隐私文本', 'Во входе больше не показывается текст об условиях и конфиденциальности', 'لم تعد شاشة تسجيل الدخول تعرض نص الشروط والخصوصية', 'ログイン画面から利用規約とプライバシーの文を削除', 'साइन-इन से नियम और गोपनीयता का पाठ हटा दिया गया', '로그인에서 약관 및 개인정보 문구를 제거'],
    ['changelog.3.6.61', 'Al pulsar Comenzar en el quiz se ocultan los movimientos que hay bajo el nombre de la apertura', 'Pressing Start in the quiz hides the moves shown under the opening name', 'En prémer Comença al quiz s’amaguen els moviments que hi ha sota el nom de l’obertura', 'Start im Quiz blendet die Züge unter dem Eröffnungsnamen aus', 'Commencer dans le quiz masque les coups affichés sous le nom de l’ouverture', 'Premendo Inizia nel quiz si nascondono le mosse sotto il nome dell’apertura', 'Ao premir Começar no quiz ocultam-se os lances por baixo do nome da abertura', '在测验中按开始后，开局名称下方的着法会被隐藏', 'Кнопка «Начать» в викторине скрывает ходы под названием дебюта', 'عند الضغط على ابدأ في الاختبار تُخفى النقلات تحت اسم الافتتاح', 'クイズで開始を押すと、オープニング名の下の手順が隠れます', 'क्विज़ में शुरू दबाने पर ओपनिंग नाम के नीचे की चालें छिप जाती हैं', '퀴즈에서 시작을 누르면 오프닝 이름 아래의 수순이 숨겨집니다'],
    ['changelog.3.6.60', 'El quiz vuelve a mostrar la línea de movimientos, en el aviso y en el panel de la apertura', 'The quiz shows the move line again, in the notice and in the opening panel', 'El quiz torna a mostrar la línia de moviments, a l’avís i al panell de l’obertura', 'Das Quiz zeigt die Zugfolge wieder, im Hinweis und im Eröffnungspanel', 'Le quiz affiche de nouveau la ligne de coups, dans l’avis et dans le panneau de l’ouverture', 'Il quiz mostra di nuovo la linea di mosse, nell’avviso e nel pannello dell’apertura', 'O quiz volta a mostrar a linha de lances, no aviso e no painel da abertura', '测验再次显示着法，出现在提示和开局面板中', 'Викторина снова показывает линию ходов: в сообщении и на панели дебюта', 'يعرض الاختبار خط النقلات من جديد، في التنبيه وفي لوحة الافتتاح', 'クイズの手順を、通知とオープニングパネルに再び表示します', 'क्विज़ चालों की पंक्ति फिर दिखाता है, सूचना में और ओपनिंग पैनल में', '퀴즈가 알림과 오프닝 패널에 수순을 다시 표시합니다'],
    ['changelog.3.6.59', 'Avisos más claros: el quiz ya no muestra la solución, el resultado va en cifras y todos los cuadros usan título oscuro, texto gris y un botón', 'Clearer notices: the quiz no longer shows the answer, the result uses figures, and every notice has a dark title, grey text and a button', 'Avisos més clars: el quiz ja no mostra la solució, el resultat va en xifres i tots els quadres tenen títol fosc, text gris i un botó', 'Klarere Hinweise: das Quiz zeigt die Lösung nicht mehr, das Ergebnis steht in Zahlen, und alle Hinweise haben dunklen Titel, grauen Text und eine Schaltfläche', 'Avis plus clairs : le quiz ne montre plus la solution, le résultat est en chiffres, et chaque avis a un titre sombre, un texte gris et un bouton', 'Avvisi più chiari: il quiz non mostra più la soluzione, il risultato è in cifre e ogni avviso ha titolo scuro, testo grigio e un pulsante', 'Avisos mais claros: o quiz já não mostra a solução, o resultado vai em números e todos os avisos têm título escuro, texto cinzento e um botão', '提示更清晰：测验不再提前显示答案，结果用数字展示，所有提示框都有深色标题、灰色正文和一个按钮', 'Понятнее сообщения: викторина больше не показывает ответ заранее, итог — в цифрах, у всех окон тёмный заголовок, серый текст и кнопка', 'تنبيهات أوضح: الاختبار لم يعد يعرض الحل، والنتيجة بالأرقام، وكل التنبيهات بعنوان داكن ونص رمادي وزر', '通知を見やすく：クイズは答えを先に出さず、結果は数字で表示。すべての通知は濃い見出し、灰色の本文、ボタン付きです', 'स्पष्ट सूचनाएँ: क्विज़ अब उत्तर पहले नहीं दिखाता, परिणाम अंकों में है, और हर सूचना में गहरा शीर्षक, धूसर पाठ और एक बटन है', '더 분명한 알림: 퀴즈가 정답을 미리 보여주지 않고, 결과는 숫자로 표시되며, 모든 알림에 진한 제목·회색 본문·버튼이 있습니다'],
    ['changelog.3.6.58', 'Modo oscuro (automático, claro u oscuro en Configuración) e iconos vectoriales en lugar de emojis en botones y paneles', 'Dark mode (automatic, light or dark in Settings) and vector icons instead of emojis on buttons and panels', 'Mode fosc (automàtic, clar o fosc a Configuració) i icones vectorials en lloc d’emojis a botons i panells', 'Dunkelmodus (automatisch, hell oder dunkel in den Einstellungen) und Vektorsymbole statt Emojis auf Schaltflächen und Panels', 'Mode sombre (automatique, clair ou sombre dans Paramètres) et icônes vectorielles à la place des emojis sur les boutons et panneaux', 'Modalità scura (automatica, chiara o scura in Impostazioni) e icone vettoriali al posto delle emoji su pulsanti e pannelli', 'Modo escuro (automático, claro ou escuro nas Definições) e ícones vetoriais em vez de emojis nos botões e painéis', '深色模式（可在设置中选择自动、浅色或深色），按钮和面板使用矢量图标替代表情符号', 'Тёмная тема (автоматически, светлая или тёмная в настройках) и векторные значки вместо эмодзи на кнопках и панелях', 'الوضع الداكن (تلقائي أو فاتح أو داكن من الإعدادات) وأيقونات متجهة بدل الرموز التعبيرية في الأزرار واللوحات', 'ダークモード（設定で自動・ライト・ダークを選択）と、ボタンやパネルの絵文字をベクターアイコンに置き換え', 'डार्क मोड (सेटिंग्स में स्वचालित, हल्का या गहरा) और बटनों व पैनलों पर इमोजी की जगह वेक्टर आइकन', '다크 모드(설정에서 자동·라이트·다크 선택)와 버튼·패널의 이모지를 벡터 아이콘으로 교체'],
    ['changelog.3.6.57', 'Estilo visual unificado: un solo color de acento, botones con jerarquía clara y cabeceras de panel más ligeras', 'Unified visual style: a single accent colour, buttons with a clear hierarchy and lighter panel headers', 'Estil visual unificat: un sol color d’accent, botons amb jerarquia clara i capçaleres de panell més lleugeres', 'Einheitlicher Stil: eine Akzentfarbe, Schaltflächen mit klarer Hierarchie und leichtere Panel-Überschriften', 'Style visuel unifié : une seule couleur d’accent, des boutons hiérarchisés et des en-têtes de panneau plus légers', 'Stile visivo unificato: un solo colore di accento, pulsanti con gerarchia chiara e intestazioni dei pannelli più leggere', 'Estilo visual unificado: uma só cor de destaque, botões com hierarquia clara e cabeçalhos de painel mais leves', '统一视觉风格：单一强调色、层级清晰的按钮以及更轻盈的面板标题', 'Единый визуальный стиль: один акцентный цвет, кнопки с понятной иерархией и более лёгкие заголовки панелей', 'نمط بصري موحّد: لون إبراز واحد، وأزرار بتسلسل واضح، وعناوين لوحات أخف', 'ビジュアルを統一：アクセントカラーを1色に、ボタンの階層を明確にし、パネル見出しを軽くしました', 'एकीकृत दृश्य शैली: एक ही उभार रंग, स्पष्ट क्रम वाले बटन और हल्के पैनल शीर्षक', '통일된 시각 스타일: 강조색 하나, 위계가 분명한 버튼, 더 가벼운 패널 제목'],
    ['changelog.3.6.56', 'Tablero más claro: los resaltados ya no tapan el color de la casilla, los marcadores se adaptan al tamaño y el foco de teclado es visible', 'Clearer board: highlights no longer hide the square colour, move markers scale with the board and keyboard focus is visible', 'Tauler més clar: els ressaltats ja no tapen el color de la casella, els marcadors s’adapten a la mida i el focus de teclat és visible', 'Klareres Brett: Markierungen verdecken die Feldfarbe nicht mehr, Zugmarker passen sich der Größe an und der Tastaturfokus ist sichtbar', 'Échiquier plus lisible : les surlignages ne masquent plus la couleur des cases, les repères s’adaptent à la taille et le focus clavier est visible', 'Scacchiera più chiara: le evidenziazioni non coprono più il colore delle case, i segnalini si adattano alle dimensioni e il focus da tastiera è visibile', 'Tabuleiro mais claro: os destaques já não tapam a cor da casa, os marcadores ajustam-se ao tamanho e o foco do teclado é visível', '棋盘更清晰：高亮不再遮盖格子颜色，走法标记随棋盘缩放，键盘焦点清晰可见', 'Более чёткая доска: подсветка больше не скрывает цвет поля, маркеры ходов масштабируются, фокус клавиатуры виден', 'رقعة أوضح: التظليل لم يعد يخفي لون المربع، وعلامات النقلات تتكيف مع الحجم، وتركيز لوحة المفاتيح مرئي', '盤面がより見やすく：ハイライトがマスの色を隠さず、移動マーカーが盤サイズに合わせて拡大縮小し、キーボードフォーカスが表示されます', 'साफ़ बोर्ड: हाइलाइट अब खाने का रंग नहीं छिपाते, चाल चिह्न बोर्ड के आकार के अनुसार बदलते हैं और कीबोर्ड फ़ोकस दिखता है', '더 선명한 보드: 강조 표시가 칸 색을 가리지 않고, 이동 표시가 보드 크기에 맞춰지며, 키보드 포커스가 보입니다'],
    ['changelog.3.6.55', 'El informe a info@ajedrezia.com incluye el sistema operativo', 'Reports to info@ajedrezia.com now include the operating system', 'L’informe a info@ajedrezia.com inclou el sistema operatiu', 'Meldungen an info@ajedrezia.com enthalten das Betriebssystem', 'Le signalement à info@ajedrezia.com inclut le système d’exploitation', 'La segnalazione a info@ajedrezia.com include il sistema operativo', 'O relatório para info@ajedrezia.com inclui o sistema operativo', '发送到 info@ajedrezia.com 的反馈现在包含操作系统', 'Сообщения на info@ajedrezia.com включают операционную систему', 'التقرير إلى info@ajedrezia.com يتضمن نظام التشغيل', 'info@ajedrezia.com への報告に OS が含まれます', 'info@ajedrezia.com पर रिपोर्ट में ऑपरेटिंग सिस्टम शामिल है', 'info@ajedrezia.com 제보에 운영 체제가 포함됩니다'],
    ['changelog.3.6.54', 'En Aprende Ajedrez el aviso muestra (beta) en lugar de En construcción', 'In Learn Chess the label shows (beta) instead of Under construction', 'A Aprèn escacs l’avís mostra (beta) en lloc d’En construcció', 'Unter Schach lernen steht (Beta) statt Im Aufbau', 'Dans Apprends les échecs, le libellé affiche (bêta) au lieu de En construction', 'In Impara gli scacchi l’etichetta mostra (beta) al posto di In costruzione', 'Em Aprende xadrez o aviso mostra (beta) em vez de Em construção', '在“学习国际象棋”中，标签显示为 (测试版) 而非“正在建设中”', 'В «Учи шахматы» метка показывает (бета) вместо «В разработке»', 'في «تعلّم الشطرنج» يظهر (تجريبي) بدل «قيد الإنشاء»', '「チェスを学ぶ」の表示を「工事中」から (ベータ) に変更', '«शतरंज सीखो» में लेबल «निर्माणाधीन» की जगह (बीटा) दिखाता है', '체스 배우기 표시가 공사 중 대신 (베타)로 바뀝니다'],
    ['changelog.3.6.53', 'El modal de compartir se puede desplazar si no cabe en la pantalla', 'The share modal can be scrolled if it does not fit on the screen', 'El modal de compartir es pot desplaçar si no cap a la pantalla', 'Das Teilen-Fenster lässt sich scrollen, wenn es nicht auf den Bildschirm passt', 'La fenêtre de partage défile si elle ne tient pas à l’écran', 'La finestra di condivisione si può scorrere se non entra nello schermo', 'O modal de partilha pode ser deslocado se não couber no ecrã', '分享窗口在屏幕放不下时可滚动', 'Окно «Поделиться» прокручивается, если не помещается на экране', 'يمكن تمرير نافذة المشاركة إذا لم تتسع للشاشة', '共有画面が収まらないときはスクロールできます', 'शेयर विंडो स्क्रीन में न समाए तो स्क्रॉल की जा सकती है', '공유 창이 화면에 안 맞으면 스크롤할 수 있습니다'],
    ['changelog.3.6.52', 'En el móvil, Facebook abre la misma tarjeta clicable que en el PC, en vertical o apaisado', 'On mobile, Facebook opens the same clickable card as on PC, in portrait or landscape', 'Al mòbil, Facebook obre la mateixa targeta clicable que al PC, en vertical o apaïsada', 'Am Handy öffnet Facebook dieselbe klickbare Karte wie am PC, hoch oder quer', 'Sur mobile, Facebook ouvre la même carte cliquable que sur PC, en vertical ou paysage', 'Sul cellulare Facebook apre la stessa scheda cliccabile del PC, in verticale o orizzontale', 'No telemóvel, o Facebook abre o mesmo cartão clicável que no PC, na vertical ou horizontal', '手机上分享到 Facebook 时，与电脑一样显示可点击的竖图或横图', 'На телефоне Facebook открывает ту же кликабельную карточку, что и на ПК, вертикально или горизонтально', 'على الجوال يفتح فيسبوك نفس البطاقة القابلة للنقر كما على الحاسوب، عمودية أو أفقية', 'スマホでもPCと同じく、Facebookでクリックできる縦または横のカードが開きます', 'मोबाइल पर Facebook वही क्लिक करने योग्य कार्ड खोलता है जो PC पर, पोर्ट्रेट या लैंडस्केप', '모바일에서도 PC처럼 Facebook에 클릭 가능한 세로 또는 가로 카드가 열립니다'],
    ['changelog.3.6.51', 'Los textos nuevos de la interfaz están en todos los idiomas soportados', 'New interface strings are in all supported languages', 'Els textos nous de la interfície són en tots els idiomes compatibles', 'Neue Texte der Oberfläche gibt es in allen unterstützten Sprachen', 'Les nouveaux textes de l’interface sont dans toutes les langues prises en charge', 'I nuovi testi dell’interfaccia sono in tutte le lingue supportate', 'Os textos novos da interface estão em todos os idiomas suportados', '新的界面文案已覆盖所有支持的语言', 'Новые тексты интерфейса есть на всех поддерживаемых языках', 'النصوص الجديدة للواجهة متوفرة بجميع اللغات المدعومة', '新しい画面テキストは対応言語すべてにあります', 'नए इंटरफ़ेस पाठ सभी समर्थित भाषाओं में हैं', '새 인터페이스 문구가 지원되는 모든 언어에 있습니다'],
    ['changelog.3.6.50', 'En Nueva Partida, con Por correo el botón muestra Enviar invitación', 'In New Game, By email shows the Send invitation button', 'A Nova partida, amb Per correu el botó mostra Envia la invitació', 'In Neue Partie zeigt „Per E-Mail“ die Schaltfläche „Einladung senden“', 'Dans Nouvelle partie, « Par e-mail » affiche le bouton « Envoyer l’invitation »', 'In Nuova partita, « Per e-mail » mostra il pulsante « Invia invito »', 'Em Nova partida, « Por e-mail » mostra o botão « Enviar convite »', '在新对局中，选择“通过邮件”时按钮显示为“发送邀请”', 'В «Новая партия» при выборе «По почте» кнопка показывает «Отправить приглашение»', 'في «مباراة جديدة»، مع «بالبريد» يظهر الزر «إرسال الدعوة»', '新規対局で「メール」を選ぶと、ボタンが「招待を送る」になります', 'नई पार्टी में «ईमेल से» चुनने पर बटन «आमंत्रण भेजें» दिखाता है', '새 대국에서 이메일 대국을 고르면 버튼이 «초대 보내기»로 바뀝니다'],
    ['changelog.3.6.49', 'El inicio de sesión solo se pide para partida online o invitación por correo; en partida por correo se elige el control de tiempo', 'Sign-in is only asked for an online game or an email invite; correspondence games now include a time control', 'L\'inici de sessió només es demana per a una partida en línia o una invitació per correu; a la partida per correu es pot triar el control de temps', 'Anmeldung nur für eine Online-Partie oder eine E-Mail-Einladung; Fernpartien haben jetzt eine Bedenkzeit', 'La connexion n’est demandée que pour une partie en ligne ou une invitation par e-mail ; les parties par correspondance ont un contrôle du temps', 'L’accesso è chiesto solo per una partita online o un invito via e-mail; le partite per corrispondenza includono il controllo del tempo', 'O início de sessão só é pedido para uma partida online ou um convite por e-mail; nas partidas por correio escolhe-se o controlo de tempo', '仅在线对局或邮件邀请时才要求登录；通信棋现在也可选择时限', 'Вход нужен только для онлайн-партии или приглашения по почте; в партии по переписке можно выбрать контроль времени', 'يُطلب تسجيل الدخول فقط للعب عبر الإنترنت أو الدعوة بالبريد؛ وفي لعب المراسلة يمكن اختيار توقيت المباراة', 'サインインはオンライン対局またはメール招待のときだけ。通信対局でも持ち時間を選べます', 'साइन इन केवल ऑनलाइन खेल या ईमेल आमंत्रण के लिए; पत्राचार खेल में समय नियंत्रण चुना जा सकता है', '로그인은 온라인 대국이나 이메일 초대에만 필요하며, 통신 대국에서도 시간 제한을 고를 수 있습니다'],
    ['changelog.openHint', 'Ver historial de versiones', 'View version history', 'Veure l\'historial de versions'],
    ['changelog.3.6.46', 'Hashtags del texto de compartir actualizados, con más idiomas', 'Share-text hashtags updated, with more languages', 'Hashtags del text per compartir actualitzats, amb més idiomes'],
    ['changelog.3.6.45', 'En Jugadores registrados el botón Actualizar ya no muestra el icono dos veces', 'In Registered players the Refresh button no longer shows the icon twice', 'A Jugadors registrats el botó Actualitza ja no mostra la icona dues vegades'],
    ['changelog.3.6.44', 'El texto y la imagen de compartir incluyen el enlace ?opening= también en las trampas', 'Share text and image now include the ?opening= link for traps too', 'El text i la imatge per compartir inclouen l\'enllaç ?opening= també a les trampes'],
    ['changelog.3.6.43', 'El vídeo de compartir muestra las animaciones de captura y de jaque al rey', 'Share videos now show capture and king-check animations', 'El vídeo per compartir mostra les animacions de captura i d\'escac al rei'],
    ['changelog.3.6.42', 'Al jaque mate el rey tiembla y su casilla se ilumina en rojo', 'On checkmate the king shakes and its square lights up in red', 'A l\'escac i mat el rei tremola i la casella s\'il·lumina de vermell'],
    ['changelog.3.6.41', '24 trampas de apertura con nombre: Frankenstein-Drácula, Cochrane, Greco, cadete, Winter, Marshall, Muzio, Allgaier, letón, Jerome, Staunton, Grünfeld, Riga, Max Lange, elefante, Napoleón, Wayward, Rousseau, Winawer, Nakhmanson, Philidor, portugués, Monkey’s Bum y Schliemann', '24 named opening traps: Frankenstein–Dracula, Cochrane, Greco, sea-cadet, Winter, Marshall, Muzio, Allgaier, Latvian, Jerome, Staunton, Grünfeld, Riga, Max Lange, Elephant Gambit, Napoleon, Wayward, Rousseau, Winawer, Nakhmanson, Philidor, Portuguese, Monkey’s Bum and Schliemann', '24 trampes d\'obertura amb nom: Frankenstein-Dràcula, Cochrane, Greco, cadet, Winter, Marshall, Muzio, Allgaier, letó, Jerome, Staunton, Grünfeld, Riga, Max Lange, elefant, Napoleó, Wayward, Rousseau, Winawer, Nakhmanson, Philidor, portuguès, Monkey’s Bum i Schliemann'],
    ['changelog.3.6.40', '12 trampas nuevas y menú por categoría: jaque mate, ganar dama, ganar pieza, cazar pieza y ataque al rey', '12 new traps and a menu by category: checkmate, win the queen, win a piece, trap a piece and attack the king', '12 trampes noves i menú per categoria: escac i mat, guanyar dama, guanyar peça, caçar peça i atac al rei'],
    ['changelog.3.6.39', 'El enlace de una trampa reproduce la línea entera, sin el popup de variantes de otra apertura', 'A trap link replays the full line, without another opening’s variations popup', 'L\'enllaç d\'una trampa reprodueix la línia sencera, sense el popup de variants d\'una altra obertura'],
    ['changelog.3.6.38', '13 trampas de apertura nuevas: siberiana, Magnus Smith, Monticelli, Tarrasch, Cambridge Springs, Mortimer, Würzburger, Ópera, Traxler, Stafford, Matovinsky, Halosar y mate del loco', '13 new opening traps: Siberian, Magnus Smith, Monticelli, Tarrasch, Cambridge Springs, Mortimer, Würzburger, Opera, Traxler, Stafford, Matovinsky, Halosar and Fool’s mate', '13 trampes d\'obertura noves: siberiana, Magnus Smith, Monticelli, Tarrasch, Cambridge Springs, Mortimer, Würzburger, Òpera, Traxler, Stafford, Matovinsky, Halosar i mat del boig'],
    ['changelog.3.6.37', 'Al terminar una trampa de apertura ya no se muestra el modal Apertura completada', 'Finishing an opening trap no longer shows the Opening completed modal', 'En acabar una trampa d\'obertura ja no es mostra el modal Obertura completada'],
    ['changelog.3.6.36', 'En el quiz de aperturas ya no aparece el aviso de movimiento incorrecto', 'The opening quiz no longer shows the incorrect-move warning', 'Al quiz d\'obertures ja no apareix l\'avís de moviment incorrecte'],
    ['changelog.3.6.35', 'En Entrenar Aperturas las trampas tienen su propio menú, aparte de Selecciona una apertura', 'In Train Openings, traps have their own menu, separate from Select an opening', 'A Entrena obertures les trampes tenen el seu propi menú, a part de Selecciona una obertura'],
    ['changelog.3.6.34', 'Nueva categoría Trampas de apertura: trucos para blancas y negras, con por qué funcionan y cómo evitarlos', 'New Opening traps category: tricks for White and Black, with why they work and how to avoid them', 'Nova categoria Trampes d\'obertura: trucs per a blanques i negres, amb per què funcionen i com evitar-los'],
    ['changelog.3.6.33', 'En la imagen vertical el texto queda más abajo, sin cambiar los números del vídeo', 'On the vertical image the text sits lower, without changing the video numbers', 'A la imatge vertical el text queda més avall, sense canviar els números del vídeo'],
    ['changelog.3.6.32', 'La imagen de compartir se guarda en 16:9 (horizontal) o 9:16 (vertical)', 'The share image is saved as 16:9 (landscape) or 9:16 (portrait)', 'La imatge per compartir es desa en 16:9 (horitzontal) o 9:16 (vertical)'],
    ['changelog.3.6.31', 'Botones arriba/izquierda más pequeños, números más pegados al tablero y texto más grande en la tarjeta', 'Smaller top/left buttons, ranks closer to the board and larger text on the share card', 'Botons dalt/esquerra més petits, números més enganxats al tauler i text més gran a la targeta'],
    ['changelog.3.6.30', 'La tarjeta de compartir puede mostrar el tablero arriba (más grande) o a la izquierda, y recuerda la última elección', 'The share card can show a larger board on top or on the left, and remembers the last choice', 'La targeta de compartir pot mostrar el tauler a dalt (més gran) o a l\'esquerra, i recorda l\'última elecció'],
    ['changelog.3.6.29', 'Al compartir en Facebook la imagen es la misma del modal, en el idioma de la interfaz', 'Facebook shares use the same card image as the modal, in the interface language', 'En compartir a Facebook la imatge és la mateixa del modal, en l\'idioma de la interfície'],
    ['changelog.3.6.28', 'En móvil el arrastre ya no deja una pieza flotante y vuelve a mover al soltar', 'On mobile, dragging no longer leaves a floating piece and drops the move again', 'Al mòbil l\'arrossegament ja no deixa una peça flotant i torna a moure en deixar anar'],
    ['changelog.3.6.27', 'Las piezas se mueven arrastrándolas o pulsando origen y destino', 'Pieces move by dragging or by tapping origin and destination', 'Les peces es mouen arrossegant-les o prement origen i destí'],
    ['changelog.3.6.26', 'Las piezas solo se mueven arrastrándolas, no al pulsar origen y destino', 'Pieces only move by dragging, not by tapping origin and destination', 'Les peces només es mouen arrossegant-les, no en prémer origen i destí'],
    ['changelog.3.6.25', 'En piezas comidas se muestra el valor total capturado por blancas y por negras', 'Captured pieces now show the total material value for White and Black', 'A les peces menjades es mostra el valor total capturat per blanques i negres'],
    ['changelog.3.6.24', 'Los problemas de ajedrez se pueden hacer sin abrir el modal Iniciar Sesión', 'Chess puzzles can be played without opening the Sign in modal', 'Els problemes d\'escacs es poden fer sense obrir el modal Inicia sessió'],
    ['changelog.3.6.23', 'Al entrar en www.ajedrezia.com no se muestra el modal Iniciar Sesión', 'Opening www.ajedrezia.com no longer shows the Sign in modal', 'En entrar a www.ajedrezia.com no es mostra el modal Inicia sessió'],
    ['changelog.3.6.22', 'El inicio de sesión no aparece al abrir la app; se muestra cada 5 minutos si no hay sesión', 'Sign-in no longer appears on launch; it is shown every 5 minutes if you are not signed in', 'L\'inici de sessió no apareix en obrir l\'app; es mostra cada 5 minuts si no hi ha sessió'],
    ['changelog.3.6.21', 'El historial de versiones se abre al pulsar el número de versión, no al iniciar', 'The version history opens when you tap the version number, not on launch', 'L\'historial de versions s\'obre en prémer el número de versió, no en iniciar'],
    ['changelog.3.6.20', 'En PC los vídeos de compartir se generan más rápido, con el mismo ritmo al reproducirlos', 'On PC, share videos are generated faster, with the same playback timing', 'Al PC els vídeos per compartir es generen més ràpid, amb el mateix ritme en reproduir-los'],
    ['changelog.3.6.01', 'Nuevos idiomas en Configuración: Deutsch, Français, Italiano, Português, 中文, Русский, العربية, 日本語, हिन्दी y 한국어', 'New languages in Settings: Deutsch, Français, Italiano, Português, 中文, Русский, العربية, 日本語, हिन्दी and 한국어', 'Idiomes nous a Configuració: Deutsch, Français, Italiano, Português, 中文, Русский, العربية, 日本語, हिन्दी i 한국어'],
    ['changelog.3.6.00', 'El botón Acceder como Invitado se muestra en el idioma seleccionado (español, inglés o catalán)', 'The Continue as Guest button is shown in the selected language (Spanish, English or Catalan)', 'El botó Accedir com a convidat es mostra en l\'idioma seleccionat (espanyol, anglès o català)'],
    ['changelog.3.5.74', 'Nuevo idioma: Català (CAT), con toda la interfaz, lecciones, aperturas, banners y tarjetas de compartir', 'New language: Catalan (CAT), covering the whole UI, lessons, openings, banners and share cards', 'Idioma nou: Català (CAT), amb tota la interfície, lliçons, obertures, bàners i targetes de compartir'],
    ['changelog.3.5.73', 'La imagen y el vídeo de compartir usan el idioma de la interfaz (español o inglés)', 'Share image and video use the interface language (Spanish or English)', 'La imatge i el vídeo de compartir fan servir l\'idioma de la interfície (espanyol o anglès)'],
    ['changelog.3.5.72', 'Banners del tablero, modales y mensajes restantes también se traducen; el sistema de idiomas queda listo para añadir más idiomas', 'Board banners, remaining modals and messages are translated; the language system is ready for more languages', 'Els bàners del tauler, els modals i els missatges restants també es tradueixen; el sistema d\'idiomes queda a punt per afegir-ne més'],
];

registerI18n(I18N_PAIRS);

let currentLang = 'en';

function detectBrowserLanguage() {
    const navs = ((navigator.languages && navigator.languages.length)
        ? navigator.languages
        : [navigator.language || navigator.userLanguage || '']
    ).map(function(s) { return String(s || '').toLowerCase(); });
    for (let i = 0; i < navs.length; i++) {
        const nav = navs[i];
        if (nav === 'cat' || nav.indexOf('cat-') === 0) return 'ca';
        if (nav === 'jp' || nav.indexOf('jp-') === 0) return 'ja';
        if (nav === 'kr' || nav.indexOf('kr-') === 0) return 'ko';
        if (nav === 'cn' || nav.indexOf('cn-') === 0) return 'zh';
        for (let j = 0; j < I18N_LANGS.length; j++) {
            const lang = I18N_LANGS[j];
            if (nav === lang || nav.indexOf(lang + '-') === 0) return lang;
        }
    }
    return 'en';
}

function detectAppLanguage() {
    try {
        const saved = localStorage.getItem('ajedrezia_lang_pref');
        if (isSupportedLang(saved)) return saved;
    } catch (e) {}
    return detectBrowserLanguage();
}

function persistAppLanguage(lang) {
    currentLang = isSupportedLang(lang) ? lang : 'en';
    try { localStorage.setItem('ajedrezia_lang_pref', currentLang); } catch (e) {}
    try { localStorage.setItem('ajedrezia_lang', currentLang); } catch (e) {}
    try {
        const settings = JSON.parse(localStorage.getItem('chess_settings') || '{}');
        if (settings.language !== currentLang) {
            settings.language = currentLang;
            localStorage.setItem('chess_settings', JSON.stringify(settings));
        }
    } catch (e) {}
}

function helpVideoTitle(entry) {
    if (!entry) return '';
    const map = {
        intro: 'help.video.intro',
        'tutorial-completo': 'help.fullTutorial',
        'new-game': 'newGame',
        openings: 'panel.openings',
        puzzles: 'panel.puzzles',
        famous: 'panel.famous',
        config: 'panel.config',
        actions: 'panel.actions',
        analysis: 'help.analysis',
        share: 'help.share'
    };
    return t(map[entry.key] || ('help.video.' + entry.key), null, entry.title);
}

function t(key, vars, fallback) {
    const dict = I18N[currentLang] || I18N[I18N_LANGS[0]] || {};
    let text = dict[key];
    if (text == null && I18N.en) text = I18N.en[key];
    if (text == null && I18N.es) text = I18N.es[key];
    if (text == null) text = fallback != null ? fallback : key;
    if (vars) {
        Object.keys(vars).forEach(function(name) {
            text = text.split('{' + name + '}').join(vars[name]);
        });
    }
    return text;
}

function inviteColorLabel(color) {
    if (color === 'white') return t('invite.colorWhite');
    if (color === 'black') return t('invite.colorBlack');
    if (color === 'random') return t('invite.colorRandom');
    return '';
}

function pieceName(type) {
    return t('piece.' + type, null, type);
}

function openingNameOf(key, opening) {
    return t('op.' + key + '.name', null, (opening && opening.name) || key);
}

function variantDescKey(desc) {
    return 'var.' + String(desc || '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/:/g, '.')
        .replace(/[^a-z0-9.]+/g, '-')
        .replace(/^[-.]+|[-.]+$/g, '');
}

function openingVariantDescOf(rawName) {
    if (!rawName) return '';
    if (rawName === 'Variante desconocida') return t('opening.unknownVariant');
    const idx = rawName.indexOf(' — ');
    const desc = idx >= 0 ? rawName.slice(idx + 3) : rawName;
    return t(variantDescKey(desc), null, desc);
}

function openingVariantFullOf(rawName) {
    if (!rawName) return '';
    if (rawName === 'Variante desconocida') return t('opening.unknownVariant');
    const idx = rawName.indexOf(' — ');
    if (idx < 0) return openingVariantDescOf(rawName);
    return rawName.slice(0, idx) + ' — ' + openingVariantDescOf(rawName);
}

function openingDescOf(key, opening) {
    return t('op.' + key + '.desc', null, (opening && opening.desc) || '');
}

function openingWhyOf(key, opening) {
    return t('op.' + key + '.why', null, (opening && opening.why) || '');
}

function openingRefuteOf(key, opening) {
    return t('op.' + key + '.refute', null, (opening && opening.refute) || '');
}

function learnField(lesson, field) {
    const map = { title: 'title', description: 'desc', successMessage: 'success' };
    const k = map[field] || field;
    return t('learn.' + lesson.id + '.' + k, null, lesson[field]);
}

function learnStepField(lesson, stepIndex, field) {
    const step = lesson.steps[stepIndex];
    return t('learn.' + lesson.id + '.s' + stepIndex + '.' + field, null, (step && step[field]) || '');
}

function applyI18n() {
    const lang = currentLang || I18N_LANGS[0];
    document.documentElement.lang = lang;
    document.documentElement.dir = I18N_RTL[lang] ? 'rtl' : 'ltr';
    document.title = t('meta.title');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('meta.description'));
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', t('meta.title'));
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', t('meta.description'));
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', t('meta.title'));
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', t('meta.description'));

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        if (el.tagName === 'OPTGROUP') {
            el.label = t(key);
            return;
        }
        if (el.tagName === 'OPTION') {
            const text = t(key);
            el.text = text;
            el.label = text;
            return;
        }
        el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
        el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
        el.title = t(el.getAttribute('data-i18n-title'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
        el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-lang') === currentLang);
    });
    const langSelect = document.getElementById('language-select');
    if (langSelect) langSelect.value = currentLang;

    if (typeof updateNewGamePickerLabels === 'function') updateNewGamePickerLabels();
    if (typeof updateLoginStatusButton === 'function') updateLoginStatusButton();
    if (typeof renderLearnLessonList === 'function') renderLearnLessonList();
    if (typeof updateShareButton === 'function') updateShareButton();
    if (typeof onOpeningSelect === 'function') onOpeningSelect();
    if (typeof updateLearnI18n === 'function') updateLearnI18n();
    if (typeof updateOnlineBanner === 'function') updateOnlineBanner();
    if (typeof refreshDynamicI18n === 'function') refreshDynamicI18n();
    if (typeof applyInfoMailtoOs === 'function') applyInfoMailtoOs();
    refreshI18nSelectDisplays();
}

function refreshI18nSelectDisplays() {
    const redrawn = new Set();
    document.querySelectorAll('select').forEach(function(select) {
        const selected = select.options[select.selectedIndex];
        const wrap = select.closest('.custom-select-wrap');
        const trigger = wrap && wrap.querySelector('.custom-select-trigger');
        if (trigger && selected) trigger.textContent = selected.text;

        // Chrome/Edge no repintan el <select> cerrado al cambiar option.text.
        if (!selected || !selected.hasAttribute('data-i18n')) return;
        if (redrawn.has(select) || !select.parentNode) return;
        redrawn.add(select);
        const parent = select.parentNode;
        const next = select.nextSibling;
        parent.removeChild(select);
        parent.insertBefore(select, next);
    });
}

function opponentName(obj) {
    return (obj && (obj.nick || obj.name)) || t('opponent');
}

function setAppLanguage(lang, persist) {
    currentLang = isSupportedLang(lang) ? lang : 'en';
    applyI18n();
    if (typeof renderOnlineNowList === 'function') renderOnlineNowList();
    if (persist !== false) {
        persistAppLanguage(currentLang);
        if (typeof saveSettings === 'function') saveSettings();
    }
}

currentLang = detectAppLanguage();
if (document.body) applyI18n();
