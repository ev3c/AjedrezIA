/**
 * Genera el bloque <optgroup> HTML para Candidates 2026 e inyecta en index.html
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const htmlSrc  = path.join(__dir, '../famosas/FIDE Candidates 2026 Cyprus GM Axel Bachmann · Course.html');
const indexPath = path.join(__dir, '../index.html');

const html = readFileSync(htmlSrc, 'utf8');
const start = html.indexOf('const COURSE = {');
const end   = html.indexOf('\n// Build lid');
const course = JSON.parse(html.slice(start + 'const COURSE = '.length, end));
const vars = course.chapters.flatMap(ch => ch.variations || []);

function makeKey(v) {
    const w = v.white.split(',')[0].trim().toLowerCase().replace(/[^a-z]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
    const b = v.black.split(',')[0].trim().toLowerCase().replace(/[^a-z]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
    const r = (v.title.match(/^R(\d+)/) || ['', '0'])[1];
    return `cand26-${w}-${b}-r${r}`;
}

// Agrupar por ronda
const byRound = {};
vars.forEach(v => {
    const m = v.title.match(/^R(\d+)/);
    const r = m ? parseInt(m[1]) : 0;
    if (!byRound[r]) byRound[r] = [];
    byRound[r].push(v);
});

const indent = '                            ';
const iopt   = '                                ';
let block = `${indent}<optgroup label="🏆 FIDE Candidates 2026 Cyprus">\n`;
Object.keys(byRound).sort((a, b) => a - b).forEach(r => {
    byRound[r].forEach(v => {
        const key = makeKey(v);
        const wShort = v.white.split(',')[0].trim();
        const bShort = v.black.split(',')[0].trim();
        const label = `${wShort} vs ${bShort} R${r} (${v.result})`;
        block += `${iopt}<option value="${key}">${label}</option>\n`;
    });
});
block += `${indent}</optgroup>`;

// Insertar antes de </select> que cierra el selector de partidas famosas
const anchor = '                        </select>';
let indexHtml = readFileSync(indexPath, 'utf8');

if (indexHtml.includes('cand26-caruana-nakamura-r1')) {
    console.log('Ya insertado en index.html, saliendo.');
    process.exit(0);
}

const insertAt = indexHtml.indexOf(anchor);
if (insertAt === -1) { console.error('ANCHOR NOT FOUND'); process.exit(1); }

indexHtml = indexHtml.slice(0, insertAt) + block + '\n' + indexHtml.slice(insertAt);
writeFileSync(indexPath, indexHtml, 'utf8');
console.log(`Insertado optgroup con ${vars.length} opciones en index.html`);
console.log('Primeras 4 opciones:');
block.split('\n').filter(l => l.includes('<option')).slice(0, 4).forEach(l => console.log(l.trim()));
