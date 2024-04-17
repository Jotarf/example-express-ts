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
  const users: UserDTO[] = await prismaClient.$queryRaw`SELECT * FROM "User"`
  return {
    body: users
  }
}
