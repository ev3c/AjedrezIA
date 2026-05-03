const CACHE_VERSION = new URLSearchParams(self.location.search).get('v') || '3.0.4';
const CACHE_NAME = 'ajedrez-ia-v' + CACHE_VERSION;
const CACHE_PREFIX = 'ajedrez-ia-v';

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './version.js',
    './style.css',
    './app.js',
    './chess-logic.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './pieces/cburnett/wK.svg',
    './pieces/cburnett/wQ.svg',
    './pieces/cburnett/wR.svg',
    './pieces/cburnett/wB.svg',
    './pieces/cburnett/wN.svg',
    './pieces/cburnett/wP.svg',
    './pieces/cburnett/bK.svg',
    './pieces/cburnett/bQ.svg',
    './pieces/cburnett/bR.svg',
    './pieces/cburnett/bB.svg',
    './pieces/cburnett/bN.svg',
    './pieces/cburnett/bP.svg',
    './pieces/merida/wK.svg',
    './pieces/merida/wQ.svg',
    './pieces/merida/wR.svg',
    './pieces/merida/wB.svg',
    './pieces/merida/wN.svg',
    './pieces/merida/wP.svg',
    './pieces/merida/bK.svg',
    './pieces/merida/bQ.svg',
    './pieces/merida/bR.svg',
    './pieces/merida/bB.svg',
    './pieces/merida/bN.svg',
    './pieces/merida/bP.svg',
    './pieces/fantasy/wK.svg',
    './pieces/fantasy/wQ.svg',
    './pieces/fantasy/wR.svg',
    './pieces/fantasy/wB.svg',
    './pieces/fantasy/wN.svg',
    './pieces/fantasy/wP.svg',
    './pieces/fantasy/bK.svg',
    './pieces/fantasy/bQ.svg',
    './pieces/fantasy/bR.svg',
    './pieces/fantasy/bB.svg',
    './pieces/fantasy/bN.svg',
    './pieces/fantasy/bP.svg',
    './pieces/pixel/wK.svg',
    './pieces/pixel/wQ.svg',
    './pieces/pixel/wR.svg',
    './pieces/pixel/wB.svg',
    './pieces/pixel/wN.svg',
    './pieces/pixel/wP.svg',
    './pieces/pixel/bK.svg',
    './pieces/pixel/bQ.svg',
    './pieces/pixel/bR.svg',
    './pieces/pixel/bB.svg',
    './pieces/pixel/bN.svg',
    './pieces/pixel/bP.svg',
    './pieces/letter/wK.svg',
    './pieces/letter/wQ.svg',
    './pieces/letter/wR.svg',
    './pieces/letter/wB.svg',
    './pieces/letter/wN.svg',
    './pieces/letter/wP.svg',
    './pieces/letter/bK.svg',
    './pieces/letter/bQ.svg',
    './pieces/letter/bR.svg',
    './pieces/letter/bB.svg',
    './pieces/letter/bN.svg',
    './pieces/letter/bP.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            // Forzamos red sin caché HTTP al cachear los assets en la instalación
            // para que un SW antiguo o un proxy/CDN no devuelva versiones obsoletas.
            .then(cache => cache.addAll(
                ASSETS_TO_CACHE.map(url => new Request(url, { cache: 'reload' }))
            ))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                // Borramos TODAS las cachés antiguas (cualquier nombre con
                // el prefijo ajedrez-ia-v* o cualquier otra) para que las
                // versiones anteriores instaladas como PWA queden limpias.
                keys
                    .filter(k => k !== CACHE_NAME)
                    .map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Recursos externos: red con fallback a caché
    if (url.origin !== location.origin) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    // Navegación (index.html / ./): SIEMPRE red sin caché HTTP para recibir la versión más reciente.
    // Esto garantiza que cualquier visita a www.ajedrezia.com obtenga el index.html nuevo
    // (con la última APP_VERSION) aunque el SW esté instalado desde versiones antiguas.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(new Request(event.request, { cache: 'no-store' }))
                .then(response => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // version.js, sw.js, manifest.json: red obligatoria sin caché HTTP para detectar cambios al instante
    if (url.pathname.endsWith('/version.js') || url.pathname.endsWith('/sw.js') || url.pathname.endsWith('/manifest.json')) {
        event.respondWith(
            fetch(new Request(event.request, { cache: 'no-store' }))
                .then(response => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Resto de recursos del mismo origen: red primero, caché como fallback
    event.respondWith(
        fetch(event.request).then(response => {
            if (response && response.status === 200) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
        }).catch(() => caches.match(event.request))
    );
});
