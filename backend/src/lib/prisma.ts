import { PrismaClient } from '@prisma/client'

// Singleton pattern to prevent multiple Prisma Client instances
declare global {
  var __prisma: PrismaClient | undefined
}

// Use existing instance or create new one
const prisma = globalThis.__prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
})

// In development, save to global to prevent hot reload issues
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

export { prisma }
