// Sistema bilingüe Español / English para AjedrezIA.
// Uso: t('newGame')  ·  applyI18n()  ·  setAppLanguage('en')

const I18N_PAIRS = [
    ['meta.title', 'AjedrezIA — Juega y aprende ajedrez con IA', 'AjedrezIA — Play and learn chess with AI'],
    ['meta.description', 'Juega contra la IA, resuelve problemas, estudia aperturas y partidas maestras. Gratis y sin registro.', 'Play against the AI, solve puzzles, study openings and master games. Free, no sign-up required.'],
    ['newGame', '♟ Nueva Partida', '♟ New Game'],
    ['panel.openings', '📖 Entrenar Aperturas', '📖 Train Openings'],
    ['panel.puzzles', '🧩 Problemas de Ajedrez', '🧩 Chess Puzzles'],
    ['panel.famous', '🏆 Partidas Maestras', '🏆 Master Games'],
    ['panel.catLeague', '🏁 Partides Lliga CAT', '🏁 Catalan League Games'],
    ['panel.learn', '📚 Aprende Ajedrez', '📚 Learn Chess'],
    ['panel.clock', '⏱️ Reloj de Ajedrez', '⏱️ Chess Clock'],
    ['panel.chat', '💬 Chat', '💬 Chat'],
    ['panel.config', '⚙️ Configuración', '⚙️ Settings'],
    ['panel.actions', '⚡ Acciones', '⚡ Actions'],
    ['panel.stats', '📊 Estadísticas', '📊 Statistics'],
    ['underConstruction', '🚧 En construcción', '🚧 Under construction'],
    ['learn.underConstruction', '🚧 Sección en construcción: puede haber lecciones incompletas o cambios frecuentes.', '🚧 Section under construction: some lessons may be incomplete or change often.'],
    ['opening.select', 'Selecciona una apertura:', 'Select an opening:'],
    ['opening.freeMode', '— Modo libre —', '— Free mode —'],
    ['opening.groupOpen', '1.e4 e5 — Juego Abierto', '1.e4 e5 — Open Games'],
    ['opening.groupSemi', '1.e4 — Semiabiertas', '1.e4 — Semi-Open'],
    ['opening.groupQG', '1.d4 — Gambito de Dama', '1.d4 — Queen’s Gambit'],
    ['opening.groupIndian', '1.d4 Kf6 2.c4— Defensas Indias', '1.d4 Nf6 2.c4 — Indian Defences'],
    ['opening.groupSystems', '1.d4 — Sistemas', '1.d4 — Systems'],
    ['opening.groupOther', 'Otras Aperturas', 'Other Openings'],
    ['opening.italiana', 'Apertura Italiana (Giuoco Piano) [C54]', 'Italian Game (Giuoco Piano) [C54]'],
    ['opening.evans', 'Gambito Evans [C51]', 'Evans Gambit [C51]'],
    ['opening.espanola', 'Apertura Española (Ruy López) [C60]', 'Ruy Lopez (Spanish Opening) [C60]'],
    ['opening.escocesa', 'Apertura Escocesa [C45]', 'Scotch Game [C45]'],
    ['opening.petrov', 'Defensa Petrov [C42]', 'Petrov Defence [C42]'],
    ['opening.fourKnights', 'Cuatro Caballos [C47]', 'Four Knights [C47]'],
    ['opening.vienna', 'Apertura Vienesa [C25]', 'Vienna Game [C25]'],
    ['opening.kingsGambit', 'Gambito de Rey [C30]', 'King’s Gambit [C30]'],
    ['opening.twoKnights', 'Dos Caballos [C55]', 'Two Knights Defence [C55]'],
    ['opening.philidor', 'Defensa Philidor [C41]', 'Philidor Defence [C41]'],
    ['opening.sicilian', 'Defensa Siciliana [B20]', 'Sicilian Defence [B20]'],
    ['opening.french', 'Defensa Francesa [C00]', 'French Defence [C00]'],
    ['opening.caroKann', 'Defensa Caro-Kann [B10]', 'Caro-Kann Defence [B10]'],
    ['opening.scandinavian', 'Defensa Escandinava [B01]', 'Scandinavian Defence [B01]'],
    ['opening.pirc', 'Defensa Pirc [B07]', 'Pirc Defence [B07]'],
    ['opening.alekhine', 'Defensa Alekhine [B02]', 'Alekhine Defence [B02]'],
    ['opening.modern', 'Defensa Moderna [B06]', 'Modern Defence [B06]'],
    ['opening.qga', 'Gambito de Dama Aceptado [D20]', 'Queen’s Gambit Accepted [D20]'],
    ['opening.qgd', 'GDR Ortodoxa [D60]', 'QGD Orthodox [D60]'],
    ['opening.slav', 'Defensa Eslava [D10]', 'Slav Defence [D10]'],
    ['opening.semiSlav', 'Semi-Eslava [D43]', 'Semi-Slav [D43]'],
    ['opening.grunfeld', 'Defensa Grünfeld [D85]', 'Grünfeld Defence [D85]'],
    ['opening.kingsIndian', 'India de Rey [E60]', 'King’s Indian [E60]'],
    ['opening.nimzo', 'Nimzo-India [E20]', 'Nimzo-Indian [E20]'],
    ['opening.queensIndian', 'India de Dama [E12]', 'Queen’s Indian [E12]'],
    ['opening.bogo', 'Bogo-India [E11]', 'Bogo-Indian [E11]'],
    ['opening.benoni', 'Benoni Moderna [A60]', 'Modern Benoni [A60]'],
    ['opening.budapest', 'Gambito Budapest [A52]', 'Budapest Gambit [A52]'],
    ['opening.dutch', 'Defensa Holandesa [A80]', 'Dutch Defence [A80]'],
    ['opening.london', 'Sistema Londres [D02]', 'London System [D02]'],
    ['opening.colle', 'Sistema Colle [D05]', 'Colle System [D05]'],
    ['opening.trompowsky', 'Apertura Trompowsky [A45]', 'Trompowsky Attack [A45]'],
    ['opening.torre', 'Ataque Torre [A46]', 'Torre Attack [A46]'],
    ['opening.english', 'Apertura Inglesa [A20]', 'English Opening [A20]'],
    ['opening.reti', 'Apertura Réti [A09]', 'Réti Opening [A09]'],
    ['opening.catalan', 'Apertura Catalana [E01]', 'Catalan Opening [E01]'],
    ['opening.larsen', 'Apertura Larsen [A01]', 'Larsen’s Opening [A01]'],
    ['opening.bird', 'Apertura Bird [A02]', 'Bird’s Opening [A02]'],
    ['opening.startTraining', '♟ Iniciar Entrenamiento', '♟ Start Training'],
    ['opening.knownVariants', '📖 Variantes Conocidas', '📖 Known Variations'],
    ['opening.quiz', '🧠 Quiz: Adivina el Movimiento', '🧠 Quiz: Guess the Move'],
    ['opening.completed', 'Apertura completada', 'Opening completed'],
    ['opening.pressVariants', 'Pulsa variantes sobre el tablero para reemprender apertura', 'Tap variations on the board to resume the opening'],
    ['opening.continueGame', '▶ Continuar Partida', '▶ Continue Game'],
    ['opening.continueOpening', '📖 Continuar Apertura', '📖 Continue Opening'],
    ['opening.variantsHint', 'Selecciona una variante para continuar', 'Select a variation to continue'],
    ['opening.variantsTitle', '📖 Variantes conocidas ({n})', '📖 Known variations ({n})'],
    ['opening.variantsExampleAlt', 'Ejemplo de variantes mostradas sobre el tablero', 'Example of variations shown on the board'],
    ['puzzle.millions', '~5,5 millones de problemas', '~5.5 million puzzles'],
    ['puzzle.category', 'Categoría:', 'Category:'],
    ['puzzle.all', '— Todas —', '— All —'],
    ['puzzle.mate1', '♔ Mate en 1', '♔ Mate in 1'],
    ['puzzle.mate2', '♔ Mate en 2', '♔ Mate in 2'],
    ['puzzle.mate3', '♔ Mate en 3', '♔ Mate in 3'],
    ['puzzle.mate4', '♔ Mate en 4', '♔ Mate in 4'],
    ['puzzle.mate5', '♔ Mate en 5', '♔ Mate in 5'],
    ['puzzle.fork', '⚔️ Horquilla / Doble ataque', '⚔️ Fork / Double attack'],
    ['puzzle.pin', '📌 Clavada', '📌 Pin'],
    ['puzzle.sacrifice', '💎 Sacrificio', '💎 Sacrifice'],
    ['puzzle.attack', '⚡ Ataque', '⚡ Attack'],
    ['puzzle.defense', '🛡️ Defensa', '🛡️ Defence'],
    ['puzzle.endgame', '♟ Finales', '♟ Endgames'],
    ['puzzle.center', '🎯 Control central', '🎯 Central control'],
    ['puzzle.capture', '🔄 Captura táctica', '🔄 Tactical capture'],
    ['puzzle.development', '📐 Desarrollo', '📐 Development'],
    ['puzzle.tactic', '🧠 Táctica general', '🧠 General tactics'],
    ['puzzle.other', '🎲 Otros', '🎲 Other'],
    ['puzzle.hint', '💡 Pista', '💡 Hint'],
    ['puzzle.solution', '👁 Ver solución', '👁 Show solution'],
    ['puzzle.prev', 'Problema anterior', 'Previous puzzle'],
    ['puzzle.next', 'Siguiente problema', 'Next puzzle'],
    ['puzzle.close', 'Cerrar problemas', 'Close puzzles'],
    ['famous.selected', '⭐ Partidas Seleccionadas', '⭐ Selected Games'],
    ['famous.choose', '— Elegir partida —', '— Choose a game —'],
    ['famous.immortalGroup', '♔ Partidas Inmortales y Clásicas', '♔ Immortal and Classic Games'],
    ['famous.worldChamps', '⚔️ Campeonatos del Mundo', '⚔️ World Championships'],
    ['famous.candidates', '🏆 FIDE Candidates 2026 Cyprus', '🏆 FIDE Candidates 2026 Cyprus'],
    ['famous.otherMasters', '🌟 Otros Maestros', '🌟 Other Masters'],
    ['famous.library', '📚 Biblioteca de jugadores', '📚 Player library'],
    ['famous.selectPlayer', 'Selecciona un jugador:', 'Select a player:'],
    ['famous.allPlayers', '— Todos los jugadores —', '— All players —'],
    ['famous.selectGame', 'Selecciona una partida:', 'Select a game:'],
    ['famous.loadingLibrary', 'Cargando biblioteca…', 'Loading library…'],
    ['learn.hint', '💡 Pista', '💡 Hint'],
    ['learn.exit', '✕ Salir', '✕ Exit'],
    ['clock.white', 'Blancas', 'White'],
    ['clock.black', 'Negras', 'Black'],
    ['chat.placeholder', 'Escribe un mensaje…', 'Type a message…'],
    ['chat.aria', 'Mensaje para el oponente', 'Message to opponent'],
    ['chat.send', 'Enviar', 'Send'],
    ['config.language', 'Idioma:', 'Language:'],
    ['config.playAs', 'Juegas con:', 'You play as:'],
    ['config.playVs', 'Juegas Contra:', 'You play against:'],
    ['config.difficulty', 'Nivel de Dificultad:', 'Difficulty level:'],
    ['config.time', 'Control de Tiempo:', 'Time control:'],
    ['config.theme', 'Tema del Tablero:', 'Board theme:'],
    ['config.pieces', 'Estilo de Piezas:', 'Piece style:'],
    ['config.coords', ' Coordenadas en Casillas', ' Square coordinates'],
    ['config.board3d', ' Tablero 3D', ' 3D board'],
    ['config.moveArrow', ' Flecha movimiento', ' Move arrow'],
    ['config.helpMsgs', ' Mensajes de Ayuda', ' Help messages'],
    ['config.sounds', ' Sonidos', ' Sounds'],
    ['config.zoom', '🔍 Zoom — ', '🔍 Zoom — '],
    ['config.videoHelp', '❓ Ayuda en Vídeo', '❓ Video Help'],
    ['login.start', 'Iniciar Sesión', 'Sign In'],
    ['login.startTitle', 'Iniciar sesión online', 'Sign in online'],
    ['color.white', 'Blancas', 'White'],
    ['color.black', 'Negras', 'Black'],
    ['color.random', 'Aleatorio', 'Random'],
    ['color.playWhite', 'Jugar con blancas', 'Play as White'],
    ['color.playBlack', 'Jugar con negras', 'Play as Black'],
    ['color.playRandom', 'Color aleatorio', 'Random colour'],
    ['opp.ai', 'IA', 'AI'],
    ['opp.online', 'On-line', 'Online'],
    ['opp.mail', 'Por Correo', 'By Email'],
    ['opp.pvp', 'Persona vs Persona', 'Person vs Person'],
    ['opp.aiTitle', 'Inteligencia Artificial', 'Artificial Intelligence'],
    ['opp.onlineTitle', 'Jugar online', 'Play online'],
    ['opp.mailTitle', 'Por correo', 'By email'],
    ['opp.pvpTitle', 'Persona vs persona', 'Person vs person'],
    ['level.1', 'Muy Fácil (~400 ELO)', 'Very Easy (~400 ELO)'],
    ['level.2', 'Fácil (~600 ELO)', 'Easy (~600 ELO)'],
    ['level.3', 'Principiante (~800 ELO)', 'Beginner (~800 ELO)'],
    ['level.4', 'Aficionado (~1000 ELO)', 'Club player (~1000 ELO)'],
    ['level.5', 'Intermedio (~1200 ELO)', 'Intermediate (~1200 ELO)'],
    ['level.6', 'Avanzado (~1500 ELO)', 'Advanced (~1500 ELO)'],
    ['level.7', 'Experto (~1800 ELO)', 'Expert (~1800 ELO)'],
    ['level.8', 'Maestro (~2200 ELO)', 'Master (~2200 ELO)'],
    ['time.bullet', '⚡ Bullet', '⚡ Bullet'],
    ['time.blitz', '⚔️ Blitz', '⚔️ Blitz'],
    ['time.rapid', '🎯 Rápidas', '🎯 Rapid'],
    ['time.classic', '♔ Clásicas', '♔ Classical'],
    ['time.1min', '1 min', '1 min'],
    ['time.1plus1', '1 min + 1 seg', '1 min + 1 sec'],
    ['time.2plus1', '2 min + 1 seg', '2 min + 1 sec'],
    ['time.3min', '3 min', '3 min'],
    ['time.3plus2', '3 min + 2 seg', '3 min + 2 sec'],
    ['time.5min', '5 min', '5 min'],
    ['time.5plus3', '5 min + 3 seg', '5 min + 3 sec'],
    ['time.10min', '10 min', '10 min'],
    ['time.10plus5', '10 min + 5 seg', '10 min + 5 sec'],
    ['time.15plus10', '15 min + 10 seg', '15 min + 10 sec'],
    ['time.30min', '30 min', '30 min'],
    ['time.60min', '60 min', '60 min'],
    ['time.90plus30', '90 min + 30 seg', '90 min + 30 sec'],
    ['theme.classic', 'Clásico', 'Classic'],
    ['theme.wood', 'Madera', 'Wood'],
    ['theme.blue', 'Azul', 'Blue'],
    ['theme.green', 'Verde', 'Green'],
    ['theme.gray', 'Gris', 'Grey'],
    ['pieces.letter', 'Letras', 'Letters'],
    ['action.resign', 'Abandonar', 'Resign'],
    ['action.draw', 'Pedir Tablas', 'Offer Draw'],
    ['action.continue', 'Continuar Partida', 'Continue Game'],
    ['action.undo', 'Deshacer Movimiento', 'Undo Move'],
    ['action.hint', 'Sugerencia de IA', 'AI Hint'],
    ['action.analyze', 'Analizar Partida', 'Analyse Game'],
    ['action.copyPgn', 'Copiar PGN', 'Copy PGN'],
    ['action.exportPgn', 'Exportar PGN', 'Export PGN'],
    ['action.importPgn', 'Importar PGN', 'Import PGN'],
    ['action.share', '🔗 Compartir partida (+10 ELO)', '🔗 Share game (+10 ELO)'],
    ['action.shareShort', 'Compartir', 'Share'],
    ['action.viewAnalysis', '📊 Ver análisis post-partida', '📊 View post-game analysis'],
    ['action.resignBtn', '🏳️ Abandonar', '🏳️ Resign'],
    ['action.drawBtn', '🤝 Pedir Tablas', '🤝 Offer Draw'],
    ['action.continueBtn', '▶ Continuar Partida', '▶ Continue Game'],
    ['action.undoBtn', '↺ Deshacer Movimiento', '↺ Undo Move'],
    ['action.hintBtn', '💡 Sugerencia de IA', '💡 AI Hint'],
    ['action.analyzeBtn', '📊 Analizar Partida', '📊 Analyse Game'],
    ['action.copyBtn', '📋 Copiar PGN', '📋 Copy PGN'],
    ['action.exportBtn', '📄 Exportar PGN', '📄 Export PGN'],
    ['action.importBtn', '📥 Importar PGN', '📥 Import PGN'],
    ['stats.wins', 'Ganadas', 'Wins'],
    ['stats.draws', 'Tablas', 'Draws'],
    ['stats.losses', 'Perdidas', 'Losses'],
    ['stats.eloTitle', 'Tu ELO', 'Your ELO'],
    ['feedback.link', 'Informar de errores/mejoras', 'Report bugs / suggestions'],
    ['feedback.title', '📧 Informar de errores/mejoras', '📧 Report bugs / suggestions'],
    ['feedback.prompt', '¿Has encontrado algún fallo o tienes una idea para mejorar AjedrezIA? Tu opinión nos ayuda mucho.', 'Found a bug or have an idea to improve AjedrezIA? Your feedback helps a lot.'],
    ['feedback.form', 'Cuéntanos qué falla o qué se podría mejorar. Se enviará por correo al equipo de AjedrezIA.', 'Tell us what is wrong or what could be improved. It will be emailed to the AjedrezIA team.'],
    ['help.menu', 'Ayuda en vídeo', 'Video help'],
    ['help.intro', 'Elige un tema para ver el tutorial en YouTube.', 'Choose a topic to watch the YouTube tutorial.'],
    ['help.fullTutorial', '📚 Tutorial Completo', '📚 Full Tutorial'],
    ['help.analysis', '📊 Análisis', '📊 Analysis'],
    ['help.share', '📤 Compartir', '📤 Share'],
    ['help.titleIntro', 'Ayuda · Introducción', 'Help · Introduction'],
    ['help.enableSound', 'Activar sonido', 'Enable sound'],
    ['help.openYoutube', 'Abrir en YouTube', 'Open on YouTube'],
    ['help.dontShow', ' No volver a mostrar', ' Don’t show again'],
    ['close', 'Cerrar', 'Close'],
    ['cancel', 'Cancelar', 'Cancel'],
    ['confirm', 'Confirmar', 'Confirm'],
    ['accept', 'Aceptar', 'Accept'],
    ['ok', 'OK', 'OK'],
    ['continue', 'Continuar', 'Continue'],
    ['login.subtitle', 'Para usar AjedrezIA debes iniciar sesión con tu usuario, Google o acceder como invitado.', 'To use AjedrezIA you must sign in with your username, Google, or continue as a guest.'],
    ['login.connecting', 'Conectando…', 'Connecting…'],
    ['login.user', 'Usuario:', 'Username:'],
    ['login.password', 'Contraseña:', 'Password:'],
    ['login.nickPlaceholder', 'Tu nickname', 'Your nickname'],
    ['login.pwdPlaceholder', 'Tu contraseña', 'Your password'],
    ['login.showPwd', 'Ver contraseña', 'Show password'],
    ['login.or', 'o', 'or'],
    ['login.google', 'Continuar con Google', 'Continue with Google'],
    ['login.guestProvider', '👤 Acceso como Invitado', '👤 Guest access'],
    ['login.legalBefore', 'Al continuar aceptas los ', 'By continuing you accept the '],
    ['login.legalAnd', ' y la ', ' and the '],
    ['login.legal', 'Al continuar aceptas los Términos de servicio y la Política de privacidad.', 'By continuing you accept the Terms of Service and the Privacy Policy.'],
    ['login.terms', 'Términos de servicio', 'Terms of Service'],
    ['login.privacy', 'Política de privacidad', 'Privacy Policy'],
    ['login.inviteOnline', '⚔️ Invitar a partida online', '⚔️ Invite to an online game'],
    ['login.findPlayer', '🌐 Buscar jugador online', '🌐 Find an online player'],
    ['login.signOut', 'Cerrar sesión', 'Sign out'],
    ['users.title', '🌐 Jugadores Registrados', '🌐 Registered Players'],
    ['users.searching', 'Buscando jugadores…', 'Looking for players…'],
    ['users.refresh', '🔄 Actualizar', '🔄 Refresh'],
    ['users.empty', 'No hay jugadores online ahora mismo.', 'There are no players online right now.'],
    ['users.registered', '{n} jugadores registrados', '{n} registered players'],
    ['users.online', '{n} online', '{n} online'],
    ['users.available', '{n} disponible', '{n} available'],
    ['users.availablePlural', '{n} disponibles', '{n} available'],
    ['users.sample', ' (datos de ejemplo)', ' (sample data)'],
    ['invite.title', '⚔️ Invitar a jugar', '⚔️ Invite to play'],
    ['invite.playAs', 'Juego con:', 'I play as:'],
    ['invite.clock', 'Reloj / Tiempo:', 'Clock / Time:'],
    ['invite.waiting', 'Esperando respuesta…', 'Waiting for a reply…'],
    ['invite.challenge', 'Te reto a una partida on-line', 'I challenge you to an online game'],
    ['invite.accept', '✅ Aceptar', '✅ Accept'],
    ['invite.send', '📨 Enviar invitación', '📨 Send invitation'],
    ['feedback.report', '📨 Informar', '📨 Report'],
    ['feedback.notNow', 'Ahora no', 'Not now'],
    ['feedback.error', 'Error:', 'Bug:'],
    ['feedback.improve', 'Mejora:', 'Suggestion:'],
    ['feedback.errorPh', 'Describe aquí el error encontrado (opcional)', 'Describe the bug you found (optional)'],
    ['feedback.improvePh', 'Describe aquí tu sugerencia de mejora (opcional)', 'Describe your suggestion (optional)'],
    ['feedback.send', 'Enviar', 'Send'],
    ['draw.acceptBtn', 'Aceptar tablas', 'Accept draw'],
    ['draw.rejectBtn', 'Rechazar', 'Decline'],
    ['resign.confirmBtn', 'Abandonar', 'Resign'],
    ['draw.title', 'Tu rival ofrece tablas', 'Your opponent offers a draw'],
    ['draw.subtitle', '¿Aceptas las tablas?', 'Do you accept the draw?'],
    ['resign.title', '¿Abandonar la partida?', 'Resign the game?'],
    ['resign.subtitle', 'Se registrará como derrota y el rival ganará la partida.', 'It will count as a loss and your opponent will win the game.'],
    ['analysis.title', '📊 Análisis post-partida', '📊 Post-game analysis'],
    ['analysis.loading', 'Movimientos analizados: {done} / {total}', 'Moves analysed: {done} / {total}'],
    ['analysis.loadingDefault', 'Movimientos analizados: 0 / 0', 'Moves analysed: 0 / 0'],
    ['analysis.summaryNav', 'Ver resumen del análisis', 'View analysis summary'],
    ['analysis.prevError', 'Error anterior', 'Previous error'],
    ['analysis.nextError', 'Siguiente error', 'Next error'],
    ['analysis.close', 'Cerrar análisis', 'Close analysis'],
    ['analysis.exists', 'Ya hay un análisis de esta partida.', 'This game already has an analysis.'],
    ['analysis.whatToDo', '¿Qué quieres hacer?', 'What do you want to do?'],
    ['analysis.viewExisting', 'Ver análisis existente', 'View existing analysis'],
    ['analysis.new', 'Nuevo análisis', 'New analysis'],
    ['promo.title', 'Promocionar peón a:', 'Promote pawn to:'],
    ['thinking', 'La IA está calculando...', 'The AI is thinking...'],
    ['nav.first', 'Ir al inicio', 'Go to start'],
    ['nav.prev', 'Movimiento anterior', 'Previous move'],
    ['nav.next', 'Siguiente movimiento', 'Next move'],
    ['nav.last', 'Ir al final', 'Go to end'],
    ['flipBoard', 'Girar tablero', 'Flip board'],
    ['captured.white', 'Blancas: ', 'White: '],
    ['captured.black', 'Negras: ', 'Black: '],
    ['rotateDevice', 'Gira el dispositivo a vertical para jugar', 'Rotate the device to portrait to play'],
    ['continue.title', 'Continuar Partida', 'Continue Game'],
    ['continue.text', 'Configura la IA y el tiempo para continuar desde esta posición:', 'Set the AI and time to continue from this position:'],
    ['continue.level', 'Nivel de dificultad:', 'Difficulty level:'],
    ['continue.time', 'Tiempo partida:', 'Game time:'],
    ['continue.btn', '▶ Continuar', '▶ Continue'],
    ['turn.white', 'Blancas', 'White'],
    ['turn.black', 'Negras', 'Black'],
    ['turn.label', 'Turno: {side}', 'Turn: {side}'],
    ['nav.hint', 'Pulsa ◀ ▶ para navegar', 'Press ◀ ▶ to browse'],
    ['pressContinue', 'Pulsa Continuar Partida', 'Press Continue Game'],
    ['welcome', '¡Bienvenido, {name}! 🎉', 'Welcome, {name}! 🎉'],
    ['guestAccess', 'Acceso como {name} 🎉', 'Signed in as {name} 🎉'],
    ['signedOut', 'Sesión cerrada correctamente.', 'Signed out successfully.'],
    ['noGame', 'No hay partida en curso', 'There is no game in progress'],
    ['gameNotStarted', 'La partida aún no ha empezado', 'The game has not started yet'],
    ['noPosition', 'No hay una posición para continuar', 'There is no position to continue from'],
    ['onlineCantChange', 'No puedes cambiar de posición durante una partida online', 'You cannot change position during an online game'],
    ['aiTurn', 'Turno de la IA…', 'AI to move…'],
    ['continueSides', 'Continúa la partida: mueven {side}', 'Game continues: {side} to move'],
    ['side.white', 'blancas', 'White'],
    ['side.black', 'negras', 'Black'],
    ['checkmate', '¡Jaque Mate! Ganan las {winner}', 'Checkmate! {winner} wins'],
    ['stalemate', 'Tablas por ahogado', 'Draw by stalemate'],
    ['whiteResigns', 'Negras abandonan — Ganan Blancas', 'Black resigns — White wins'],
    ['blackResigns', 'Blancas abandonan — Ganan Negras', 'White resigns — Black wins'],
    ['drawAgreed', 'Tablas por acuerdo', 'Draw by agreement'],
    ['gameOver', 'Partida finalizada', 'Game over'],
    ['positionFinished', 'Esta posición ya está finalizada', 'This position is already finished'],
    ['exitApp', '¿Quieres salir de AjedrezIA?', 'Do you want to leave AjedrezIA?'],
    ['noPuzzles', 'No hay problemas con estos filtros', 'No puzzles match these filters'],
    ['shareOwnLink', 'Este enlace lo enviaste tú. Compártelo con otro jugador.', 'You sent this link. Share it with another player.'],
    ['mustLogin', 'Debes iniciar sesión para aceptar.', 'You must sign in to accept.'],
    ['inviteRejected', 'Invitación rechazada.', 'Invitation declined.'],
    ['drawRejected', 'Has rechazado las tablas.', 'You declined the draw.'],
    ['drawOfferRejected', 'Has rechazado la oferta de tablas.', 'You declined the draw offer.'],
    ['copyLink', 'Copiar enlace', 'Copy link'],
    ['copied', '✔ Copiado', '✔ Copied'],
    ['sending', 'Enviando…', 'Sending…'],
    ['thanksFeedback', '¡Gracias! Tu mensaje se ha enviado correctamente.', 'Thanks! Your message was sent successfully.'],
    ['feedbackEmpty', 'Escribe al menos un error o una mejora antes de enviar.', 'Write at least one bug or suggestion before sending.'],
    ['feedbackFail', 'No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.', 'The message could not be sent. Please try again later.'],
    ['feedbackNet', 'Error de conexión al enviar el mensaje.', 'Network error while sending the message.'],
    ['status.available', 'disponible', 'available'],
    ['status.busy', 'ocupado', 'busy'],
    ['status.offline', 'offline', 'offline'],
    ['user.offline', 'Offline', 'Offline'],
    ['user.busy', 'Ocupado', 'Busy'],
    ['user.onlineStatus', 'Online', 'Online'],
    ['user.busyYou', 'Ocupado (tú)', 'Busy (you)'],
    ['user.onlineYou', 'Online (tú)', 'Online (you)'],
    ['newVersion', '🆕 Nueva Versión {v}', '🆕 New Version {v}'],
    ['opening.seeVariants', 'Ver {n} variantes', 'See {n} variations'],
    ['help.video.soon', 'Vídeo disponible próximamente', 'Video coming soon'],
    ['help.video.intro', '🎬 Introducción a AjedrezIA', '🎬 Introduction to AjedrezIA'],
    ['changelog.3.5.71', 'Al abrir AjedrezIA, el idioma sigue el del navegador (español o inglés) y se recuerda entre sesiones', 'On launch, AjedrezIA follows the browser language (Spanish or English) and remembers it between sessions'],
    ['changelog.3.5.70', 'Todo el contenido dinámico (mensajes, lecciones, aperturas, problemas y compartir) usa el sistema bilingüe ES/EN', 'All dynamic content (messages, lessons, openings, puzzles and sharing) uses the ES/EN bilingual system'],
    ['start', 'Comenzar', 'Start'],
    ['save', '💾 Guardar', '💾 Save'],
    ['nameLabel', 'Nombre:', 'Name:'],
    ['fileName', 'Nombre del archivo:', 'File name:'],
    ['newGameTitle', 'Nueva Partida', 'New Game'],
    ['saveGame', 'Guardar Partida', 'Save Game'],
    ['savedGames', 'Partidas Guardadas', 'Saved Games'],
    ['gameN', 'Partida {n}', 'Game {n}'],
    ['movesCount', '{n} mov.', '{n} moves'],
    ['deleteGame', 'Eliminar partida', 'Delete game'],
    ['pgnFile', 'Archivo PGN', 'PGN file'],
    ['copiedExcl', '¡Copiado!', 'Copied!'],
    ['copiedCheck', '✓ Copiado', '✓ Copied'],
    ['copyClipboard', '📋 Copiar', '📋 Copy'],
    ['share.email', 'Correo', 'Email'],
    ['share.look', '¡Echa un vistazo en AjedrezIA!', 'Check it out on AjedrezIA!'],
    ['share.kind.problema', 'Problema de ajedrez y 30 más', 'Chess puzzle and 30 more'],
    ['share.kind.partida', 'Partida', 'Game'],
    ['share.kind.apertura', 'Apertura', 'Opening'],
    ['share.kind.maestra', 'Partida maestra', 'Master game'],
    ['share.kind.home', 'AjedrezIA', 'AjedrezIA'],
    ['share.openingNamed', 'Apertura: {name}', 'Opening: {name}'],
    ['share.btn.partida', '🔗 Compartir partida', '🔗 Share game'],
    ['share.btn.apertura', '🔗 Compartir apertura', '🔗 Share opening'],
    ['share.btn.problemas', '🔗 Compartir problemas', '🔗 Share puzzles'],
    ['share.btn.maestra', '🔗 Compartir partida maestra', '🔗 Share master game'],
    ['share.btn.generico', '🔗 Compartir', '🔗 Share'],
    ['share.inviteMsg', '¡Te reto a una partida en AjedrezIA!\nPartida online', 'I challenge you to a game on AjedrezIA!\nOnline game'],
    ['share.inviteTitle', 'Invitar online (+10 ELO)', 'Invite online (+10 ELO)'],
    ['share.eloSuffix', ' (+{n} ELO)', ' (+{n} ELO)'],
    ['analysis.complete', 'Análisis completo ({done}/{total} movimientos)', 'Full analysis ({done}/{total} moves)'],
    ['analysis.partial', 'Análisis parcial ({done}/{total} movimientos)', 'Partial analysis ({done}/{total} moves)'],
    ['analysis.startTitle', 'Iniciar Análisis de Partida', 'Start game analysis'],
    ['analysis.startBody', 'Se analizarán {n} movimientos online.<br>Esto puede tardar unos segundos.', '{n} moves will be analysed online.<br>This may take a few seconds.'],
    ['analysis.blunder', 'Error grave', 'Blunder'],
    ['analysis.inaccuracy', 'Imprecisión', 'Inaccuracy'],
    ['analysis.better', 'Mejor: {san}', 'Best: {san}'],
    ['puzzle.nav', '{theme} ({n} de {total})', '{theme} ({n} of {total})'],
    ['puzzle.generic', 'Problema', 'Puzzle'],
    ['puzzle.loadingAll', 'Cargando Todos los Problemas…', 'Loading all puzzles…'],
    ['puzzle.loadingTheme', 'Cargando Problemas de {theme}…', 'Loading {theme} puzzles…'],
    ['puzzle.diff.1', '⭐ Fácil', '⭐ Easy'],
    ['puzzle.diff.2', '⭐⭐ Media', '⭐⭐ Medium'],
    ['puzzle.diff.3', '⭐⭐⭐ Difícil', '⭐⭐⭐ Hard'],
    ['puzzle.diff.4', '⭐⭐⭐⭐ Experto', '⭐⭐⭐⭐ Expert'],
    ['puzzle.correctContinue', '¡Correcto! Continúa...', 'Correct! Continue...'],
    ['puzzle.errorBanner', '¡Error en Problema! ({elo})', 'Puzzle error! ({elo})'],
    ['puzzle.wrongHint', 'Incorrecto. Las casillas marcadas muestran el movimiento correcto. Inténtalo de nuevo.', 'Incorrect. The marked squares show the right move. Try again.'],
    ['puzzle.yourTurn', 'Tu turno. Encuentra el mejor movimiento.', 'Your turn. Find the best move.'],
    ['puzzle.streak', ' | Racha: {n}', ' | Streak: {n}'],
    ['puzzle.hadErrors', ' — hubo fallos ({elo})', ' — there were mistakes ({elo})'],
    ['puzzle.solvedSidebar', '🎉 ¡Problema resuelto!{elo} Aciertos: {ok} | Fallos: {fail} | Precisión: {pct}%{streak}', '🎉 Puzzle solved!{elo} Hits: {ok} | Misses: {fail} | Accuracy: {pct}%{streak}'],
    ['puzzle.solvedBanner', '🎉 ¡Problema Resuelto!', '🎉 Puzzle solved!'],
    ['puzzle.unsolved', '❌ No resuelto — La solución era: {sol}', '❌ Unsolved — The solution was: {sol}'],
    ['puzzle.hintArrow', '💡 Mueve la pieza señalada con la flecha azul', '💡 Move the piece marked with the blue arrow'],
    ['puzzle.seeSolution', '💡 Ver solución ({elo})', '💡 Show solution ({elo})'],
    ['puzzle.playingSolution', '💡 Reproduciendo la solución…', '💡 Playing the solution…'],
    ['puzzle.solutionNow', '💡 Solución: {sol} — Inténtalo ahora', '💡 Solution: {sol} — Try it now'],
    ['puzzle.solutionOnly', '💡 Solución: {sol}', '💡 Solution: {sol}'],
    ['learn.exercise', 'Ejercicio', 'Exercise'],
    ['learn.cat.piezas', '♟ Piezas', '♟ Pieces'],
    ['learn.cat.basico', '⚡ Básico', '⚡ Basics'],
    ['learn.cat.intermedio', '🎓 Intermedio', '🎓 Intermediate'],
    ['learn.cat.avanzado', '🏆 Avanzado', '🏆 Advanced'],
    ['learn.cat.jaque', '⚠️ Jaque', '⚠️ Check'],
    ['learn.cat.mate', '♔ Mate', '♔ Mate'],
    ['learn.cat.tacticas', '⚔️ Tácticas', '⚔️ Tactics'],
    ['learn.cat.ejercicios', '⭐ Ejercicios de Estrellas', '⭐ Star exercises'],
    ['learn.banner.piezas', 'Ejercicio de Piezas', 'Piece exercise'],
    ['learn.banner.basico', 'Ejercicio Básico', 'Basic exercise'],
    ['learn.banner.intermedio', 'Ejercicio Intermedio', 'Intermediate exercise'],
    ['learn.banner.avanzado', 'Ejercicio Avanzado', 'Advanced exercise'],
    ['learn.exerciseN', 'Ejercicio {n}', 'Exercise {n}'],
    ['learn.star', 'estrella', 'star'],
    ['learn.stars', 'estrellas', 'stars'],
    ['learn.wrongMove', 'Movimiento incorrecto. ¡Inténtalo de nuevo!', 'Wrong move. Try again!'],
    ['learn.completedBanner', '¡Lección Completada! 🎉', 'Lesson complete! 🎉'],
    ['opening.view', '👁 Ver Apertura', '👁 View opening'],
    ['lib.unavailable', 'Biblioteca no disponible', 'Library unavailable'],
    ['lib.loadingGames', '⏳ Cargando partidas de {name}…', '⏳ Loading games by {name}…'],
    ['quiz.intro', '<strong>Quiz: {name}</strong><br>Juega todos los movimientos correctos (blancas y negras)<br><br><strong>Movimientos:</strong> {san}', '<strong>Quiz: {name}</strong><br>Play every correct move (White and Black)<br><br><strong>Moves:</strong> {san}'],
    ['quiz.done', '<strong>Quiz completado: {name}</strong><br>Aciertos: {ok} | Fallos: {fail} | Precisión: {pct}%<br>ELO quiz: {elo}', '<strong>Quiz complete: {name}</strong><br>Hits: {ok} | Misses: {fail} | Accuracy: {pct}%<br>Quiz ELO: {elo}'],
    ['insight.example', '💡 Ejemplo: ¡buena jugada! Controlas el centro del tablero.', '💡 Example: nice move! You control the centre of the board.'],
    ['msg.invalidLinkMoves', 'El enlace de la partida no contiene movimientos válidos', 'The game link does not contain valid moves'],
    ['msg.illegalLinkMove', 'No se pudo reproducir toda la partida del enlace. Movimiento ilegal: {uci}', 'Could not replay the whole linked game. Illegal move: {uci}'],
    ['msg.unknownMaster', 'Enlace: partida maestra desconocida. Clave: {key}', 'Link: unknown master game. Key: {key}'],
    ['msg.unknownOpening', 'Enlace: apertura desconocida. Clave: {key}', 'Link: unknown opening. Key: {key}'],
    ['msg.unknownPuzzle', 'Enlace: problema de ajedrez desconocido. Id: {id}', 'Link: unknown chess puzzle. Id: {id}'],
    ['msg.invalidPuzzleLink', 'Enlace de problema inválido o corrupto.', 'Invalid or corrupt puzzle link.'],
    ['msg.noGameAnalyze', 'No hay partida para analizar', 'There is no game to analyse'],
    ['msg.noMovesAnalyze', 'No hay movimientos para analizar', 'There are no moves to analyse'],
    ['msg.inviteStatus', 'La invitación fue {status}.', 'The invitation was {status}.'],
    ['status.rejected', 'rechazada', 'declined'],
    ['status.cancelled', 'cancelada', 'cancelled'],
    ['msg.inviteSendFail', '⚠️ No se pudo enviar la invitación al invitador.', '⚠️ Could not send the invitation to the challenger.'],
    ['msg.inviteAcceptFail', '⚠️ No se pudo aceptar la invitación.', '⚠️ Could not accept the invitation.'],
    ['msg.moveSyncFail', '⚠️ No se pudo sincronizar el movimiento.', '⚠️ Could not sync the move.'],
    ['msg.moveNetFail', '⚠️ Error de conexión al enviar movimiento.', '⚠️ Network error while sending the move.'],
    ['msg.drawReplyFail', 'Error al responder la oferta de tablas.', 'Error responding to the draw offer.'],
    ['msg.chatFail', '⚠️ No se pudo enviar el mensaje: {err}', '⚠️ Could not send the message: {err}'],
    ['msg.chatNet', '⚠️ Error de red al enviar el mensaje.', '⚠️ Network error while sending the message.'],
    ['msg.tooSoonDraw', 'Es muy pronto para pedir tablas', 'It is too soon to offer a draw'],
    ['msg.drawSim', 'Oferta de tablas enviada (simulación)', 'Draw offer sent (simulation)'],
    ['msg.drawSent', '🤝 Oferta de tablas enviada al oponente…', '🤝 Draw offer sent to opponent…'],
    ['msg.drawSendFail', 'No se pudo enviar la oferta de tablas.', 'Could not send the draw offer.'],
    ['msg.drawNet', 'Error de conexión al ofrecer tablas.', 'Network error while offering a draw.'],
    ['msg.closeAnalysis', 'Cierra Modo Análisis para continuar', 'Close Analysis Mode to continue'],
    ['msg.noVariants', 'No se encontraron variantes conocidas', 'No known variations found'],
    ['msg.undoOnline', 'No puedes deshacer movimientos en partida online', 'You cannot undo moves in an online game'],
    ['msg.noUndo', 'No hay movimientos para deshacer', 'There are no moves to undo'],
    ['msg.gameEnded', 'El juego ha terminado', 'The game is over'],
    ['msg.hintFail', 'Error al obtener sugerencia: {err}', 'Error getting hint: {err}'],
    ['msg.gameSaved', 'Partida guardada correctamente', 'Game saved successfully'],
    ['msg.noSaved', 'No hay partidas guardadas', 'There are no saved games'],
    ['msg.noSavedLeft', 'No quedan partidas guardadas', 'No saved games left'],
    ['msg.noExport', 'No hay movimientos para exportar', 'There are no moves to export'],
    ['msg.pgnAnalysisAdded', '📊 Se añade Análisis de Partida al PGN', '📊 Game analysis is added to the PGN'],
    ['msg.noCopy', 'No hay movimientos para copiar', 'There are no moves to copy'],
    ['msg.videoDlCopy', '🎬 Vídeo descargado y texto copiado para la publicación', '🎬 Video downloaded and text copied for posting'],
    ['msg.videoFb', '🎬 Vídeo descargado — súbelo al abrir Facebook', '🎬 Video downloaded — upload it when Facebook opens'],
    ['msg.videoIg', '🎬 Vídeo descargado — súbelo al abrir Instagram', '🎬 Video downloaded — upload it when Instagram opens'],
    ['msg.imgIg', '📸 Imagen copiada — ábrela en Instagram y pégala en tu historia o post', '📸 Image copied — open Instagram and paste it in your story or post'],
    ['msg.tiktokOk', 'TikTok abierto · texto copiado y archivo descargado para tu nuevo post', 'TikTok opened · text copied and file downloaded for your new post'],
    ['msg.tiktokNo', 'TikTok no está disponible en el menú de compartir de este dispositivo', 'TikTok is not available in this device’s share menu'],
    ['msg.noShareMoves', 'No hay movimientos para compartir', 'There are no moves to share'],
    ['msg.noPgnMoves', 'No se encontraron movimientos en el PGN', 'No moves were found in the PGN'],
    ['msg.pgnImportFail', 'Error al importar el archivo PGN', 'Error importing the PGN file'],
    ['msg.onlineCantContinue', 'No puedes continuar otra partida durante una partida online', 'You cannot continue another game during an online game'],
    ['msg.noContinue', 'No hay partida en curso para continuar', 'There is no game in progress to continue'],
    ['msg.continued', 'Partida continuada correctamente', 'Game continued successfully'],
    ['msg.continueFail', 'Error al continuar la partida', 'Error continuing the game'],
    ['msg.aiParse', 'Error al parsear el movimiento de la IA', 'Error parsing the AI move'],
    ['msg.aiInvalid', 'La IA no pudo generar un movimiento válido', 'The AI could not generate a valid move'],
    ['msg.aiFail', 'Error al obtener movimiento de la IA: {err}', 'Error getting the AI move: {err}'],
    ['banner.checkmate', '♚ ¡JAQUE MATE! — Ganan {winner}', '♚ CHECKMATE! — {winner} wins'],
    ['banner.stalemate', '½ TABLAS — Ahogado', '½ DRAW — Stalemate'],
    ['banner.threefold', '½ TABLAS — Triple repetición', '½ DRAW — Threefold repetition'],
    ['banner.check', '♔ ¡JAQUE!', '♔ CHECK!'],
    ['banner.drawAgreed', '½ TABLAS — Acordadas', '½ DRAW — Agreed'],
    ['banner.drawAccepted', '½ TABLAS — Aceptadas', '½ DRAW — Accepted'],
    ['banner.resigned', '🏳️ HAS ABANDONADO', '🏳️ YOU RESIGNED'],
    ['banner.timeoutBlack', '⏱️ TIEMPO AGOTADO — Ganan Negras', '⏱️ TIME OUT — Black wins'],
    ['banner.timeoutWhite', '⏱️ TIEMPO AGOTADO — Ganan Blancas', '⏱️ TIME OUT — White wins'],
    ['online.finished', 'Partida online finalizada', 'Online game finished'],
    ['online.whiteWins', '♔ Ganan blancas', '♔ White wins'],
    ['online.blackWins', '♚ Ganan negras', '♚ Black wins'],
    ['online.draw', '½–½ Tablas', '½–½ Draw'],
    ['online.playAs', 'Juegas con {color}', 'You play as {color}'],
    ['online.aborted', '⚠️ Partida abortada', '⚠️ Game aborted'],
    ['online.yourTurn', 'Tu turno', 'Your turn'],
    ['online.wait', 'Espera al rival…', 'Waiting for opponent…'],
    ['online.leaveTitle', 'Abandonar partida', 'Resign game'],
    ['online.confirmLeave', '¿Abandonar la partida online?', 'Resign the online game?'],
    ['invite.pickColorTime', 'Elige color y tiempo para tu invitación', 'Choose colour and time for your invitation'],
    ['invite.colorWhite', 'Blancas ♔', 'White ♔'],
    ['invite.colorBlack', 'Negras ♚', 'Black ♚'],
    ['invite.colorRandom', 'Aleatorio 🎲', 'Random 🎲'],
    ['level.n', 'Nivel {n} (~{elo} ELO)', 'Level {n} (~{elo} ELO)'],
    ['aria.aiLevel', 'Nivel de dificultad de la IA', 'AI difficulty level'],
    ['aria.gameTime', 'Tiempo de la partida', 'Game time'],
    ['browser.copyLink', 'Enlace copiado. Pégalo en Chrome, Firefox o Safari para iniciar sesión.', 'Link copied. Paste it in Chrome, Firefox or Safari to sign in.'],
    ['browser.promptLink', 'Copia este enlace y ábrelo en Chrome, Firefox o Safari:', 'Copy this link and open it in Chrome, Firefox or Safari:'],
    ['chat.notSent', 'No enviado: {err}', 'Not sent: {err}'],
    ['chat.netError', 'Error de red', 'Network error'],
    ['link.type.invite', 'Invitación online', 'Online invitation'],
    ['link.type.game', 'Partida', 'Game'],
    ['link.type.puzzle', 'Problema', 'Puzzle'],
    ['link.type.opening', 'Apertura', 'Opening'],
    ['link.type.master', 'Partida maestra', 'Master game'],
    ['insight.castleShort', 'corto', 'kingside'],
    ['insight.castleLong', 'largo', 'queenside'],
    ['piece.pawn', 'peón', 'pawn'],
    ['piece.knight', 'caballo', 'knight'],
    ['piece.bishop', 'alfil', 'bishop'],
    ['piece.rook', 'torre', 'rook'],
    ['piece.queen', 'dama', 'queen'],
    ['piece.king', 'rey', 'king'],
    ['tc.1+0', 'Bullet 1 min', 'Bullet 1 min'],
    ['tc.1+1', 'Bullet 1+1', 'Bullet 1+1'],
    ['tc.2+1', 'Bullet 2+1', 'Bullet 2+1'],
    ['tc.3+0', 'Blitz 3 min', 'Blitz 3 min'],
    ['tc.3+2', 'Blitz 3+2', 'Blitz 3+2'],
    ['tc.5+0', 'Blitz 5 min', 'Blitz 5 min'],
    ['tc.5+3', 'Blitz 5+3', 'Blitz 5+3'],
    ['tc.10+0', 'Rápida 10 min', 'Rapid 10 min'],
    ['tc.10+5', 'Rápida 10+5', 'Rapid 10+5'],
    ['tc.15+10', 'Rápida 15+10', 'Rapid 15+10'],
    ['tc.30+0', 'Rápida 30 min', 'Rapid 30 min'],
    ['tc.60+0', 'Clásica 60 min', 'Classical 60 min'],
    ['tc.90+30', 'Clásica 90+30', 'Classical 90+30'],
    ['online.started', '🌐 <strong>Partida online iniciada</strong><br>Oponente: {nick}', '🌐 <strong>Online game started</strong><br>Opponent: {nick}'],
    ['vsBot', '🤖 <strong>Partida contra {nick}</strong><br>ELO {elo}', '🤖 <strong>Game vs {nick}</strong><br>ELO {elo}'],
    ['pgn.whiteWins', '1-0 · Ganan blancas', '1-0 · White wins'],
    ['pgn.blackWins', '0-1 · Ganan negras', '0-1 · Black wins'],
    ['pgn.draw', '½-½ · Tablas', '½-½ · Draw'],
    ['pgn.inProgress', 'En curso', 'In progress'],
    ['pgn.whiteWinsParen', '1-0 (Ganan blancas)', '1-0 (White wins)'],
    ['pgn.blackWinsParen', '0-1 (Ganan negras)', '0-1 (Black wins)'],
    ['pgn.drawParen', '½-½ (Tablas)', '½-½ (Draw)'],
    ['pgn.date', 'Fecha: {date}', 'Date: {date}'],
    ['pgn.result', 'Resultado: {result}', 'Result: {result}'],
    ['pgn.tournament', 'Torneo: {event}', 'Event: {event}'],
    ['pgn.round', 'Ronda: {round}', 'Round: {round}'],
    ['playerDefault', 'Jugador', 'Player'],
    ['insight.castle', '🏰 ¡Enroque {side}! Rey a salvo y torre activa', '🏰 {side} castling! King safe and rook active'],
    ['insight.checkCapture', '⚡ ¡Captura con jaque! Ganas tempo y material', '⚡ Capture with check! You gain tempo and material'],
    ['insight.checkKnight', '⚡ ¡Jaque de caballo! Difícil de bloquear', '⚡ Knight check! Hard to block'],
    ['insight.checkPawn', '⚡ ¡Jaque de peón! Amenaza inesperada', '⚡ Pawn check! An unexpected threat'],
    ['insight.checkReact', '⚡ ¡Jaque! Obligas al rival a reaccionar', '⚡ Check! You force the opponent to react'],
    ['insight.checkPressure', '⚡ ¡Jaque! Presión directa sobre el rey', '⚡ Check! Direct pressure on the king'],
    ['insight.takeQueen', '💎 ¡Capturas la dama! Ventaja decisiva', '💎 You take the queen! Decisive advantage'],
    ['insight.winPiece', '💎 ¡Ganas {piece}! Ventaja de material clara', '💎 You win the {piece}! Clear material advantage'],
    ['insight.goodTrade', '💎 Capturas {piece} — ¡buen cambio!', '💎 You capture the {piece} — good trade!'],
    ['insight.recaptureTrade', '🔄 ¡Recuperas pieza! Cambio de {got} por {gave}', '🔄 You recapture! {got} for {gave}'],
    ['insight.trade', '🔄 Cambio de {got} por {gave}', '🔄 Trade of {got} for {gave}'],
    ['insight.recapture', '🔄 ¡Recuperas pieza! Capturas {piece}', '🔄 You recapture! You take the {piece}'],
    ['insight.cleanPawn', '💎 ¡Captura limpia! Ganas un peón', '💎 Clean capture! You win a pawn'],
    ['insight.cleanPiece', '💎 ¡Captura limpia! Te llevas el {piece}', '💎 Clean capture! You take the {piece}'],
    ['insight.cleanWin', '💎 Captura limpia — ganas {piece}', '💎 Clean capture — you win the {piece}'],
    ['insight.capture', '⚔️ Capturas {piece}', '⚔️ You capture the {piece}'],
    ['insight.forkKing', '🐴 ¡Horquilla al rey! El rival perderá material', '🐴 Fork on the king! The opponent will lose material'],
    ['insight.forkTwo', '🐴 ¡Horquilla! Atacas {a} y {b}', '🐴 Fork! You attack the {a} and the {b}'],
    ['insight.pawnFork', '♟ ¡Horquilla de peón! Atacas {a} y {b}', '♟ Pawn fork! You attack the {a} and the {b}'],
    ['insight.pin', '📌 ¡Clavada! El {piece} enemigo no puede moverse', '📌 Pin! The enemy {piece} cannot move'],
    ['insight.skewer', '📌 ¡Enfilada! Amenazas {a} y {b} detrás', '📌 Skewer! You threaten the {a} and the {b} behind'],
    ['insight.battery', '🔋 ¡Batería! {a} y {b} apuntan juntas', '🔋 Battery! {a} and {b} aim together'],
    ['insight.devCenter', '📐 Desarrollas {piece} hacia el centro — ¡buena actividad!', '📐 You develop the {piece} toward the centre — good activity!'],
    ['insight.devPiece', '📐 Desarrollas {piece} — una pieza más lista para jugar', '📐 You develop the {piece} — one more piece ready to play'],
    ['insight.fianchetto', '🏹 ¡Fianchetto! Tu alfil domina la gran diagonal', '🏹 Fianchetto! Your bishop dominates the long diagonal'],
    ['insight.earlyQueen', '⚠️ Dama temprana — puede ser atacada y perder tiempos', '⚠️ Early queen — it can be attacked and lose tempi'],
    ['insight.samePiece', '⚠️ Mueves la misma pieza dos veces — desarrolla las demás', '⚠️ You move the same piece twice — develop the others'],
    ['insight.undeveloped', '⚠️ Aún tienes {n} piezas en casa — ¡necesitan salir!', '⚠️ You still have {n} pieces at home — they need to come out!'],
    ['insight.devComplete', '✅ ¡Desarrollo completo! Piezas activas y rey enrocado', '✅ Development complete! Active pieces and a castled king'],
    ['insight.promo', '👑 ¡Coronación! Tu peón se transforma en pieza mayor', '👑 Promotion! Your pawn becomes a major piece'],
    ['insight.almostPromo', '♟ ¡Peón a punto de coronar! Amenaza imparable', '♟ Pawn about to promote! An unstoppable threat'],
    ['insight.doubleCenter', '🎯 Peón doble al centro — ¡controlas casillas clave!', '🎯 Two pawns in the centre — you control key squares!'],
    ['insight.centerPawn', '🎯 Peón al centro — espacio y control', '🎯 Pawn to the centre — space and control'],
    ['insight.passedAdv', '♟ ¡Peón pasado avanzado! Muy peligroso', '♟ Advanced passed pawn! Very dangerous'],
    ['insight.passed', '♟ Peón pasado — sin peones rivales que lo frenen', '♟ Passed pawn — no enemy pawns to stop it'],
    ['insight.isolated', '⚠️ Peón aislado — no tiene peones aliados que lo protejan', '⚠️ Isolated pawn — no friendly pawns to protect it'],
    ['insight.doubled', '⚠️ Peones doblados en la misma columna — estructura débil', '⚠️ Doubled pawns on the same file — weak structure'],
    ['insight.doubledRooks', '🗼 ¡Torres dobladas! Poder duplicado en la columna', '🗼 Doubled rooks! Doubled power on the file'],
    ['insight.connectedRooks', '🗼 Torres conectadas — se apoyan mutuamente', '🗼 Connected rooks — they support each other'],
    ['insight.rook7', '🗼 ¡Torre en séptima fila! Ataca peones y encierra al rey', '🗼 Rook on the seventh! Attacks pawns and traps the king'],
    ['insight.rookOpen', '🗼 Torre en columna abierta — ¡máxima influencia!', '🗼 Rook on an open file — maximum influence!'],
    ['insight.rookSemi', '🗼 Torre en columna semi-abierta — presión sobre el peón rival', '🗼 Rook on a semi-open file — pressure on the enemy pawn'],
    ['insight.rookPassed', '🗼 Torre apoyando peón pasado — ¡combinación ganadora!', '🗼 Rook supporting a passed pawn — a winning combo!'],
    ['insight.knightCenter', '🐴 Caballo centralizado — controla hasta 8 casillas', '🐴 Centralised knight — controls up to 8 squares'],
    ['insight.outpost', '🐴 ¡Puesto avanzado! Caballo protegido e inamovible', '🐴 Outpost! A protected, immovable knight'],
    ['insight.kingEnd', '👑 Rey activo en el final — ¡pieza decisiva!', '👑 Active king in the endgame — a decisive piece!'],
    ['insight.kingActivate', '👑 Activas el rey — en el final es una pieza fuerte', '👑 You activate the king — in the endgame it is a strong piece'],
    ['insight.kingExposed', '⚠️ Rey expuesto en el medio juego — puede ser peligroso', '⚠️ Exposed king in the middlegame — it can be dangerous'],
    ['insight.hangingFree', '🚨 ¡Tu {piece} puede ser capturada gratis!', '🚨 Your {piece} can be taken for free!'],
    ['insight.hangingDanger', '🚨 ¡{piece} en peligro! Está sin protección', '🚨 {piece} in danger! It is unprotected'],
    ['insight.attacked', '⚠️ Tu {piece} queda en casilla atacada', '⚠️ Your {piece} sits on an attacked square'],
    ['insight.lesserThreat', '⚠️ Tu {piece} puede caer ante pieza de menor valor', '⚠️ Your {piece} may fall to a piece of lower value'],
    ['insight.leftHanging', '⚠️ Cuidado: tu {piece} ha quedado sin defensa', '⚠️ Careful: your {piece} has been left undefended'],
    ['insight.castlePawns', '⚠️ Avanzar peones del enroque debilita la defensa del rey', '⚠️ Pushing the castled pawns weakens the king’s defence'],
    ['insight.knightRim', '⚠️ Caballo en el borde — pierde movilidad y fuerza', '⚠️ Knight on the rim — it loses mobility and strength'],
    ['insight.badBishop', '⚠️ Alfil atrapado entre tus peones — busca abrirle diagonales', '⚠️ Bishop trapped behind your pawns — open diagonals for it'],
    ['insight.kingCenter', '⚠️ Tu rey sigue en el centro sin enrocar — ¡búscale refugio!', '⚠️ Your king is still in the centre uncastled — find it shelter!'],
    ['insight.matPlus', '💪 Ventaja material clara — simplifica y gana', '💪 Clear material advantage — simplify and win'],
    ['insight.matMinus', '🔍 Desventaja material — busca complicaciones tácticas', '🔍 Material disadvantage — look for tactical complications'],
    ['insight.centerCtrl', '🎯 Controlas el centro del tablero', '🎯 You control the centre of the board'],
    ['insight.centerInfl', '♟ Refuerzas tu influencia en el centro', '♟ You strengthen your influence in the centre'],
    ['insight.endPawn', '♟ Avanza peones en el final — cada paso cuenta', '♟ Push pawns in the endgame — every step counts'],
];

