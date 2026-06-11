/**
 * Añade el resultado (1-0) / (0-1) / (1/2-1/2) al texto de cada <option>
 * dentro de #famous-game-select en index.html, usando los PGN de FAMOUS_GAMES.
 * Omite las opciones que ya tienen el resultado o son el Candidates 2026.
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const appPath   = path.join(__dir, '../app.js');
const indexPath = path.join(__dir, '../index.html');

// ── 1. Extraer resultados de FAMOUS_GAMES ────────────────────────────────────
const appSrc = readFileSync(appPath, 'utf8');

// Extraer todos los pares key -> result del PGN
// Patrón: 'somekey': { ... pgn: '...[Result "X-Y"]...' ... }
const gameResults = {};
const keyPgnRe = /'([a-zA-Z0-9_-]+)':\s*\{[^{}]*pgn:\s*'((?:[^'\\]|\\.)*)'/g;
let m;
while ((m = keyPgnRe.exec(appSrc)) !== null) {
    const key = m[1];
    const pgn = m[2].replace(/\\n/g, '\n').replace(/\\'/g, "'");
    const resultMatch = pgn.match(/\[Result\s+"([^"]+)"\]/);
    if (resultMatch) {
        gameResults[key] = resultMatch[1];
    }
}
console.log(`Resultados extraídos: ${Object.keys(gameResults).length}`);

// ── 2. Actualizar index.html ──────────────────────────────────────────────────
let html = readFileSync(indexPath, 'utf8');

// Solo modificar opciones dentro del famous-game-select
// Buscar el bloque entre id="famous-game-select" y el </select> que lo cierra
const selectStart = html.indexOf('id="famous-game-select"');
const selectEnd   = html.indexOf('</select>', selectStart);
if (selectStart === -1 || selectEnd === -1) {
    console.error('Select not found'); process.exit(1);
}

let before = html.slice(0, selectStart);
let block  = html.slice(selectStart, selectEnd + 9); // include </select>
let after  = html.slice(selectEnd + 9);

let changed = 0;
// Reemplazar cada <option value="KEY">TEXT</option>
// donde KEY no es cand26- y TEXT no termina ya en (1-0) / (0-1) / (1/2-1/2)
block = block.replace(/<option\s+value="([^"]+)">([^<]+)<\/option>/g, (full, key, text) => {
    // Saltar si ya tiene resultado
    if (/\(1-0\)|\(0-1\)|\(1\/2-1\/2\)/.test(text)) return full;
    // Saltar opciones cand26 (ya tienen resultado)
    if (key.startsWith('cand26-')) return full;
    // Saltar la opción vacía "— Elegir partida —"
    if (!key) return full;

    const result = gameResults[key];
    if (!result) {
        console.log(`  Sin resultado para: ${key}`);
        return full;
    }
    changed++;
    const suffix = result === '*' ? '' : ` (${result})`;
    return `<option value="${key}">${text.trimEnd()}${suffix}</option>`;
});

html = before + block + after;
writeFileSync(indexPath, html, 'utf8');
console.log(`\nOpciones actualizadas: ${changed}`);
