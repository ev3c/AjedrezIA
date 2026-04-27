/**
 * Test interno: comprobar ?puzzle=3NQNh (misma lógica que applyPuzzleFromQueryString).
 *
 *   npm test
 *     → parse del query y URL de API (sin red; siempre pasa)
 *
 *   npm run test:puzzle-api
 *     → además: fetch a puzzles.php?id=3NQNh; exige 1 puzzle y mismo id
 *        (obliga a tener desplegado puzzles.php con la rama ?id= del repo)
 */
import { strict as assert } from 'node:assert';

const PUZZLE_ID = '3NQNh';
const PUZZLES_API = 'https://ajedrezia.com/puzzles/api/puzzles.php';

function testUrlQueryReception() {
    const fromFullUrl = new URL('https://www.ajedrezia.com/?puzzle=3NQNh');
    assert.equal(fromFullUrl.searchParams.get('puzzle'), PUZZLE_ID, 'URL completa: ?puzzle= debe leerse');

    const sp = new URLSearchParams(windowishSearch('?puzzle=3NQNh'));
    assert.equal(sp.get('puzzle'), PUZZLE_ID);

    const raw = sp.get('puzzle');
    const id = String(raw).trim();
    assert.equal(id, PUZZLE_ID, 'mismo criterio que applyPuzzleFromQueryString (trim)');
    console.log('[ok] recepción ?puzzle= →', JSON.stringify(id));
}

/** Sin depender de window.location: solo el string de búsqueda. */
function windowishSearch(q) {
    return q.startsWith('?') ? q.slice(1) : q;
}

function testFetchUrlEqualsApp() {
    const url = `${PUZZLES_API}?id=${encodeURIComponent(PUZZLE_ID)}`;
    assert.equal(
        url,
        'https://ajedrezia.com/puzzles/api/puzzles.php?id=3NQNh',
        'misma URL que fetchPuzzleByIdFromAPI(applyPuzzleFromQueryString)'
    );
    console.log('[ok] URL API:', url);
}

async function testApiSinglePuzzleById() {
    const url = `${PUZZLES_API}?id=${encodeURIComponent(PUZZLE_ID)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    assert.ok(res.ok, 'HTTP 2xx: ' + url);
    const data = await res.json();
    assert.ok(data && Array.isArray(data.puzzles), 'JSON: { puzzles: [] }');
    const n = data.puzzles.length;
    assert.ok(n > 0, 'al menos 1 puzzle en la respuesta');
    if (n !== 1) {
        const err = new Error(
            `API devolvió ${n} puzzles con ?id=${PUZZLE_ID}; se espera 1 (rama id en puzzles.php). ` +
                `comprueba despliegue: puzzles/api/puzzles.php debe tratar ?id= antes del listado RAND.`
        );
        err.code = 'E_API_CONTRACT';
        throw err;
    }
    assert.equal(data.puzzles[0].id, PUZZLE_ID, 'id del puzzle = id pedido');
    const p = data.puzzles[0];
    assert.ok(typeof p.fen === 'string' && p.fen.length > 10, 'FEN');
    assert.ok(Array.isArray(p.solution) && p.solution.length > 0, 'solution');
    console.log('[ok] API: 1 puzzle, id', p.id, p.title || '');
}

const runApi = process.argv.includes('--api') || process.env.PUZZLE_API_TEST === '1';

async function main() {
    testUrlQueryReception();
    testFetchUrlEqualsApp();
    if (runApi) {
        await testApiSinglePuzzleById();
    } else {
        console.log('[skip] integración API: ejecuta  npm run test:puzzle-api  (o PUZZLE_API_TEST=1 npm test)');
    }
    console.log('\npuzzle-query-internal: OK');
}

main().catch((err) => {
    console.error('\npuzzle-query-internal: FALLO\n', err.message || err);
    if (err.code === 'E_API_CONTRACT') {
        console.error('(Sugerencia) En local, la rama ?id= está en puzzles/api/puzzles.php líneas 84–106.');
    }
    process.exit(1);
});
