import { Request, Response } from 'express'
import { userService } from './user.service'
import { UserDTO } from './dtos/user.dto'
import { RepositoryResultDTO } from '../common/constants/dtos/repository-result.dto'
import { CreateUserDTO } from './dtos/create-user.dto'

const createUser = async (req: Request, res: Response) => {
  const user: CreateUserDTO = req.body.user

  const result: RepositoryResultDTO<null> = await userService.createUser(user)

  if (result.error) return res.status(400).json({ error: result.message })
  return res.status(200).send()
}

const getAllUsers = async (_: Request, res: Response) => {
  const result: RepositoryResultDTO<UserDTO[]> = await userService.getAllUsers()

  if (result.error) return res.status(400).json({ error: result.message })
  return res.status(200).json(result.data)
}

const getUserById = async (req: Request, res: Response) => {
  const userId: number = Number(req.params.userId)

  const result: RepositoryResultDTO<UserDTO | null> = await userService.getUserById(
    userId
  )

  if (result.error) return res.status(400).json({ error: result.message })
  return res.status(200).json(result.data)
}

const getUserByEmail = async (req: Request, res: Response) => {
  const email: string = req.params.email

  const result: RepositoryResultDTO<UserDTO | null> = await userService.getUserByEmail(
    email
  )

  if (result.error) return res.status(400).json({ error: result.message })
  return res.status(200).json(result.data)
}

const updateUser = async (req: Request, res: Response) => {
  const userId: number = Number(req.params.userId)
  const user: UserDTO = req.body.user

  const result: RepositoryResultDTO<null> = await userService.updateUser(userId, user)

  if (result.error) return res.status(400).json({ error: result.message })
  return res.status(200).send()
}

const deleteUser = async (req: Request, res: Response) => {
  const userId: number = Number(req.params.userId)

  const result: RepositoryResultDTO<null> = await userService.deleteUser(userId)

  if (result.error) return res.status(400).json({ error: result.message })
  return res.status(200).send()
}

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
}
