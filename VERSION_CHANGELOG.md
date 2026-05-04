# AjedrezIA — Historial de versiones

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
