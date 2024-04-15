import { app } from '../../../src/app'
import supertest from 'supertest'
import { CreateUserDTO } from '../../../src/users/dtos/create-user.dto'
import { getPrismaClient } from '../../../src/common/prisma/prisma.config'

export const api = supertest(app)
export const prismaClient = getPrismaClient()

export const usersToCreate: CreateUserDTO[] = [
  {
    fullname: 'John Dulp',
    email: 'john@gmail.com'
  },
  {
    fullname: 'Matt Murdock',
    email: 'matt@gmail.com'
  },
  {
    fullname: 'Harry Jones',
    email: 'harry@gmail.com'
  }
]

export const getAllUsers = async () => {
  const response = await api.get('/api/users')
  return {
    body: response.body
  }
}
