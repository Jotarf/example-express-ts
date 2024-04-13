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
})
