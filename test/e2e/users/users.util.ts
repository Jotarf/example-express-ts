import { app } from '../../../src/app'
import supertest from 'supertest'
import { CreateUserDTO } from '../../../src/users/dtos/create-user.dto'
import { getPrismaClient } from '../../../src/common/prisma/prisma.config'
import { UserDTO } from '../../../src/users/dtos/user.dto'

export const api = supertest(app)
export const prismaClient = getPrismaClient()

export const usersToCreate: CreateUserDTO[] = [
  {
    fullname: 'John Dulp',
    email: 'john@gmail.com',
    password: 'password123'
  },
  {
    fullname: 'Matt Murdock',
    email: 'matt@gmail.com',
    password: 'password124'
  },
  {
    fullname: 'Harry Jones',
    email: 'harry@gmail.com',
    password: 'password125'
  }
]

export const getAllUsers = async () => {
  const users: UserDTO[] = await prismaClient.user.findMany({
    select: {
      email: true,
      fullname: true,
      id: true
    }
  })
  return {
    body: users
  }
}

export const deleteAllUsers = async () => {
  await prismaClient.$queryRaw`DELETE FROM "User"`
  await prismaClient.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`
}
