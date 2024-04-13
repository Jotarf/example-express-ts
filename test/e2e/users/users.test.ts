import { HTTP_STATUS } from '../../../src/common/constants/http-codes.constants'
import { CreateUserDTO } from '../../../src/users/dtos/create-user.dto'
import { userService } from '../../../src/users/user.service'
import { api, usersToCreate, getAllUsers } from './users.util'
import { UserDTO } from '../../../src/users/dtos/user.dto'

beforeEach(async () => {
  const users: UserDTO[] = (await getAllUsers()).body

  for (const user of users) {
    await userService.deleteUser(user.id)
  }

  for (const user of usersToCreate) {
    await userService.createUser(user)
  }
})

describe('Create user', () => {
  test('Should create valid user', async () => {
    const newUser: CreateUserDTO = {
      fullname: 'Patrick Davis',
      email: 'patrick@gmail.com'
    }

    await api.post('/api/users').send({ user: newUser }).expect(HTTP_STATUS.CREATED)

    const response = await getAllUsers()
    expect(response.body).toHaveLength(usersToCreate.length + 1)
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining(newUser)])
    )
  })

  test('Should not create user with invalid email', async () => {
    const newUser: CreateUserDTO = {
      fullname: 'Patrick Davis',
      email: 'patrickgmail.com'
    }

    const response = await api
      .post('/api/users')
      .send({ user: newUser })
      .expect(HTTP_STATUS.BAD_REQUEST)

    const usersResponse = await getAllUsers()
    expect(usersResponse.body).toHaveLength(usersToCreate.length)
    expect(response.body.error).toBe('"email" must be a valid email')
  })

  test('Should not create user with empty fullname', async () => {
    const newUser: CreateUserDTO = {
      fullname: '',
      email: 'patrick@gmail.com'
    }

    const response = await api
      .post('/api/users')
      .send({ user: newUser })
      .expect(HTTP_STATUS.BAD_REQUEST)

    const usersResponse = await getAllUsers()
    expect(usersResponse.body).toHaveLength(usersToCreate.length)
    expect(response.body.error).toBe('"fullname" is not allowed to be empty')
  })

  test('Should not create user with empty email', async () => {
    const newUser: CreateUserDTO = {
      fullname: 'Patrick Davis',
      email: ''
    }

    const response = await api
      .post('/api/users')
      .send({ user: newUser })
      .expect(HTTP_STATUS.BAD_REQUEST)

    const usersResponse = await getAllUsers()
    expect(usersResponse.body).toHaveLength(usersToCreate.length)
    expect(response.body.error).toBe('"email" is not allowed to be empty')
  })
})

describe('Get all users', () => {
  test('Should get all users', async () => {
    const usersWithId = usersToCreate.map((user, index) => ({ ...user, id: index + 1 }))
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
    const response = await api.get(`/api/users/id/${userId}`).expect(HTTP_STATUS.OK)

    expect(response.body).toEqual({ ...usersToCreate[0], id: userId })
  })

  test('Should throw error if user id is NaN', async () => {
    const response = await api.get('/api/users/id/abc').expect(HTTP_STATUS.BAD_REQUEST)
    expect(response.body.error).toBe('"userId" must be a number')
  })

  test('Should get specific user by email', async () => {
    const userEmail = usersToCreate[0].email
    const response = await api.get(`/api/users/email/${userEmail}`).expect(HTTP_STATUS.OK)

    expect(response.body).toEqual({ ...usersToCreate[0], id: 1 })
  })

  test('Should throw error if email is not valid', async () => {
    const response = await api.get('/api/users/email/abc').expect(HTTP_STATUS.BAD_REQUEST)
    expect(response.body.error).toBe('"email" must be a valid email')
  })

  test('Should return null if user id does not exist', async () => {
    const userId = (await getAllUsers()).body.length
    const response = await api.get(`/api/users/id/${userId + 2}`).expect(HTTP_STATUS.OK)

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

    expect(response.body.error).toBe('User not found')
  })
})
