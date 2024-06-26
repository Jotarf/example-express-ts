import { LoginDTO } from '../../../src/auth/dtos/login.dto'
import { HTTP_STATUS } from '../../../src/common/constants/http-codes.constants'
import { UserDTO } from '../../../src/users/dtos/user.dto'
import { userService } from '../../../src/users/user.service'
import {
  api,
  deleteAllUsers,
  getAllUsers,
  prismaClient,
  usersToCreate
} from '../users/users.util'
import * as jwt from 'jsonwebtoken'

beforeAll(async () => {
  await deleteAllUsers()
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

  test('Should throw error if email is not valid', async () => {
    const loginCredentials: LoginDTO = {
      email: 'exampleemail.com',
      password: 'wrongpassword'
    }

    const response = await api
      .post('/api/auth')
      .send(loginCredentials)
      .expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toBe('"email" must be a valid email')
    expect(response.headers['set-cookie']).not.toBeDefined()
  })

  test('Should throw error if email is empty', async () => {
    const loginCredentials: LoginDTO = {
      email: '',
      password: 'wrongpassword'
    }

    const response = await api
      .post('/api/auth')
      .send(loginCredentials)
      .expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toBe('"email" is not allowed to be empty')
    expect(response.headers['set-cookie']).not.toBeDefined()
  })

  test('Should throw error if password is empty', async () => {
    const loginCredentials: LoginDTO = {
      email: 'example@email.com',
      password: ''
    }

    const response = await api
      .post('/api/auth')
      .send(loginCredentials)
      .expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toBe('"password" is not allowed to be empty')
    expect(response.headers['set-cookie']).not.toBeDefined()
  })
})

describe('Logout user', () => {
  test('Should logout user', async () => {
    const loginCredentials: LoginDTO = {
      email: usersToCreate[0].email,
      password: usersToCreate[0].password
    }

    const loginResponse = await api
      .post('/api/auth')
      .send(loginCredentials)
      .expect(HTTP_STATUS.OK)

    expect(loginResponse.headers['set-cookie']).toBeDefined()

    const jwtCookie = loginResponse.headers['set-cookie'][0]
      .split(';')
      .find((cookie: string) => cookie.startsWith('jwt='))
    const token = jwtCookie!.split('=')[1]

    const logoutResponse = await api
      .post('/api/auth/logout')
      .set('Cookie', [`jwt=${token}`])
      .expect(HTTP_STATUS.OK)

    expect(logoutResponse.headers['set-cookie']).toBeDefined()

    const jwtCookieLogout = logoutResponse.headers['set-cookie'][0]
      .split(';')
      .find((cookie: string) => cookie.startsWith('jwt='))

    expect(jwtCookieLogout).toBe('jwt=')
  })

  test('Should not logout user without token', async () => {
    const response = await api.post('/api/auth/logout').expect(HTTP_STATUS.UNAUTHORIZED)

    expect(response.headers['set-cookie']).not.toBeDefined()
  })

  test('Should not logout user without valid', async () => {
    const response = await api
      .post('/api/auth/logout')
      .set('Cookie', ['jwt=thisisaninvalidtoken'])
      .expect(HTTP_STATUS.UNAUTHORIZED)

    expect(response.headers['set-cookie']).not.toBeDefined()
  })
})

afterAll(async () => {
  const users: UserDTO[] = (await getAllUsers()).body

  for (const user of users) await userService.deleteUser(user.id)
  await prismaClient.$disconnect()
})
