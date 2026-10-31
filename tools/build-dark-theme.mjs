// Genera theme-dark.css a partir de style.css.
// Cada regla con propiedades de color/fondo/borde se duplica bajo html[data-theme="dark"] con los colores
// transformados: fondos claros -> oscuros, textos oscuros -> claros, bordes claros -> oscuros.
// Se reemiten también las declaraciones sin cambios para conservar la especificidad relativa
// entre reglas (p. ej. .tab vs .tab.active).
// Uso: node tools/build-dark-theme.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'style.css');
const OUT = path.join(ROOT, 'theme-dark.css');
const PREFIX = 'html[data-theme="dark"]';

const EXCLUDE = [
    '.square', '.board-theme', '.piece', 'eval-bar', '.chess-board', '.fhalf',
    'share-app-circle', 'login-btn-google', 'promotion-piece', '.board-3d',
];

const TOKENS = `${PREFIX} {
    color-scheme: dark;
    --color-bg: #0f1115;
    --color-surface: #1a1d23;
    --color-surface-2: #242830;
    --color-border: #2e333d;
    --color-border-strong: #3d4350;
    --color-text: #e5e7eb;
    --color-text-2: #d1d5db;
    --color-text-muted: #9ca3af;

    --accent: #818cf8;
    --accent-strong: #6366f1;
    --accent-ink: #c7d2fe;
    --accent-soft: #25284a;
    --accent-soft-2: #2f3360;
    --accent-border: #3f4590;
    --accent-rgb: 129, 140, 248;

    --success-ink: #86efac;
    --success-soft: #14301f;
    --success-border: #1f5a35;
    --danger-ink: #fca5a5;
    --danger-soft: #3a1717;
    --danger-border: #7f2525;
    --warning-ink: #fcd34d;
    --warning-soft: #3a2e10;

    --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.45);
    --shadow-2: 0 4px 12px rgba(0, 0, 0, 0.5);
    --shadow-3: 0 20px 60px rgba(0, 0, 0, 0.65);
}
`;

// ---------- Parser CSS mínimo ----------
function stripComments(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function parseBlock(css, start = 0) {
    const nodes = [];
    let i = start;
    let buf = '';
    let quote = null;
    while (i < css.length) {
        const ch = css[i];
        if (quote) {
            buf += ch;
            if (ch === quote && css[i - 1] !== '\\') quote = null;
            i++;
            continue;
        }
        if (ch === '"' || ch === "'") { quote = ch; buf += ch; i++; continue; }
        if (ch === '{') {
            const prelude = buf.trim();
            buf = '';
            if (prelude.startsWith('@media') || prelude.startsWith('@supports') || prelude.startsWith('@layer')) {
                const res = parseBlock(css, i + 1);
                nodes.push({ type: 'at', prelude, children: res.nodes });
                i = res.end + 1;
            } else {
                const end = findClose(css, i + 1);
                const body = css.slice(i + 1, end);
                if (!prelude.startsWith('@')) nodes.push({ type: 'rule', selector: prelude, body });
                i = end + 1;
            }
            continue;
        }
        if (ch === '}') return { nodes, end: i };
        if (ch === ';') { buf = ''; i++; continue; }
        buf += ch;
        i++;
    }
    return { nodes, end: i };
}

function findClose(css, i) {
    let depth = 1;
    let quote = null;
    for (; i < css.length; i++) {
        const ch = css[i];
        if (quote) { if (ch === quote && css[i - 1] !== '\\') quote = null; continue; }
        if (ch === '"' || ch === "'") { quote = ch; continue; }
        if (ch === '{') depth++;
        else if (ch === '}' && --depth === 0) return i;
    }
    return css.length;
}

function splitTop(str, sep) {
    const out = [];
    let depth = 0, quote = null, cur = '';
    for (const ch of str) {
        if (quote) { cur += ch; if (ch === quote) quote = null; continue; }
        if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
        if (ch === '(') depth++;
        if (ch === ')') depth--;
        if (ch === sep && depth === 0) { out.push(cur); cur = ''; continue; }
        cur += ch;
    }
    if (cur.trim()) out.push(cur);
    return out;
}

// ---------- Colores ----------
const NAMED = { white: [255, 255, 255], black: [0, 0, 0] };
const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)|\b(?:white|black)\b/g;

function parseColor(tok) {
    if (tok[0] === '#') {
        let h = tok.slice(1);
        if (h.length === 3 || h.length === 4) h = h.split('').map(c => c + c).join('');
        if (h.length !== 6 && h.length !== 8) return null;
        const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
        return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a };
    }
    if (NAMED[tok.toLowerCase()]) {
        const [r, g, b] = NAMED[tok.toLowerCase()];
        return { r, g, b, a: 1 };
    }
    const m = tok.match(/[\d.]+/g).map(Number);
    return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 };
}

function toHsl({ r, g, b }) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return { h: h / 6, s, l };
}

