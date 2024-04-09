import { RepositoryResultDTO } from '../common/constants/dtos/repository-result.dto'
import { CreateUserDTO } from './dtos/create-user.dto'
import { UserDTO } from './dtos/user.dto'
import { userRepository } from './user.repository'

const createUser = async (user: CreateUserDTO): Promise<RepositoryResultDTO<null>> => {
  try {
    const result = await userRepository.createUser(user)
    return result
  } catch (error: unknown) {
    return error as RepositoryResultDTO<null>
  }
}

const getAllUsers = async (): Promise<RepositoryResultDTO<UserDTO[]>> => {
  try {
    const result = await userRepository.getAllUsers()
    return result
  } catch (error: unknown) {
    return error as RepositoryResultDTO<UserDTO[]>
  }
}

const getUserById = async (
  userId: number
): Promise<RepositoryResultDTO<UserDTO | null>> => {
  try {
    const result = await userRepository.getUserById(userId)
    return result
  } catch (error: unknown) {
    return error as RepositoryResultDTO<null>
  }
}

const getUserByEmail = async (
  email: string
): Promise<RepositoryResultDTO<UserDTO | null>> => {
  try {
    const result = await userRepository.getUserByEmail(email)
    return result
  } catch (error: unknown) {
    return error as RepositoryResultDTO<null>
  }
}

const updateUser = async (
  userId: number,
  user: UserDTO
): Promise<RepositoryResultDTO<null>> => {
  try {
    const result = await userRepository.updateUser(userId, user)
    return result
  } catch (error: unknown) {
    return error as RepositoryResultDTO<null>
  }
}

const deleteUser = async (userId: number): Promise<RepositoryResultDTO<null>> => {
  try {
    const result = await userRepository.deleteUser(userId)
    return result
  } catch (error: unknown) {
    return error as RepositoryResultDTO<null>
  }
}

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
}
