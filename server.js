const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({
    message: "Hello from ECS Fargate",
    commit: process.env.GIT_SHA || "local",
  });
});

app.get("/health", (_req, res) => res.status(200).send("ok"));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on ${PORT}`);
});