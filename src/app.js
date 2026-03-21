const express = require("express");
const cors = require("cors");
const path = require("path");
const feedbackRoutes = require("./routes/feedback");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());

app.use("/api", feedbackRoutes);

const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: "Internal server error" });
});

module.exports = app;

