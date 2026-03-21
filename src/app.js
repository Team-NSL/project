const express = require("express");
const cors = require("cors");
const path = require("path");
const feedbackRoutes = require("./routes/feedback");

const app = express();

app.use(express.json({ limit: "1mb" }));

// Allow frontend (different origin) to call the API.
// If you know your frontend domain, you can restrict origins later.
app.use(cors());

app.use("/api", feedbackRoutes);

// Static frontend (plain HTML) served from the same Railway app.
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Basic error handler for unexpected issues.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: "Internal server error" });
});

module.exports = app;

