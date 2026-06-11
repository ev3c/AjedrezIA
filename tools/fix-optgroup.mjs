/**
 * Mueve el optgroup de Candidates 2026 del selector de aperturas
 * al selector de partidas maestras (famous-game-select).
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dir, '../index.html');

let html = readFileSync(indexPath, 'utf8');

const OPTGROUP_START = '                            <optgroup label="🏆 FIDE Candidates 2026 Cyprus">';
const OPTGROUP_END   = '                            </optgroup>';

// Extraer el bloque
const startIdx = html.indexOf(OPTGROUP_START);
if (startIdx === -1) { console.error('OPTGROUP START NOT FOUND'); process.exit(1); }

// Encontrar el </optgroup> de cierre tras el inicio
const endIdx = html.indexOf(OPTGROUP_END, startIdx);
if (endIdx === -1) { console.error('OPTGROUP END NOT FOUND'); process.exit(1); }

const blockEnd = endIdx + OPTGROUP_END.length;
const optgroupBlock = html.slice(startIdx, blockEnd);
console.log('Block lines:', optgroupBlock.split('\n').length);

// Eliminar del lugar actual (selector de aperturas)
// También eliminar el \n justo antes del bloque si lo hay
let charBefore = html.slice(startIdx - 1, startIdx);
let removeFrom = charBefore === '\n' ? startIdx - 1 : startIdx;
html = html.slice(0, removeFrom) + html.slice(blockEnd);
console.log('Eliminado del selector de aperturas.');

// Insertar antes del </select> que cierra el selector de partidas maestras
// Ese select tiene id="famous-game-select"
// Buscamos el </select> tras "🌟 Otros Maestros"
const famousAnchor = '                            </optgroup>\n                        </select>';
const famousIdx = html.indexOf(famousAnchor);
if (famousIdx === -1) {
    // fallback: buscar después de ding-nepomniachtchi-23
    console.error('FAMOUS ANCHOR NOT FOUND'); process.exit(1);
}

const insertAt = famousIdx + '                            </optgroup>\n'.length;
html = html.slice(0, insertAt) + optgroupBlock + '\n' + html.slice(insertAt);
console.log('Insertado en selector de partidas maestras.');

writeFileSync(indexPath, html, 'utf8');

// Verificar
const lineIdx = html.split('\n').findIndex(l => l.includes('FIDE Candidates 2026 Cyprus'));
console.log('Optgroup ahora en línea ~', lineIdx + 1);
