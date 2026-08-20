'use strict';

const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const APP_VERSION = process.env.APP_VERSION || 'local';

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    message: 'Hello from Express inside Docker on AWS',
    version: APP_VERSION,
    time: new Date().toISOString(),
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`listening on ${PORT} version=${APP_VERSION}`);
});

function shutdown(signal) {
  console.log(`received ${signal}, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));