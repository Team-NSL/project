const { PrismaClient } = require("@prisma/client");

// Single Prisma instance for the whole app lifecycle.
const prisma = new PrismaClient();

module.exports = prisma;

