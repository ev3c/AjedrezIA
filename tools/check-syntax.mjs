import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dir = path.dirname(fileURLToPath(import.meta.url));
const app = readFileSync(path.join(__dir, '../app.js'), 'utf8');

// Verificar sintaxis JS
try {
    new Function(app);
    console.log('Sintaxis JS: OK');
} catch(e) {
    // Buscar el contexto del error
    console.log('ERROR SINTAXIS:', e.message);
}

const count = (app.match(/'cand26-/g) || []).length;
console.log('Entradas cand26:', count);

// Ver ejemplo de entrada con Women's
const idx = app.indexOf("Women\\'s");
if (idx !== -1) {
    console.log('Women escaped OK:', app.slice(idx - 20, idx + 60));
}
