import fs from 'fs';

function extractArray(src, marker) {
    const start = src.indexOf(marker);
    if (start < 0) throw new Error('marker not found: ' + marker);
    const from = src.indexOf('[', start);
    let i = from;
    let depth = 0;
    let inStr = false;
    let quote = '';
    let esc = false;
    for (; i < src.length; i++) {
        const ch = src[i];
        if (inStr) {
            if (esc) { esc = false; continue; }
            if (ch === '\\') { esc = true; continue; }
            if (ch === quote) inStr = false;
            continue;
        }
        if (ch === '\'' || ch === '"') { inStr = true; quote = ch; continue; }
        if (ch === '[') depth++;
        else if (ch === ']') {
            depth--;
            if (depth === 0) {
                return Function('return ' + src.slice(from, i + 1))();
            }
        }
    }
    throw new Error('unterminated array for ' + marker);
}

const ui = extractArray(fs.readFileSync('i18n.js', 'utf8'), 'const I18N_PAIRS =');
const content = extractArray(fs.readFileSync('i18n-content.js', 'utf8'), 'const EXTRA =');
const rows = [...ui, ...content].map(row => ({
    key: row[0],
    es: row[1],
    en: row[2],
    ca: row[3] ?? row[2]
}));
fs.writeFileSync('tools/i18n-keys.json', JSON.stringify(rows, null, 2));
console.log(ui.length, content.length, rows.length);
