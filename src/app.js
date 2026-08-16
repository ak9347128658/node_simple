const express = require('express');          // load the web framework

function createApp() {
  const app = express();                     // create an empty HTTP app

  app.disable('x-powered-by');               // hide "Express" from response headers
  app.use(express.json({ limit: '100kb' })); // parse small JSON request bodies

  // GET /  — app name, environment, version (useful to see what is running)
  app.get('/', (req, res) => {
    res.json({
      name: 'nodejs-simple',
      env: process.env.NODE_ENV || 'development',
      version: process.env.APP_VERSION || 'local',
    });
  });

  // GET /health  — used by Docker and GitHub Actions: "is the process alive?"
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // GET /hello/world  — example route with a URL parameter
  app.get('/hello/:name', (req, res) => {
    res.json({ message: `hello ${req.params.name}` });
  });

  // any other URL  — return 404 JSON instead of an HTML error page
  app.use((req, res) => {
    res.status(404).json({ error: 'not_found' });
  });

  return app;                                // give the app to server.js or to tests
}

module.exports = { createApp };              // make createApp() importable