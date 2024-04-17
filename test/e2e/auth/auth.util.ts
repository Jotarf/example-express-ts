import { app } from '../../../src/app'
import supertest from 'supertest'
import { getPrismaClient } from '../../../src/common/prisma/prisma.config'
import { LoginDTO } from '../../../src/auth/dtos/login.dto'

export const api = supertest(app)
export const prismaClient = getPrismaClient()

export const authenticateUser = async (loginCredentials: LoginDTO) => {
  const response = await api.post('/api/auth').send(loginCredentials)
  const jwtCookie = response.headers['set-cookie'][0]
    .split(';')
    .find((cookie: string) => cookie.startsWith('jwt='))
  const token = jwtCookie!.split('=')[1]

  return token
}
