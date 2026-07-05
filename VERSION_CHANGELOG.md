# AjedrezIA — Historial de versiones

---

## v3.4.33 — 2026-07-03

### Aprende Ajedrez — Nuevas categorías Intermedio y Avanzado
- Nueva categoría **«🎓 Intermedio»** con 4 lecciones multi-paso:
  - **Colocación del tablero** (6 pasos): dónde empieza cada pieza (torres, caballos, alfiles, dama en su color, rey) y primera jugada desde la posición inicial.
  - **El Enroque** (5 pasos): enroque corto, largo, elegir lado, casilla atacada (por qué es ilegal enrocar pasando por una casilla amenazada) y enrocar pronto en la apertura.
  - **Captura al paso** (4 pasos): captura básica, solo el peón que ACABA de avanzar dos casillas, elegir con cuál de tus dos peones capturar y evitar que un peón pase de largo.
  - **El Ahogado** (4 pasos): provocar tablas por ahogado con dama, en el rincón, con rey y peón de torre y con torre.
- Nueva categoría **«🏆 Avanzado»** con 2 lecciones multi-paso:
  - **Valor de las piezas** (5 pasos): capturar siempre la pieza de mayor valor (dama 9, torre 5, alfil/caballo 3, peón 1)… solo si la captura es segura.
  - **Jaque en dos** (8 pasos, 4 parejas de jugadas): preparar el ataque con una jugada (torre, alfil, caballo, dama) y rematar con jaque en la segunda; el rival responde automáticamente entre ambas.
- Con esto el panel cubre todas las etapas de los cursos básicos de Lichess Learn: Piezas (1–6), Básico (7–12), Intermedio (13–16) y Avanzado (17–18).
- La categoría antigua **«Especiales»** desaparece: sus lecciones sueltas (enroque corto/largo, captura al paso) quedan integradas en las nuevas lecciones multi-paso, y la coronación ya se practica en la lección «El Peón».
- Banner sobre el tablero «Ejercicio Intermedio / Avanzado: …» al abrir una lección de las nuevas categorías.

### Corrección
- **La Horquilla** (Tácticas): el segundo paso reiniciaba el tablero a la posición inicial en vez de continuar tras la respuesta automática del rival; ahora el caballo y el rey negro mantienen la posición correcta.

### Detalles técnicos
- Nuevo script `tools/verify-learn.js`: valida con el motor real (`chess-logic.js`) que cada ejercicio nuevo es legal y coherente (jugadas aceptadas legales, ahogados reales, jaques efectivos y FEN encadenados coincidentes tras cada `autoResponse`).

---

## v3.4.32 — 2026-07-03

### Aprende Ajedrez
- Lecciones de piezas (Torre, Alfil, Dama, Rey, Caballo, Peón) consolidadas en ejercicios **multi-paso con avance automático** al acertar, con título y contador de paso, estrellas objetivo más grandes y una **flecha verde** temporal que muestra el movimiento correcto.
- Los reyes se quitan de los ejercicios de piezas (excepto el rey blanco en la lección «El Rey»).
- Nueva categoría **«Básico»** debajo de «Piezas» con 6 lecciones basadas en Lichess Learn: Captura, Protección, Combate, Jaque en una, Salir del jaque y Mate en una.
- Banner sobre el tablero con el nombre del ejercicio en curso; sonido al capturar una estrella.
- Sección marcada como **«🚧 En construcción»** (badge en el título del panel y aviso dentro).
- Al abrir cualquier opción de Aprende Ajedrez se cierran las variantes de apertura sobre el tablero y se oculta el título de la partida; al salir hacia otro panel, la pantalla vuelve al estado de una partida nueva.

### Partidas — Reanudar, deshacer y fin de partida
- **Reanudar / Continuar Partida** pide confirmación («¿Quieres continuar la partida desde esta posición?»), aplica la **IA actualmente seleccionada** en Nueva Partida (mostrando su nivel y ELO) y hace que la IA mueva automáticamente si le toca a ella.
- Se puede **continuar la partida desde cualquier movimiento** del historial (no solo desde el último), con el mismo aviso de confirmación.
- **Deshacer Movimiento** retrocede un único movimiento (media jugada) por pulsación, en vez de dos; corregido también para partidas maestras, donde antes la flecha gris aparecía pero la pieza no volvía a su casilla anterior.
- El **título de la partida** y el mensaje de reanudar muestran ahora el **ELO** de la IA rival (p. ej. «AjedrezIA (Intermedio · 1200 ELO)»).
- Al terminar la partida (jaque mate, tablas, abandono o tiempo agotado) **ya no aparece el modal emergente** con el resultado y el botón «Ver análisis post-partida»: solo se muestra el **banner sobre el tablero**. El análisis sigue disponible desde el botón dedicado del panel Acciones.
- Corregida una condición de carrera que impedía a la IA mover automáticamente tras reanudar una partida (contador de «generación» de partida para descartar movimientos de IA obsoletos).

