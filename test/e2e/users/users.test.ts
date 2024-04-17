import { HTTP_STATUS } from '../../../src/common/constants/http-codes.constants'
import { CreateUserDTO } from '../../../src/users/dtos/create-user.dto'
import { userService } from '../../../src/users/user.service'
import { api, usersToCreate, getAllUsers, prismaClient } from './users.util'
import { UserDTO } from '../../../src/users/dtos/user.dto'
import { authenticateUser } from '../auth/auth.util'

beforeEach(async () => {
  const users: UserDTO[] = (await getAllUsers()).body

  for (const user of users) await userService.deleteUser(user.id)

  await prismaClient.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`

  for (const user of usersToCreate) {
    await userService.createUser(user)
  }
})

describe('Create user', () => {
  test('Should create valid user', async () => {
    const newUser: CreateUserDTO = {
      fullname: 'Patrick Davis',
      email: 'patrick@gmail.com',
      password: 'password126'
    }

    await api.post('/api/users').send(newUser).expect(HTTP_STATUS.CREATED)

    const { password, ...userWithoutPassword } = newUser

    const response = await getAllUsers()
    expect(response.body).toHaveLength(usersToCreate.length + 1)
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining(userWithoutPassword)])
    )
  })

  test('Should not create user with invalid email', async () => {
    const newUser: CreateUserDTO = {
      fullname: 'Patrick Davis',
      email: 'patrickgmail.com',
      password: 'password126'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(HTTP_STATUS.BAD_REQUEST)

    const usersResponse = await getAllUsers()
    expect(usersResponse.body).toHaveLength(usersToCreate.length)
    expect(response.body.error).toBe('"email" must be a valid email')
  })

  test('Should not create user with empty fullname', async () => {
    const newUser: CreateUserDTO = {
      fullname: '',
      email: 'patrick@gmail.com',
      password: 'password126'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(HTTP_STATUS.BAD_REQUEST)

    const usersResponse = await getAllUsers()
    expect(usersResponse.body).toHaveLength(usersToCreate.length)
    expect(response.body.error).toBe('"fullname" is not allowed to be empty')
  })

  test('Should not create user with empty email', async () => {
    const newUser: CreateUserDTO = {
      fullname: 'Patrick Davis',
      email: '',
      password: 'password126'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(HTTP_STATUS.BAD_REQUEST)

    const usersResponse = await getAllUsers()
    expect(usersResponse.body).toHaveLength(usersToCreate.length)
    expect(response.body.error).toBe('"email" is not allowed to be empty')
  })

  test('Should not create user with empty password', async () => {
    const newUser: CreateUserDTO = {
      fullname: 'Patrick Davis',
      email: 'patrick@gmail.com',
      password: ''
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(HTTP_STATUS.BAD_REQUEST)

    const usersResponse = await getAllUsers()
    expect(usersResponse.body).toHaveLength(usersToCreate.length)
    expect(response.body.error).toBe('"password" is not allowed to be empty')
  })
})

describe('Get all users', () => {
  test('Should get all users', async () => {
    const usersWithId = usersToCreate.map((user, index) => ({
      id: index + 1,
      fullname: user.fullname,
      email: user.email
    }))
    const response = await api.get('/api/users').expect(HTTP_STATUS.OK)

    expect(response.body).toHaveLength(usersToCreate.length)
    expect(response.body).toEqual(usersWithId)
  })

  test('Should get empty array if there are no users', async () => {
    const usersToDelete: UserDTO[] = (await getAllUsers()).body

    for (const user of usersToDelete) {
      await userService.deleteUser(user.id)
    }

    const response = await api.get('/api/users').expect(HTTP_STATUS.OK)
    expect(response.body).toHaveLength(0)
    expect(response.body).toEqual([])
  })
})

describe('Get specific user', () => {
  test('Should get specific user by id', async () => {
    const userId = 1
    const jwtToken = await authenticateUser({
      email: usersToCreate[0].email,
      password: usersToCreate[0].password
    })
    const response = await api
      .get(`/api/users/id/${userId}`)
      .set('Cookie', [`jwt=${jwtToken}`])
      .expect(HTTP_STATUS.OK)

    const user = {
      id: userId,
      fullname: usersToCreate[0].fullname,
      email: usersToCreate[0].email
    }

    expect(response.body).toEqual(user)
  })

  test('Should throw error if user id is NaN', async () => {
    const response = await api.get('/api/users/id/abc').expect(HTTP_STATUS.BAD_REQUEST)
    expect(response.body.error).toBe('"userId" must be a number')
  })

  test('Should get specific user by email', async () => {
    const userEmail = usersToCreate[0].email
    const response = await api.get(`/api/users/email/${userEmail}`).expect(HTTP_STATUS.OK)

    const user = {
      id: 1,
      fullname: usersToCreate[0].fullname,
      email: userEmail
    }

    expect(response.body).toEqual(user)
  })

  test('Should throw error if email is not valid', async () => {
    const response = await api.get('/api/users/email/abc').expect(HTTP_STATUS.BAD_REQUEST)
    expect(response.body.error).toBe('"email" must be a valid email')
  })

  test('Should return null if user id does not exist', async () => {
    const userId = (await getAllUsers()).body.length
    const jwtToken = await authenticateUser({
      email: usersToCreate[0].email,
      password: usersToCreate[0].password
    })
    const response = await api
      .get(`/api/users/id/${userId + 2}`)
      .set('Cookie', [`jwt=${jwtToken}`])
      .expect(HTTP_STATUS.OK)

    expect(response.body).toBe(null)
  })

  test('Should return null if user email does not exist', async () => {
    const userEmail = 'abcd@email.com'
    const response = await api.get(`/api/users/email/${userEmail}`).expect(HTTP_STATUS.OK)

    expect(response.body).toBe(null)
  })
})

describe('Delete user', () => {
  test('Should delete user', async () => {
    const users: UserDTO[] = (await getAllUsers()).body
    const userToDelete: UserDTO = users[0]

    await api.delete(`/api/users/${userToDelete.id}`).expect(HTTP_STATUS.OK)

    const usersAfterDeletion: UserDTO[] = (await getAllUsers()).body

    expect(usersAfterDeletion).toHaveLength(users.length - 1)
    expect(usersAfterDeletion).toEqual(
      users.filter((user) => user.id !== userToDelete.id)
    )
  })

  test('Should not delete user if id is invalid', async () => {
    const response = await api.delete('/api/users/abc').expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toBe('"userId" must be a number')
  })

  test('Should throw error if user does not exist', async () => {
    const userId = (await getAllUsers()).body.length
    const response = await api
      .delete(`/api/users/${userId + 2}`)
      .expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toBe('Record to delete does not exist.')
  })
})

describe('Update user', () => {
  test('Should update user email', async () => {
    const users: UserDTO[] = (await getAllUsers()).body
    const userToUpdate: UserDTO = {
      id: users[0].id,
      fullname: users[0].fullname,
      email: users[0].email
    }
    userToUpdate.email = 'updated@email.com'

    const response = await api
      .put(`/api/users/${userToUpdate.id}`)
      .send(userToUpdate)
      .expect(HTTP_STATUS.OK)

    const usersAfterUpdate: UserDTO[] = (await getAllUsers()).body

    expect(usersAfterUpdate).toHaveLength(users.length)
    expect(usersAfterUpdate).toEqual(
      expect.arrayContaining([expect.objectContaining(userToUpdate)])
    )
    expect(usersAfterUpdate).not.toEqual(users)
    expect(response.body).toEqual({})
  })

  test('Should update user fullname', async () => {
    const users: UserDTO[] = (await getAllUsers()).body
    const userToUpdate: UserDTO = {
      id: users[0].id,
      fullname: users[0].fullname,
      email: users[0].email
    }

    userToUpdate.fullname = 'Updated Name'

    const response = await api
      .put(`/api/users/${userToUpdate.id}`)
      .send(userToUpdate)
      .expect(HTTP_STATUS.OK)

    const usersAfterUpdate: UserDTO[] = (await getAllUsers()).body

    expect(usersAfterUpdate).toHaveLength(users.length)
    expect(usersAfterUpdate).toEqual(
      expect.arrayContaining([expect.objectContaining(userToUpdate)])
    )
    expect(usersAfterUpdate).not.toEqual(users)
    expect(response.body).toEqual({})
  })

  test('Should not update user if id is invalid', async () => {
    const response = await api.put('/api/users/abc').expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toBe('"userId" must be a number')
  })

  test('Should not update user if email is empty', async () => {
    const users: UserDTO[] = (await getAllUsers()).body
    const userToUpdate: UserDTO = structuredClone(users[0])
    userToUpdate.email = ''

    const response = await api
      .put(`/api/users/${userToUpdate.id}`)
      .send(userToUpdate)
      .expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toEqual('"email" is not allowed to be empty')
  })

  test('Should not update user if fullname is empty', async () => {
    const users: UserDTO[] = (await getAllUsers()).body
    const userToUpdate: UserDTO = structuredClone(users[0])
    userToUpdate.fullname = ''

    const response = await api
      .put(`/api/users/${userToUpdate.id}`)
      .send(userToUpdate)
      .expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toEqual('"fullname" is not allowed to be empty')
  })

  test('Should not update user if email is invalid', async () => {
    const users: UserDTO[] = (await getAllUsers()).body
    const userToUpdate: UserDTO = structuredClone(users[0])
    userToUpdate.email = 'email.com'

    const response = await api
      .put(`/api/users/${userToUpdate.id}`)
      .send(userToUpdate)
      .expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toEqual('"email" must be a valid email')
  })

  test('Should throw error if user does not exist', async () => {
    const users: UserDTO[] = (await getAllUsers()).body
    const userToUpdate: UserDTO = structuredClone(users[0])
    const nonExistentUserId = users.length + 2

    const response = await api
      .put(`/api/users/${nonExistentUserId}`)
      .send(userToUpdate)
      .expect(HTTP_STATUS.BAD_REQUEST)

    expect(response.body.error).toBe('Record to update not found.')
  })
})

afterAll(async () => {
  const users: UserDTO[] = (await getAllUsers()).body

  for (const user of users) await userService.deleteUser(user.id)
  await prismaClient.$disconnect()
})
