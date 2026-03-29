const express = require("express");
const cors = require("cors");
const path = require("path");
const prisma = require("./prisma");
const feedbackRoutes = require("./routes/feedback");

function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());

app.use("/api", feedbackRoutes);

const publicDir = path.join(__dirname, "..", "public");

app.get("/", async (req, res) => {
  try {
    const rows = await prisma.feedback.findMany({
      orderBy: { id: "desc" },
      take: 500,
    });

    const rowsHtml = rows
      .map(
        (r) => `<tr>
  <td>${r.id}</td>
  <td>${escapeHtml(r.name)}</td>
  <td>${escapeHtml(r.email)}</td>
  <td>${escapeHtml(r.message)}</td>
  <td>${escapeHtml(r.createdAt?.toISOString?.() ?? r.createdAt)}</td>
  <td>${escapeHtml(r.telegramStatus)}</td>
  <td>${escapeHtml(r.telegramMessageId)}</td>
</tr>`
      )
      .join("\n");

    res.type("html").send(`<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>История обращений</title>
<style>
body{font-family:Arial,sans-serif;margin:24px;}
h1{font-size:1.35rem;}
a{color:#0d6efd;}
table{border-collapse:collapse;width:100%;margin-top:16px;}
th,td{border:1px solid #ccc;padding:8px;text-align:left;vertical-align:top;font-size:14px;}
th{background:#f5f5f5;}
.wrap{overflow-x:auto;}
</style>
</head>
<body>
<p><a href="/form">Новое обращение</a></p>
<h1>История обращений (${rows.length})</h1>
<div class="wrap">
<table>
<thead><tr>
<th>id</th><th>Имя</th><th>Почта</th><th>Сообщение</th><th>Создано</th><th>TG</th><th>msg id</th>
</tr></thead>
<tbody>
${rowsHtml || "<tr><td colspan=\"7\">Пока нет записей</td></tr>"}
</tbody>
</table>
</div>
</body>
</html>`);
  } catch (err) {
    console.error(err);
    res.status(500).type("html").send(
      "<!doctype html><html><body><p>Не удалось загрузить историю. Проверьте DATABASE_URL и логи сервиса.</p></body></html>"
    );
  }
});

app.get("/form", (req, res) => {
  res.sendFile(path.join(publicDir, "form.html"));
});

app.use(express.static(publicDir));

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