### Compartir
- La imagen generada al compartir un **problema** coincide siempre con la posición real del tablero (se aplican los `preMoves` antes de generar el FEN).
- Tercera línea de la tarjeta compartida dividida en «Tipo de problema» y «Juegan Blancas/Negras»; etiqueta «Problema de ajedrez» → «Problema de ajedrez y 30 más».
- Icono y botón de compartir unificados en **verde** (como «Nueva Partida») dentro del panel Acciones, con el mismo tamaño que el botón de cambiar color, en PC y smartphone. Se retira el icono suelto de la barra de navegación de problemas.
- Barra de problemas: la categoría del problema se muestra formateada en lugar de la clave interna del tema.

### Contacto
- Email del autor reubicado en el sidebar derecho (con emoji ✉️ delante), visible tanto en PC como en smartphone.
- Nuevo enlace **«📧 Informar de errores/mejoras»** debajo del email: abre un modal con campos «Error:» y «Mejora:» y botones Enviar/Cancelar; al enviar, el mensaje llega por correo al equipo de AjedrezIA (`api/send-feedback.php`).

### Otros
- Lista de usuarios online ampliada con 180 usuarios de ejemplo adicionales (80 marcados como ocupados).

---

## v3.3.4 — 2026-06-04

### Open Graph para todos los contenidos (tarjeta enriquecida en redes)
- Al compartir por **WhatsApp, Facebook y X**, el enlace muestra automáticamente una tarjeta enriquecida con la **imagen del tablero** (posición real en pantalla), título y subtítulo. La imagen la genera `board-image.php` en el servidor.
- `share.php` ahora es **genérico**: acepta `fen`, `kind`, `t`, `s`, `mv` más el parámetro de apertura (`moves` / `opening` / `puzzle` / `master`). Redirige a las personas a la URL limpia de la app y sirve los OG tags a los bots de redes.
- **OG genérico en `index.html`**: cualquier link a `ajedrezia.com` (sin pasar por `share.php`) muestra ya la imagen y descripción de la app.
- En **localhost**, `share.php` apunta al servidor local en lugar de a producción, para poder probarlo directamente.

### Imagen de compartir mejorada
- **Coordenadas del tablero** (números 1–8 y letras a–h) fuera del tablero, centradas en los márgenes lateral e inferior, en las tres versiones: canvas (modal), PHP (`board-image.php`) y SVG (`default.png`).
- **`default.png` renovado**: tablero más grande, piezas **staunty**, textos *Aperturas · Problemas · Partidas maestras* y *Juega y aprende con AjedrezIA*.
- Las **76 imágenes `master-*.png` estáticas eliminadas**: la imagen se genera siempre en tiempo real desde `board-image.php`.
- Sprites de piezas en `share-img/pieces/` actualizados a **staunty**.

## v3.3.3 — 2026-05-30

### Compartir con texto + imagen del tablero para TODO el contenido
- Ahora se comparte con **texto + imagen del tablero** cualquier contenido: **partidas, aperturas, problemas y partidas maestras** (antes solo las maestras).
- El **enlace que se comparte** (texto del mensaje y botones de WhatsApp / Facebook / Correo / X) es siempre la **URL limpia de la app**:
  - `?puzzle=` para problemas (o `?p=` si el problema no tiene id),
  - `?opening=` para aperturas,
  - `?master=` para partidas maestras,
  - `?moves=` para partidas normales.
- La **imagen** del tablero se usa **solo internamente** para la tarjeta y se genera **en tiempo real** desde la posición que estás viendo:
  - En el **navegador** (canvas), para que la previsualización del modal se vea siempre, incluso en local sin PHP.
  - En el **servidor** con `board-image.php` (PHP GD): toma el **FEN actual**, la **orientación** según tu color y resalta la **última jugada**. Imagen 1200×630 px con tablero + título + subtítulo.
