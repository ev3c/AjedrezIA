# AjedrezIA — Historial de versiones

---

## v3.3.3 — 2026-05-30

### Compartir partidas maestras con tarjeta enriquecida (Open Graph)
- Al compartir una partida maestra, el enlace ahora apunta a `share.php`, que genera una **tarjeta con imagen del tablero** para Facebook, X (Twitter) y WhatsApp (los robots de esas redes no ejecutan JavaScript, así que las metaetiquetas se generan en el servidor).
- La tarjeta muestra la **posición final** de la partida (con la última jugada resaltada), el **título**, los **jugadores** y el **lugar/año**. Imagen 1200×630 px (`og:image` / `twitter:card = summary_large_image`).
- Al pulsar la tarjeta, `share.php` redirige a `?master=` en la app, que reproduce la partida normalmente.
- El **modal de compartir** muestra una previsualización de esa misma imagen del tablero, entre el texto y los botones de WhatsApp / Facebook / Correo / X.
- Compartir disponible en **WhatsApp, Facebook, Correo y X** desde el modal de compartir.

### Tablero 3D al abrir la web
- Al abrir la web, el tablero se muestra directamente en **3D** si el checkbox «Tablero 3D» está marcado. Antes, en la **primera visita** (sin ajustes guardados) no se aplicaba el modo 3D aunque el checkbox apareciera marcado por defecto.

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
