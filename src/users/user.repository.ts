import { RepositoryResultDTO } from '../common/constants/dtos/repository-result.dto'
import { CreateUserDTO } from './dtos/create-user.dto'
import { UserDTO } from './dtos/user.dto'

let users: UserDTO[] = []

const createUser = async (user: CreateUserDTO): Promise<RepositoryResultDTO<null>> => {
  try {
    const result: RepositoryResultDTO<null> = await new Promise((resolve, _) => {
      users.push({ ...user, id: Math.floor(Math.random() * 100) })
      resolve({ error: false })
    })

    return result
  } catch (error) {
    return { error: true, message: 'Error creating user' }
  }
}

const getAllUsers = async (): Promise<RepositoryResultDTO<UserDTO[]>> => {
  try {
    const result: RepositoryResultDTO<UserDTO[]> = await new Promise((resolve, _) => {
      resolve({
        error: false,
        data: users
      })
    })

    return result
  } catch (error) {
    return { error: true, message: 'Error finding user' }
  }
}

const getUserById = async (
  userId: number
): Promise<RepositoryResultDTO<UserDTO | null>> => {
  try {
    const result: RepositoryResultDTO<UserDTO | null> = await new Promise(
      (resolve, _) => {
        const user: UserDTO | undefined = users.find((user) => user.id === userId)
        resolve({
          error: false,
          data: user ?? null
        })
      }
    )

    return result
  } catch (error) {
    return { error: true, message: 'Error finding user' }
  }
}

const getUserByEmail = async (
  email: string
): Promise<RepositoryResultDTO<UserDTO | null>> => {
  try {
    const result: RepositoryResultDTO<UserDTO | null> = await new Promise(
      (resolve, _) => {
        const user: UserDTO | undefined = users.find((user) => user.email === email)
        resolve({
          error: false,
          data: user ?? null
        })
      }
    )

    return result
  } catch (error) {
    return { error: true, message: 'Error finding user' }
  }
}

const updateUser = async (
  userId: number,
  updatedUser: UserDTO
): Promise<RepositoryResultDTO<null>> => {
  try {
    const result: RepositoryResultDTO<null> = await new Promise((resolve, reject) => {
      const user: UserDTO | undefined = users.find((user) => user.id === userId)

      if (!user) reject({ error: true, message: 'User not found' })

      users = users.map((user) => (user.id === userId ? updatedUser : user))

      resolve({ error: false })
    })

    return result
  } catch (error: unknown) {
    return {
      error: true,
      message: (error as RepositoryResultDTO<null>)?.message ?? "User couldn't be updated"
    }
  }
}

const deleteUser = async (userId: number): Promise<RepositoryResultDTO<null>> => {
  try {
    const result: RepositoryResultDTO<null> = await new Promise((resolve, reject) => {
      const user: UserDTO | undefined = users.find((user) => user.id === userId)

      if (!user) reject({ error: true, message: 'User not found' })

      users = users.filter((user) => user.id !== userId)

      resolve({
        error: false
      })
    })

    return result
  } catch (error: unknown) {
    return {
      error: true,
      message: (error as RepositoryResultDTO<null>)?.message ?? "User couldn't be deleted"
    }
  }
}

export const userRepository = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
}