- El **modal de compartir** muestra esa imagen entre el texto y los botones de WhatsApp / Facebook / Correo / X.
- **Pulsar la imagen** la copia al portapapeles (como al pulsar el texto), con un aviso «✓ Imagen copiada». Útil para **pegarla en Facebook** (Ctrl+V) junto al enlace.
- Sprites de piezas (cburnett) en PNG (`share-img/pieces/`, generados con `tools/build-piece-sprites.js`) y fuente DejaVu Sans empaquetada (`assets/fonts/`) para el texto de la tarjeta del servidor. `share.php` se mantiene como landing genérico (compatibilidad con enlaces antiguos `share.php?master=clave`).

### Tablero 3D al abrir la web
- Al abrir la web, el tablero se muestra directamente en **3D** si el checkbox «Tablero 3D» está marcado. Antes, en la **primera visita** (sin ajustes guardados) no se aplicaba el modo 3D aunque el checkbox apareciera marcado por defecto.

### Fix tarjeta de Facebook
- `og:url` y `canonical` ahora apuntan al propio `share.php` (la página que contiene la imagen de la tarjeta) en lugar de a la app (`?master=`). Facebook usa `og:url` como URL canónica del objeto y re-rastrea esa página para la imagen; al apuntar antes a `index.html` (sin etiquetas og) la tarjeta salía vacía en Facebook, aunque WhatsApp y X sí la mostraban.
- La **redirección** de `share.php` ahora se aplica **solo a personas**: los robots de redes (Facebook, Twitter/X, WhatsApp, LinkedIn, Telegram, etc.) se detectan por `User-Agent` y se quedan en `share.php` para leer las etiquetas Open Graph, evitando que el rastreador siga la redirección hacia la app (que no tiene imagen).
- Al pulsar **Facebook** en el modal de compartir, aviso más claro: explica que Facebook no permite rellenar el texto automáticamente y recuerda **pegar con Ctrl+V** (o «mantén pulsado → Pegar» en móvil); la imagen del tablero aparece sola. La ventana de Facebook se abre con un pequeño retardo para dar tiempo a leer el aviso.

### Configuración — Vistas previas al activar opciones
- «Flecha para movimiento» renombrado a **«Flecha movimiento»**. Al activarla se muestra una **flecha de ejemplo** (e2→e4) sobre el tablero.
- Al activar **«Mensajes de Ayuda»** se muestra un **mensaje de ayuda de ejemplo** sobre el tablero, reutilizando el estilo real de los mensajes durante la partida.

### UI
- Títulos de los paneles con un tamaño de texto algo más pequeño (`1.08rem` → `0.98rem`, y ajustes equivalentes en las variantes responsive).

### Detalles técnicos
- Nuevo `share.php` (landing con metaetiquetas dinámicas + redirección a la app).
- Nuevo `share-data.php` (mapa título/descripción por partida) y carpeta `share-img/` con una imagen PNG por partida maestra (76 partidas).
- Las imágenes se generan con `tools/build-share-cards.js`, que **reutiliza el motor real** (`chess-logic.js`) para reproducir cada PGN hasta su posición final y rasteriza el tablero con las piezas `cburnett`.

---

## v3.3.2 — 2026-05-28

### UI — Estabilidad del tablero al jugar con negras
- El indicador «La IA está calculando…» ahora flota centrado sobre el tablero con `position: absolute`, en lugar de añadirse al flujo del `.board-container`.
- Esto elimina el pequeño «tirón» que hacía el tablero al jugar con negras, donde el indicador aparecía/desaparecía tras cada movimiento de la IA cambiando la altura del contenedor y forzando un recálculo del sticky-top.

---

## v3.3.1 — 2026-05-28

### Banner de apertura — Ocultar también en partida normal
- En partida normal (vs IA, PvP, online) el banner / log de aperturas encima del tablero queda **completamente oculto**. Antes seguía apareciendo el nombre y se acumulaban las variantes detectadas movimiento a movimiento.
- El banner / log con nombre + variantes sigue activo en los modos **entrenamiento de aperturas**, **entrenamiento libre** y **quiz**.

---

## v3.3.0 — 2026-05-28

