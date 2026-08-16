const { createApp } = require('./app');      // load the routes

const port = Number(process.env.PORT || 3000); // port from env, default 3000
const app = createApp();

// 0.0.0.0 = accept traffic from outside the container (not only localhost)
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`listening on ${port}`);
});

// Docker sends SIGTERM when it stops the container. Close cleanly.
function shutdown(signal) {
  console.log(`received ${signal}`);
  server.close(() => process.exit(0));       // stop after in-flight requests finish
  setTimeout(() => process.exit(1), 10_000).unref(); // force-exit after 10s
}

process.on('SIGTERM', () => shutdown('SIGTERM')); // docker stop / compose down
process.on('SIGINT', () => shutdown('SIGINT'));   // Ctrl+C on your laptop