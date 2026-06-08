// Production environment.
// apiUrl is relative so the SPA calls the same origin that serves it
// (configure your web server / reverse proxy to route /api to Symfony).
export const environment = {
  production: true,
  apiUrl: '/api',
};
