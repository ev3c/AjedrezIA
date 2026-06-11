/**
 * Mueve el optgroup de Candidates 2026 al selector famous-game-select
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dir, '../index.html');

let html = readFileSync(indexPath, 'utf8');
const lines = html.split('\n');

// Encontrar inicio y fin del bloque optgroup
const ogStartLine = lines.findIndex(l => l.includes('<optgroup label="🏆 FIDE Candidates 2026 Cyprus">'));
if (ogStartLine === -1) { console.error('START NOT FOUND'); process.exit(1); }

// Encontrar la línea </optgroup> que cierra ESTE bloque
let ogEndLine = -1;
let depth = 0;
for (let i = ogStartLine; i < lines.length; i++) {
    if (lines[i].includes('<optgroup')) depth++;
    if (lines[i].includes('</optgroup>')) {
        depth--;
        if (depth === 0) { ogEndLine = i; break; }
    }
}
if (ogEndLine === -1) { console.error('END NOT FOUND'); process.exit(1); }
console.log(`Optgroup en líneas ${ogStartLine + 1}-${ogEndLine + 1}`);

// Extraer el bloque
const optgroupLines = lines.splice(ogStartLine, ogEndLine - ogStartLine + 1);
console.log(`Extraídas ${optgroupLines.length} líneas`);

// Ahora encontrar el cierre del famous-game-select
// Está después de "ding-nepomniachtchi-23" y ANTES de la segunda </select>
const dingLine = lines.findIndex(l => l.includes('value="ding-nepomniachtchi-23"'));
if (dingLine === -1) { console.error('DING LINE NOT FOUND'); process.exit(1); }

// Buscar el </optgroup> después de dingLine
let insertAfter = -1;
for (let i = dingLine; i < Math.min(dingLine + 5, lines.length); i++) {
    if (lines[i].includes('</optgroup>')) { insertAfter = i; break; }
}
if (insertAfter === -1) { console.error('INSERT AFTER NOT FOUND'); process.exit(1); }
console.log(`Insertar después de línea ${insertAfter + 1}: ${lines[insertAfter].trim()}`);

// Insertar el bloque
lines.splice(insertAfter + 1, 0, ...optgroupLines);

writeFileSync(indexPath, lines.join('\n'), 'utf8');

const finalLine = lines.findIndex(l => l.includes('FIDE Candidates 2026 Cyprus'));
console.log(`Optgroup ahora en línea ${finalLine + 1}`);
console.log('Primeras opciones:');
lines.slice(finalLine + 1, finalLine + 4).forEach(l => console.log(l.trim()));