### Banner de apertura — Variantes solo en entrenamiento
- En una partida normal (vs IA, PvP, online), el banner de apertura muestra **solo el nombre** detectado, sin botón de variantes ni popup sobre el tablero.
- Las variantes interactivas (botón «⤵ N variantes» y popup) siguen activas en los modos de **entrenamiento de aperturas**, **entrenamiento libre** y **quiz** (donde su valor pedagógico tiene sentido).

---

## v3.2.9 — 2026-05-28

### UI — Estabilidad del sticky del tablero (PC)
- Corregido el «tirón hacia arriba» del tablero tras cada movimiento. El recálculo del `top` dinámico del `.board-container` ignora ahora cambios de altura menores de 25px (los típicos del navegador de movimientos, capturas, eval-bar, etc.).
- Cuando sí se aplica un cambio de `top` significativo (por ejemplo, al redimensionar la ventana), se suaviza con una transición CSS `top 0.25s ease-out`. El scroll natural del sticky sigue funcionando sin transición, ya que el navegador lo aplica internamente.

---

## v3.2.8 — 2026-05-28

### UI — Footer en responsive
- En móvil/tablet en vertical, el footer `ev3c.android@gmail.com` aparece ahora justo debajo del panel **📊 Estadísticas** (igual que en PC). Se le asigna `order: 10` para fijarlo después de `#stats-panel` (que tiene `order: 9`) en el flex del `game-container`.

---

## v3.2.7 — 2026-05-28

### UI — Footer dentro del sidebar derecho
- El footer con el email del autor (`ev3c.android@gmail.com`) se ha reubicado dentro del sidebar derecho, **debajo del panel Estadísticas**. Mantiene su aspecto discreto sin competir por espacio con la parte inferior del tablero.
- En móvil/tablet en vertical, queda automáticamente al final del bloque (los sidebars se apilan en columna debajo del board-container).

---

## v3.2.6 — 2026-05-28

### UI — Footer fuera del flujo en PC
- El footer con el email del autor (`ev3c.android@gmail.com`) deja de competir por espacio con la parte inferior del tablero (botones de acción, navegador de movimientos, mini-reloj…). En PC se muestra ahora discreto en la esquina inferior derecha con `position: fixed`, sin contribuir a la altura del documento.
- El sticky del tablero puede anclar correctamente la parte inferior del `.board-container` al bottom del viewport.
- En móvil/tablet en vertical, el footer mantiene su posición original al pie de la página.

---

## v3.2.5 — 2026-05-28

### UI — Animación de captura
- Duración de la animación de captura aumentada (zoom + desvanecimiento): de 0.55s a 0.95s. El efecto es ahora más visible y permite seguir mejor las capturas durante partidas rápidas y al navegar por los movimientos.

---

## v3.2.4 — 2026-05-28

### Navegación de movimientos
- Al avanzar paso a paso por la partida (botón ▶ del navegador de movimientos), si el movimiento captura una pieza se muestra la animación de **zoom + desvanecimiento** sobre la casilla destino, incluyendo capturas **en-passant**.
- La animación solo se dispara en avances de un paso; los saltos múltiples (⏮ ir al inicio, ⏭ ir al final, o click directo en un movimiento del historial) no la disparan para evitar exceso visual.
- Requiere la opción «Flecha para movimiento» activada en Configuración (misma opción que controla las flechas y la animación durante el juego).

---

## v3.2.3 — 2026-05-28

### UI — Scroll inteligente
- Al iniciar partida, entrenar aperturas, abrir un puzzle o cargar una partida maestra, el scroll prioriza ahora la visibilidad de **tablero + botones de acción + navegador de movimientos**. Si todo cabe, se centra verticalmente; si no, se ancla por la parte inferior para que los controles queden siempre a la vista.
- Eliminado el `window.scrollTo({ top: 0 })` automático tras cada movimiento en PC. El `position: sticky` dinámico ya garantiza que el tablero esté siempre visible sin necesidad de forzar scroll a la cabecera.

---

## v3.2.2 — 2026-05-28

### Online
- Eliminado el aviso «🟢 usuario on-line ELO:XXX» que aparecía al conectarse otros jugadores. Se desactiva el polling de presencia (cada 30 s) para reducir tráfico innecesario al backend.

---

## v3.2.1 — 2026-05-28

