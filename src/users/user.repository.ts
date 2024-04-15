import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { RepositoryResultDTO } from '../common/constants/dtos/repository-result.dto'
import { getPrismaClient } from '../common/prisma/prisma.config'
import { CreateUserDTO } from './dtos/create-user.dto'
import { UserDTO } from './dtos/user.dto'

const prismaClient = getPrismaClient()

let users: UserDTO[] = []

const createUser = async (user: CreateUserDTO): Promise<RepositoryResultDTO<null>> => {
  try {
    await prismaClient.user.create({
      data: {
        email: user.email,
        fullname: user.fullname
      }
    })

    const result: RepositoryResultDTO<null> = { error: false }

    return result
  } catch (error) {
    return { error: true, message: 'Error creating user' }
  }
}

const getAllUsers = async (): Promise<RepositoryResultDTO<UserDTO[]>> => {
  try {
    const users: UserDTO[] = await prismaClient.user.findMany()

    const result: RepositoryResultDTO<UserDTO[]> = {
      error: false,
      data: users
    }

    return result
  } catch (error) {
    return { error: true, message: 'Error finding users' }
  }
}

const getUserById = async (
  userId: number
): Promise<RepositoryResultDTO<UserDTO | null>> => {
  try {
    const user: UserDTO | null = await prismaClient.user.findUnique({
      where: {
        id: userId
      }
    })

    const result: RepositoryResultDTO<UserDTO | null> = {
      error: false,
      data: user ?? null
    }

    return result
  } catch (error) {
    return { error: true, message: 'Error finding user by id' }
  }
}

const getUserByEmail = async (
  email: string
): Promise<RepositoryResultDTO<UserDTO | null>> => {
  try {
    const user: UserDTO | null = await prismaClient.user.findUnique({
      where: {
        email: email
      }
    })

    const result: RepositoryResultDTO<UserDTO | null> = {
      error: false,
      data: user ?? null
    }

    return result
  } catch (error) {
    return { error: true, message: 'Error finding user by email' }
  }
}

const updateUser = async (
  userId: number,
  updatedUser: UserDTO
): Promise<RepositoryResultDTO<null>> => {
  try {
    await prismaClient.user.update({
      data: {
        email: updatedUser.email,
        fullname: updatedUser.fullname
      },
      where: {
        id: userId
      }
    })

    const result: RepositoryResultDTO<null> = { error: false }

    return result
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError)
      return {
        error: true,
        message: error?.meta?.cause as string
      }
    else
      return {
        error: true,
        message: "User couldn't be updated"
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
