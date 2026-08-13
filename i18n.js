// Sistema de idiomas para AjedrezIA.
// Uso: t('newGame')  ·  applyI18n()  ·  setAppLanguage('en')
//
// Para añadir un idioma nuevo:
//  1. Añade el código a I18N_LANGS (ej. 'fr').
//  2. Añade la traducción como siguiente columna en cada fila de I18N_PAIRS
//     y en i18n-content.js (mismo orden que I18N_LANGS).
//  3. Añade el botón/opción en index.html (data-lang="fr").
//  4. Las claves nuevas se registran con registerI18n([['clave', 'es', 'en', ...]]).

const I18N_LANGS = ['es', 'en', 'ca'];
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
    ['underConstruction', '🚧 En construcción', '🚧 Under construction', '🚧 En construcció'],
    ['learn.underConstruction', '🚧 Sección en construcción: puede haber lecciones incompletas o cambios frecuentes.', '🚧 Section under construction: some lessons may be incomplete or change often.', '🚧 Secció en construcció: pot haver-hi lliçons incompletes o canvis freqüents.'],
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
    ['opening.startTraining', '♟ Iniciar Entrenamiento', '♟ Start Training', '♟ Inicia l\'entrenament'],
    ['opening.knownVariants', '📖 Variantes Conocidas', '📖 Known Variations', '📖 Variants conegudes'],
    ['opening.quiz', '🧠 Quiz: Adivina el Movimiento', '🧠 Quiz: Guess the Move', '🧠 Quiz: Endevina el moviment'],
    ['opening.completed', 'Apertura completada', 'Opening completed', 'Obertura completada'],
    ['opening.pressVariants', 'Pulsa variantes sobre el tablero para reemprender apertura', 'Tap variations on the board to resume the opening', 'Prem variants sobre el tauler per reprendre l\'obertura'],
    ['opening.continueGame', '▶ Continuar Partida', '▶ Continue Game', '▶ Continua la partida'],
    ['opening.continueOpening', '📖 Continuar Apertura', '📖 Continue Opening', '📖 Continua l\'obertura'],
    ['opening.variantsHint', 'Selecciona una variante para continuar', 'Select a variation to continue', 'Selecciona una variant per continuar'],
    ['opening.variantsTitle', '📖 Variantes conocidas ({n})', '📖 Known variations ({n})', '📖 Variants conegudes ({n})'],
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
    ['login.subtitle', 'Para usar AjedrezIA debes iniciar sesión con tu usuario, Google o acceder como invitado.', 'To use AjedrezIA you must sign in with your username, Google, or continue as a guest.', 'Per fer servir AjedrezIA has d\'iniciar sessió amb el teu usuari, Google o accedir com a convidat.'],
    ['login.connecting', 'Conectando…', 'Connecting…', 'Connectant…'],
    ['login.user', 'Usuario:', 'Username:', 'Usuari:'],
    ['login.password', 'Contraseña:', 'Password:', 'Contrasenya:'],
    ['login.nickPlaceholder', 'Tu nickname', 'Your nickname', 'El teu sobrenom'],
    ['login.pwdPlaceholder', 'Tu contraseña', 'Your password', 'La teva contrasenya'],
    ['login.showPwd', 'Ver contraseña', 'Show password', 'Mostra la contrasenya'],
    ['login.or', 'o', 'or', 'o'],
    ['login.google', 'Continuar con Google', 'Continue with Google', 'Continua amb Google'],
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
    ['user.onlineStatus', 'Online', 'Online', 'En línia'],
    ['user.busyYou', 'Ocupado (tú)', 'Busy (you)', 'Ocupat (tu)'],
    ['user.onlineYou', 'Online (tú)', 'Online (you)', 'En línia (tu)'],
    ['newVersion', '🆕 Nueva Versión {v}', '🆕 New Version {v}', '🆕 Nova versió {v}'],
    ['opening.seeVariants', 'Ver {n} variantes', 'See {n} variations', 'Veure {n} variants'],
    ['help.video.soon', 'Vídeo disponible próximamente', 'Video coming soon', 'Vídeo disponible properament'],
    ['help.video.intro', '🎬 Introducción a AjedrezIA', '🎬 Introduction to AjedrezIA', '🎬 Introducció a AjedrezIA'],
    ['changelog.3.5.71', 'Al abrir AjedrezIA, el idioma sigue el del navegador (español o inglés) y se recuerda entre sesiones', 'On launch, AjedrezIA follows the browser language (Spanish or English) and remembers it between sessions', 'En obrir AjedrezIA, l\'idioma segueix el del navegador (espanyol o anglès) i es recorda entre sessions'],
    ['changelog.3.5.70', 'Todo el contenido dinámico (mensajes, lecciones, aperturas, problemas y compartir) usa el sistema bilingüe ES/EN', 'All dynamic content (messages, lessons, openings, puzzles and sharing) uses the ES/EN bilingual system', 'Tot el contingut dinàmic (missatges, lliçons, obertures, problemes i compartir) fa servir el sistema bilingüe ES/EN'],
    ['start', 'Comenzar', 'Start', 'Comença'],
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
    ['share.kind.maestra', 'Partida maestra', 'Master game', 'Partida mestra'],
    ['share.kind.home', 'AjedrezIA', 'AjedrezIA', 'AjedrezIA'],
    ['share.openingNamed', 'Apertura: {name}', 'Opening: {name}', 'Obertura: {name}'],
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
    ['lib.unavailable', 'Biblioteca no disponible', 'Library unavailable', 'Biblioteca no disponible'],
    ['lib.loadingGames', '⏳ Cargando partidas de {name}…', '⏳ Loading games by {name}…', '⏳ Carregant partides de {name}…'],
    ['quiz.intro', '<strong>Quiz: {name}</strong><br>Juega todos los movimientos correctos (blancas y negras)<br><br><strong>Movimientos:</strong> {san}', '<strong>Quiz: {name}</strong><br>Play every correct move (White and Black)<br><br><strong>Moves:</strong> {san}', '<strong>Quiz: {name}</strong><br>Juga tots els moviments correctes (blanques i negres)<br><br><strong>Moviments:</strong> {san}'],
    ['quiz.done', '<strong>Quiz completado: {name}</strong><br>Aciertos: {ok} | Fallos: {fail} | Precisión: {pct}%<br>ELO quiz: {elo}', '<strong>Quiz complete: {name}</strong><br>Hits: {ok} | Misses: {fail} | Accuracy: {pct}%<br>Quiz ELO: {elo}', '<strong>Quiz completat: {name}</strong><br>Encerts: {ok} | Errors: {fail} | Precisió: {pct}%<br>ELO quiz: {elo}'],
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
    ['changelog.3.5.74', 'Nuevo idioma: Català (CAT), con toda la interfaz, lecciones, aperturas, banners y tarjetas de compartir', 'New language: Catalan (CAT), covering the whole UI, lessons, openings, banners and share cards', 'Idioma nou: Català (CAT), amb tota la interfície, lliçons, obertures, bàners i targetes de compartir'],
    ['changelog.3.5.73', 'La imagen y el vídeo de compartir usan el idioma de la interfaz (español o inglés)', 'Share image and video use the interface language (Spanish or English)', 'La imatge i el vídeo de compartir fan servir l\'idioma de la interfície (espanyol o anglès)'],
    ['changelog.3.5.72', 'Banners del tablero, modales y mensajes restantes también se traducen; el sistema de idiomas queda listo para añadir más idiomas', 'Board banners, remaining modals and messages are translated; the language system is ready for more languages', 'Els bàners del tauler, els modals i els missatges restants també es tradueixen; el sistema d\'idiomes queda a punt per afegir-ne més'],
];

