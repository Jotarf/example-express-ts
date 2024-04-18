import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { RepositoryResultDTO } from '../common/constants/dtos/repository-result.dto'
import { getPrismaClient } from '../common/prisma/prisma.config'
import { CreateUserDTO } from './dtos/create-user.dto'
import { UserDTO } from './dtos/user.dto'
import { hashPassword } from '../common/utils/hash.util'

const prismaClient = getPrismaClient()

const createUser = async (user: CreateUserDTO): Promise<RepositoryResultDTO<null>> => {
  try {
    const passwordHash = await hashPassword(user.password)

    await prismaClient.user.create({
      data: {
        email: user.email,
        fullname: user.fullname,
        password: passwordHash
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
    const users: UserDTO[] = await prismaClient.user.findMany({
      select: {
        email: true,
        fullname: true,
        id: true
      }
    })

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
      select: {
        email: true,
        fullname: true,
        id: true
      },
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
      select: {
        email: true,
        fullname: true,
        id: true
      },
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
    await prismaClient.user.delete({
      where: {
        id: userId
      }
    })

    const result: RepositoryResultDTO<null> = {
      error: false
    }

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
        message: "User couldn't be deleted"
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
