import { PrismaClient } from '@prisma/client'

const prisma = null

export const getPrismaClient = () => {
  if (!prisma) {
    return new PrismaClient()
  }
  return prisma
}
