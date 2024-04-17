import { LoginDTO } from '../../../src/auth/dtos/login.dto'
import { HTTP_STATUS } from '../../../src/common/constants/http-codes.constants'
import { UserDTO } from '../../../src/users/dtos/user.dto'
import { userService } from '../../../src/users/user.service'
import { api, getAllUsers, prismaClient, usersToCreate } from '../users/users.util'
import * as jwt from 'jsonwebtoken'

beforeAll(async () => {
  const users: UserDTO[] = (await getAllUsers()).body

  for (const user of users) await userService.deleteUser(user.id)

  await prismaClient.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`

  await userService.createUser(usersToCreate[0])
})

describe('Auth User', () => {
  test('Should authenticate user', async () => {
    const users = (await getAllUsers()).body

    const loginCredentials: LoginDTO = {
      email: usersToCreate[0].email,
      password: usersToCreate[0].password
    }

    const response = await api
      .post('/api/auth')
      .send(loginCredentials)
      .expect(HTTP_STATUS.OK)

    expect(response.body).toEqual(users[0])
    expect(response.headers['set-cookie']).toBeDefined()

    const jwtCookie = response.headers['set-cookie'][0]
      .split(';')
      .find((cookie: string) => cookie.startsWith('jwt='))
    const token = jwtCookie!.split('=')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string)

    expect(decodedToken).toBeDefined()
  })

  test('Should not authenticate user with wrong password', async () => {
    const loginCredentials: LoginDTO = {
      email: usersToCreate[0].email,
      password: 'wrongpassword'
    }

    const response = await api
      .post('/api/auth')
      .send(loginCredentials)
      .expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toBe('User or password incorrect')
    expect(response.headers['set-cookie']).not.toBeDefined()
  })

  test('Should not authenticate non existent user', async () => {
    const loginCredentials: LoginDTO = {
      email: 'dontexist@email.com',
      password: 'wrongpassword'
    }

    const response = await api
      .post('/api/auth')
      .send(loginCredentials)
      .expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toBe('User or password incorrect')
    expect(response.headers['set-cookie']).not.toBeDefined()
  })
})

afterAll(async () => {
  const users: UserDTO[] = (await getAllUsers()).body

  for (const user of users) await userService.deleteUser(user.id)
  await prismaClient.$disconnect()
})