### UI — Tablero 3D por defecto
- El checkbox "Tablero 3D" aparece **marcado por defecto** en nuevas instalaciones / primer uso. Los usuarios que ya tengan una preferencia guardada en `localStorage` mantienen su valor anterior.

---

## v3.2.0 — 2026-05-28

### Jugadores online — Bots siempre disponibles
- Nuevos jugadores sintéticos disponibles 24/7 en la lista de usuarios online: **Bot_400, Bot_700, Bot_1000, Bot_1200, Bot_1500, Bot_1800, Bot_2200, Bot_2500**.
- Al invitar a un bot se arranca directamente una partida contra la IA local con el nivel correspondiente a su ELO (mismo motor que «Nueva Partida → contra IA»). Se respeta el color y el control de tiempo seleccionados.
- Los bots se sirven tanto desde el backend (`api/get-users.php`) como inyectados en el cliente, por lo que están disponibles también en modo local (sin servidor) y sin necesidad de iniciar sesión.

---

## v3.1.7 — 2026-05-28

### UI — Menú Ayuda en vídeo
- Todos los botones del menú Ayuda en vídeo muestran la misma separación entre sí: se envolvieron en un contenedor flex con `gap: 4px` uniforme, eliminando los márgenes individuales distintos.

### UI — Panel Configuración
- Los checkboxes del panel de Configuración se muestran más juntos: `margin-bottom: 6px` por sección y `line-height: 1.25` en etiquetas.

## v3.1.6 — 2026-05-28

### UI — Menú Ayuda en vídeo
- Botones más compactos: padding vertical reducido, `margin-top: 0` sobre la clase `.btn`, gap de lista a 2px.

## v3.1.5 — 2026-05-28

### UI — Panel Configuración
- Checkboxes más juntos: nueva regla `.config-section.config-checkbox` con `margin-bottom: 6px` (antes heredaban 20px del `.config-section` general).

## v3.1.4 — 2026-05-27

### UI — Tablero 3D
- Controles bajo el tablero más arriba en modo 3D: factor `padding-bottom` reducido de `×1.1` a `×0.65` (general) y de `×0.55` a `×0.3` (override PC).

## v3.1.3 — 2026-05-27

### UI — Layout PC y smartphone
- Controles bajo el tablero (mini-reloj, ELO, botones de acción, navegador de movimientos) aparecen más arriba en PC y en móvil.
  - PC: `gap` del `.board-container` de 10px → 6px; `margin` del mini-reloj de 20px → 2px.
  - Móvil: `gap` de 6px → 2px; `margin-bottom` del wrapper de 6px → 2px.

## v3.1.2 — 2026-05-27

### UI — Tablero 3D (PC)
- Tablero 3D en modo PC ligeramente más grande: `scale(0.86)` → `scale(0.92)`; `translateY` ajustado de -20px a -25px para compensar la proyección.

## v3.1.1 — 2026-05-27

### UI — Layout PC (sticky)
- Nueva lógica de posicionamiento sticky del tablero en PC: prioriza que los controles inferiores (botones, navegador de movimientos, mini-reloj) nunca queden recortados por la parte inferior. El `top` se calcula sobre la altura total del `.board-container`, no solo del tablero.

## v3.1.0 — 2026-05-27

### Tablero 3D y layout PC
- Detección de clics en 3D: `get3DSquareFromPoint()` con tolerancia; handlers de click/touch en `applyBoard3D`.
- PC con `scale(0.86)` y `rotateX(20deg)`; smartphone mantiene `scale(0.97)`.
- Coordenadas en marco 3D: números y letras en los 4 lados; corrección de posición visual para negras.
- Barra de fuerza 3D alineada arriba con el tablero.
- Tablero siempre visible en PC: sticky dinámico basado en `#chess-board`, recalculado en resize/scroll/ResizeObserver.
- Scroll con rueda sobre el tablero redirige el scroll a los paneles laterales.

### Flechas de movimiento
- Flecha amarilla al mover piezas (jugador, IA, online, puzzles, aperturas, partidas maestras, quiz, entrenamiento).
- Flecha gris al retroceder (navegación de movimientos y deshacer).
- Checkbox «Flecha para movimiento» en Configuración, persistido en `localStorage`.

### Animación de captura
- Si la flecha está activa, la pieza capturada hace zoom + desvanecimiento (incluye en-passant).

