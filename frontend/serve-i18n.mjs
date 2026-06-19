import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('./dist/frontend/browser/', import.meta.url));
const LOCALES = ['es', 'en'];
const DEFAULT_LOCALE = 'es';
const API_TARGET = { host: 'localhost', port: 8080 }; // Symfony via nginx
const PORT = 4300;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain',
};

const BACKEND_PATHS = ['/api', '/uploads'];

function proxyToBackend(req, res, url) {
  const proxyReq = http.request(
    { host: API_TARGET.host, port: API_TARGET.port, method: req.method, path: url, headers: req.headers },
    (proxyRes) => { res.writeHead(proxyRes.statusCode || 502, proxyRes.headers); proxyRes.pipe(res); },
  );
  proxyReq.on('error', () => { res.writeHead(502); res.end('Bad gateway'); });
  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const url = req.url || '/';

  if (BACKEND_PATHS.some((p) => url === p || url.startsWith(`${p}/`))) {
    proxyToBackend(req, res, url);
    return;
  }

  // Root -> default locale.
  if (url === '/') {
    res.writeHead(302, { Location: `/${DEFAULT_LOCALE}/` });
    res.end();
    return;
  }

  const [, locale, ...rest] = url.split('?')[0].split('/');
  if (!LOCALES.includes(locale)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`Unknown locale. Try /${LOCALES.join('/ or /')}/`);
    return;
  }

  // Serve the requested file, or fall back to the locale's index.html (SPA routing).
  let filePath = normalize(join(ROOT, locale, decodeURIComponent(rest.join('/') || 'index.html')));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(ROOT, locale, 'index.html');
  }

  res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
  createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`i18n preview: http://localhost:${PORT}/  (locales: ${LOCALES.join(', ')}, default: ${DEFAULT_LOCALE})`);
  console.log(`API proxied to http://${API_TARGET.host}:${API_TARGET.port}`);
});