const I18N = { es: {}, en: {} };
I18N_PAIRS.forEach(function(row) {
    I18N.es[row[0]] = row[1];
    I18N.en[row[0]] = row[2];
});

let currentLang = 'es';

function detectBrowserLanguage() {
    const nav = String(
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage ||
        ''
    ).toLowerCase();
    return nav.indexOf('es') === 0 ? 'es' : 'en';
}

function detectAppLanguage() {
    try {
        const dedicated = localStorage.getItem('ajedrezia_lang');
        if (dedicated === 'en' || dedicated === 'es') return dedicated;
    } catch (e) {}
    try {
        const saved = JSON.parse(localStorage.getItem('chess_settings') || '{}').language;
        // 'en' guardado es una elección real. 'es' puede ser el valor por defecto
        // del detector antiguo (cualquier idioma ≠ inglés → español).
        if (saved === 'en') return 'en';
    } catch (e) {}
    return detectBrowserLanguage();
}

function persistAppLanguage(lang) {
    currentLang = (lang === 'en') ? 'en' : 'es';
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
    const dict = I18N[currentLang] || I18N.es;
    let text = dict[key];
    if (text == null) text = I18N.es[key];
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
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'es';
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
}

function setAppLanguage(lang, persist) {
    currentLang = (lang === 'en') ? 'en' : 'es';
    applyI18n();
    if (persist !== false) {
        persistAppLanguage(currentLang);
        if (typeof saveSettings === 'function') saveSettings();
    }
}

currentLang = detectAppLanguage();
persistAppLanguage(currentLang);
if (document.body) applyI18n();
