# AjedrezIA — Historial de versiones

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
