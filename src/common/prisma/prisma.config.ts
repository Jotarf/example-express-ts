import { PrismaClient } from '@prisma/client'

const prisma = null

export const getPrismaClient = () => {
  if (!prisma) {
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
  }
  return prisma
}