function fromHsl({ h, s, l }) {
    if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const f = t => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    return { r: Math.round(f(h + 1 / 3) * 255), g: Math.round(f(h) * 255), b: Math.round(f(h - 1 / 3) * 255) };
}

function fmt({ r, g, b }, a) {
    if (a >= 1) return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    return `rgba(${r}, ${g}, ${b}, ${+a.toFixed(3)})`;
}

const MAP = {
    bg(hsl) {
        if (hsl.l >= 0.7) return { h: hsl.h, s: hsl.s * 0.45, l: 0.12 + (1 - hsl.l) * 0.5 };
        return null;
    },
    text(hsl) {
        if (hsl.l <= 0.4) return { h: hsl.h, s: hsl.s, l: 0.93 - hsl.l * 0.45 };
        if (hsl.l <= 0.55 && hsl.s < 0.2) return { h: hsl.h, s: hsl.s, l: 0.68 };
        if (hsl.l < 0.55) return { h: hsl.h, s: hsl.s, l: 0.72 };
        return null;
    },
    border(hsl) {
        if (hsl.l >= 0.7) return { h: hsl.h, s: hsl.s * 0.5, l: 0.2 + (1 - hsl.l) * 0.5 };
        return null;
    },
};

function mapValue(value, role) {
    if (/url\(/i.test(value)) return value;
    return value.replace(COLOR_RE, tok => {
        const c = parseColor(tok);
        if (!c) return tok;
        const mapped = MAP[role](toHsl(c));
        return mapped ? fmt(fromHsl(mapped), c.a) : tok;
    });
}

function roleOf(prop) {
    if (prop === 'color' || prop === 'caret-color' || prop === 'fill' || prop === 'stroke' || prop === 'text-decoration-color' || prop === '-webkit-text-fill-color') return 'text';
    if (prop === 'background' || prop === 'background-color' || prop === 'background-image' || prop === 'scrollbar-color') return 'bg';
    if (/radius|collapse|spacing|width|style$|image/.test(prop)) return null;
    if (prop.startsWith('border') || prop === 'outline' || prop === 'outline-color' || prop === 'column-rule-color') return 'border';
    return null;
}

function firstBgLightness(decls) {
    for (const d of decls) {
        if (d.role !== 'bg') continue;
        const m = d.mapped.match(COLOR_RE);
        if (!m) continue;
        const c = parseColor(m[0]);
        if (c && c.a > 0.5) return toHsl(c).l;
    }
    return null;
}

// ---------- Transformación ----------
function prefixSelector(sel) {
    const parts = splitTop(sel, ',').map(s => s.trim()).filter(Boolean);
    const out = [];
    for (const p of parts) {
        if (p.startsWith(':root')) continue;
        if (/^html\b/.test(p)) out.push(p.replace(/^html/, PREFIX));
        else out.push(`${PREFIX} ${p}`);
    }
    return out.join(',\n');
}

function transformRule(node) {
    if (EXCLUDE.some(x => node.selector.includes(x))) return null;
    const decls = [];
    for (const raw of splitTop(node.body, ';')) {
        const idx = raw.indexOf(':');
        if (idx < 0) continue;
        const prop = raw.slice(0, idx).trim().toLowerCase();
        const value = raw.slice(idx + 1).trim();
        const role = roleOf(prop);
        if (!role) continue;
        decls.push({ prop, value, role, mapped: role === 'text' ? value : mapValue(value, role) });
    }
    if (!decls.length) return null;

    const bgL = firstBgLightness(decls);
    const keepText = bgL != null && bgL > 0.55;
    for (const d of decls) {
        if (d.role === 'text' && !keepText) d.mapped = mapValue(d.value, 'text');
    }
    const selector = prefixSelector(node.selector);
    if (!selector) return null;
    return `${selector} {\n${decls.map(d => `    ${d.prop}: ${d.mapped};`).join('\n')}\n}`;
}

function transform(nodes, indent = '') {
    const out = [];
    for (const n of nodes) {
        if (n.type === 'rule') {
            const r = transformRule(n);
            if (r) out.push(r);
        } else if (n.type === 'at') {
            const inner = transform(n.children);
            if (inner.length) out.push(`${n.prelude} {\n${inner.join('\n\n').replace(/^/gm, '    ')}\n}`);
        }
    }
    return out;
}

const css = stripComments(fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n'));
const { nodes } = parseBlock(css);
const rules = transform(nodes);
const EXTRA = fs.existsSync(path.join(ROOT, 'tools', 'theme-dark-extra.css'))
    ? fs.readFileSync(path.join(ROOT, 'tools', 'theme-dark-extra.css'), 'utf8')
    : '';
const header = '/* Generado por tools/build-dark-theme.mjs a partir de style.css. No editar a mano:\n   los ajustes manuales van en tools/theme-dark-extra.css. */\n\n';
fs.writeFileSync(OUT, header + TOKENS + '\n' + rules.join('\n\n') + '\n' + (EXTRA ? '\n' + EXTRA : ''));
console.log(`theme-dark.css: ${rules.length} reglas, ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