### Promoción de peón
- `promotePawn()` acepta tanto notación UCI (`q/r/b/n`) como nombres completos; corrige piezas coronadas en puzzles.

### Online
- Aviso cuando un usuario se conecta: «🟢 usuario on-line ELO:XXX» (polling cada 30 s).

---

## v3.0.6 — 2026-05-05

### Responsive
- En móvil / tablet en vertical, el botón «Nueva Partida» se muestra justo encima del panel **Configuración** (tras el tablero). Se corrige el orden en el contenedor flex cuando las barras laterales usan `display: contents`.

### Juego online / cuenta
- Registro e inicio de sesión con **nickname y contraseña** en el servidor (`api/nick-auth.php`), coherente con el guardado de usuario para cuentas tipo nickname (`save-user.php`).

---

## v3.0.5 — 2026-05-04

### Mejoras de UI (modo PC)
- Mini-reloj compacto ahora visible también en modo escritorio (antes solo aparecía en móvil).
- Elementos bajo el tablero (reloj, piezas capturadas, botones de acción y navegador de movimientos) presentan un espaciado más compacto y uniforme en PC.

---

## v3.0.4 — 2026-05-03

### Juego online
- Mejoras en el sistema de invitaciones y partidas online.
- Soporte mejorado para múltiples sesiones simultáneas (heartbeat y gestión de usuarios).
- Correcciones en `.htaccess` para el manejo de rutas de la API.
- Ajustes de estilos para el chat online y el panel de usuarios.

---

## v3.0.3 — 2026-05-02

### Juego online
- Nueva API para gestionar ofertas y respuesta de tablas online (`offer-draw.php`, `respond-draw.php`).
- Panel de usuarios online: lista de jugadores registrados y disponibles para invitar.
- Modal de oferta de tablas online con confirmación del oponente.
- Mejoras en el chat en línea y la visualización de partidas activas.

---

## v3.0.2 — 2026-05-02

### Juego online
- Sincronización de movimientos online en tiempo real mejorada (`send-move.php`, `get-game.php`).
- Correcciones en el flujo de aceptación de invitaciones (`respond-invite.php`).
- Mejoras en la lógica de detección de fin de partida online.

---

## v3.0.0 — 2026-04-29

### Modo online multijugador (gran actualización)
- Sistema completo de juego online en tiempo real: invitaciones, aceptación/rechazo, sincronización de movimientos, fin de partida y actualización de ELO.
- API backend en PHP: `_db.php`, `save-user.php`, `get-users.php`, `heartbeat.php`, `send-invite.php`, `respond-invite.php`, `get-invites.php`, `get-game.php`, `send-move.php`, `end-game.php`, `update-elo.php`, `notify-new-user.php`.
- Autenticación con Google y Apple (OAuth).
- Modal de inicio de sesión, lista de jugadores online, panel de invitaciones recibidas.
- Chat en tiempo real entre jugadores online.
- Abandono de partida online con confirmación y penalización de ELO.
- Grandes refactorizaciones en `app.js` y `style.css` para soportar los nuevos modos.

---

## v2.6.5 — 2026-04-28

- Correcciones menores y pulido general previo al lanzamiento del modo online.

---

## v2.6.x — 2026-04

- Mejoras en el sistema de puzzles (categorías, estadísticas, racha).
- Análisis post-partida con navegación por errores.
- Barra de evaluación (vertical en PC, horizontal en móvil).
- Navegador de movimientos con botones ⏮◀▶⏭.
- Partidas famosas: más de 80 partidas maestras cargables para revisión.
- Entrenamiento de aperturas con quiz interactivo.
- Mejoras de accesibilidad y soporte PWA.

---

## v2.5.x — 2026-03

- Sistema de ELO local y estadísticas de partidas.
- Soporte para múltiples temas de tablero y estilos de piezas.
- Modo PvP (jugador contra jugador local).
- Coordenadas en casillas, mensajes de ayuda opcionales.
- Mejoras en el Service Worker para actualizaciones automáticas de PWA.

---

## v2.4.x — 2026-03

- Primera versión pública estable.
- Juego contra IA local (niveles 1-4) y Stockfish vía API (niveles 5-8).
- Reloj de ajedrez con control de tiempo configurable.
- Historial de movimientos, deshacer movimiento, sugerencia de IA.
- Exportar/importar PGN, compartir partida.
- Diseño responsive con soporte móvil completo.