registerI18n(I18N_PAIRS);

let currentLang = 'es';

function detectBrowserLanguage() {
    const navs = ((navigator.languages && navigator.languages.length)
        ? navigator.languages
        : [navigator.language || navigator.userLanguage || '']
    ).map(function(s) { return String(s || '').toLowerCase(); });
    for (let i = 0; i < navs.length; i++) {
        const nav = navs[i];
        if (nav === 'cat' || nav.indexOf('cat-') === 0) return 'ca';
        for (let j = 0; j < I18N_LANGS.length; j++) {
            const lang = I18N_LANGS[j];
            if (nav === lang || nav.indexOf(lang + '-') === 0) return lang;
        }
    }
    return isSupportedLang('en') ? 'en' : I18N_LANGS[0];
}

function detectAppLanguage() {
    try {
        const dedicated = localStorage.getItem('ajedrezia_lang');
        if (isSupportedLang(dedicated)) return dedicated;
    } catch (e) {}
    try {
        const saved = JSON.parse(localStorage.getItem('chess_settings') || '{}').language;
        // 'en' guardado es una elección real. 'es' puede ser el valor por defecto
        // del detector antiguo (cualquier idioma ≠ inglés → español).
        if (saved === 'en' && isSupportedLang('en')) return 'en';
        if (isSupportedLang(saved) && saved !== 'es') return saved;
    } catch (e) {}
    return detectBrowserLanguage();
}

function persistAppLanguage(lang) {
    currentLang = isSupportedLang(lang) ? lang : I18N_LANGS[0];
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

function openingDescOf(key, opening) {
    return t('op.' + key + '.desc', null, (opening && opening.desc) || '');
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
    document.documentElement.lang = currentLang || I18N_LANGS[0];
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
}

function opponentName(obj) {
    return (obj && (obj.nick || obj.name)) || t('opponent');
}

function setAppLanguage(lang, persist) {
    currentLang = isSupportedLang(lang) ? lang : I18N_LANGS[0];
    applyI18n();
    if (persist !== false) {
        persistAppLanguage(currentLang);
        if (typeof saveSettings === 'function') saveSettings();
    }
}

currentLang = detectAppLanguage();
persistAppLanguage(currentLang);
if (document.body) applyI18n();
