const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint — used to verify deployments quickly.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.get("/", (_req, res) => {
  res.send(`Hello from Adnan on EC2! Version: ${process.env.APP_VERSION || "dev"}`);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});