# Servidor local: archivos del proyecto y la presencia real en el sitio.
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPSTREAM_BASE = 'https://www.ajedrezia.com'


def is_upstream(path):
    return path.startswith('/api/') and path.endswith('.php')


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?', 1)[0]
        print('GET ' + path, flush=True)
        if is_upstream(path):
            self.proxy(path, None)
            return
        return super().do_GET()

    def do_POST(self):
        path = self.path.split('?', 1)[0]
        length = int(self.headers.get('Content-Length', '0') or '0')
        body = self.rfile.read(length) if length else b''
        print('POST ' + path, flush=True)
        if is_upstream(path):
            self.proxy(path, body)
            return
        self.send_error(404)

    def proxy(self, path, body):
        url = UPSTREAM_BASE + path
        if '?' in self.path:
            url += '?' + self.path.split('?', 1)[1]
        try:
            if body is not None:
                req = urllib.request.Request(
                    url,
                    data=body,
                    headers={'Content-Type': 'application/json'},
                    method='POST',
                )
                resp_ctx = urllib.request.urlopen(req, timeout=20)
            else:
                resp_ctx = urllib.request.urlopen(url, timeout=20)
            with resp_ctx as resp:
                data = resp.read()
                code = resp.status
        except Exception:
            data = b'{"ok":false,"users":[]}'
            code = 502
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == '__main__':
    os.chdir(ROOT)
    server = ThreadingHTTPServer(('127.0.0.1', 8772), Handler)
    print('http://127.0.0.1:8772/', flush=True)
    server.serve_forever()
