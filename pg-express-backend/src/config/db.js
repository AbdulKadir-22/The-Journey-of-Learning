const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set.');
}

const adapter = new PrismaPg({
  connectionString,
});

// Initialize Prisma Client
const prisma = new PrismaClient({
  adapter,
  errorFormat: 'minimal',
});
module.exports = prisma;
