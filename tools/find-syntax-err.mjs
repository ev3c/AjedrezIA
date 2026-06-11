import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dir = path.dirname(fileURLToPath(import.meta.url));
const app = readFileSync(path.join(__dir, '../app.js'), 'utf8');

// Buscar: comilla simple no escapada dentro de un valor de string entre comillas simples
// Pattern: name: '...X's... o pgn: '...X's...
// Buscar O'Brien, O'Neil u otras comillas dentro de strings

const cand26Start = app.indexOf("'cand26-caruana-nakamura-r1'");
const cand26End   = app.indexOf('\n};\n\nconst OPENING_TRAINING');
const block = app.slice(cand26Start, cand26End);

// Buscar comillas simples dentro de un nombre de jugador o título
// ': '...'...' — si hay una comilla simple dentro del valor
const lines = block.split('\n');
lines.forEach((line, i) => {
    // líneas con name: o pgn: que contengan comilla simple suelta
    if ((line.includes("name: '") || line.includes("pgn: '")) ) {
        // después de name: ' todo hasta la comilla de cierre
        const m = line.match(/name: '(.*)'/) || line.match(/pgn: '(.*)/);
        if (m && m[1].includes("'") && !m[1].includes("\\'")) {
            console.log(`Line ${cand26Start + i}: UNESCAPED QUOTE: ${line.slice(0, 120)}`);
        }
    }
});

// Buscar "Unexpected identifier 's'" — suele ser O's o 's en SAN/jugador
// Buscar patrón: 's seguido de espacio o letra en medio de un PGN
const idx = block.search(/'s\s/g);
if (idx !== -1) {
    console.log("Found 's pattern at offset", idx, ':', block.slice(idx-20, idx+40));
}

// Verificar que el bloque entero no tiene comillas simples sin escapar
// buscando: ' fuera de \' dentro de strings
const nameLines = lines.filter(l => l.includes("name: '") || l.includes("pgn: '"));
console.log('Total name/pgn lines:', nameLines.length);
console.log('First few:', nameLines.slice(0,3).map(l => l.slice(0, 80)));
