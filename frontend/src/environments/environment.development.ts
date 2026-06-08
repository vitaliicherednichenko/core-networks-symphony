// Development environment.
// apiUrl is relative; `ng serve` proxies /api -> http://localhost:8080 (Symfony)
// via proxy.conf.json, avoiding CORS during local development.
export const environment = {
  production: false,
  apiUrl: '/api',
};
