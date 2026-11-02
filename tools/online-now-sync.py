# Copia la lista real de conectados para la vista local.
import os
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(ROOT, 'api', 'online-now.json')
UPSTREAM = 'https://www.ajedrezia.com/api/get-users.php'


def once():
    with urllib.request.urlopen(UPSTREAM, timeout=20) as resp:
        data = resp.read()
    tmp = DEST + '.tmp'
    with open(tmp, 'wb') as handle:
        handle.write(data)
    os.replace(tmp, DEST)
    print('online-now ' + str(len(data)), flush=True)


if __name__ == '__main__':
    while True:
        try:
            once()
        except Exception as exc:
            print('online-now error ' + str(exc), flush=True)
        time.sleep(5)
