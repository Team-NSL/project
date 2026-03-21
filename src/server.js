require("dotenv").config();

const app = require("./app");
const prisma = require("./prisma");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  // Connect early so deployment fails fast if DB is misconfigured.
  await prisma.$connect();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

