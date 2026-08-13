import fs from 'fs';

const langs = ['de', 'fr', 'it', 'pt', 'zh', 'ru', 'ar', 'ja', 'hi', 'ko'];
const source = JSON.parse(fs.readFileSync('tools/i18n-source.json', 'utf8'));
const keys = Object.keys(source);

let out = '// Traducciones extra (DE FR IT PT ZH RU AR JA HI KO). Generado por tools/build-i18n-extra.mjs\n';
out += '(function () {\n';
out += '    if (typeof registerI18nLang !== \'function\') return;\n';

for (const lang of langs) {
    const p = `tools/i18n-${lang}.json`;
    let dict = {};
    if (fs.existsSync(p)) {
        dict = JSON.parse(fs.readFileSync(p, 'utf8'));
    }
    const filled = {};
    let missing = 0;
    for (const k of keys) {
        if (dict[k] != null && String(dict[k]).trim() !== '') {
            filled[k] = dict[k];
        } else {
            filled[k] = source[k].en;
            missing++;
        }
    }
    console.log(`${lang}: ${keys.length - missing}/${keys.length} translated (${missing} fallback EN)`);
    out += `    registerI18nLang(${JSON.stringify(lang)}, ${JSON.stringify(filled)});\n`;
}

out += '})();\n';
fs.writeFileSync('i18n-extra.js', out);
console.log('wrote i18n-extra.js', (Buffer.byteLength(out) / 1024).toFixed(1) + 'KB');
