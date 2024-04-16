import { Request, Response } from 'express'
import { LoginDTO } from './dtos/login.dto'
import { RepositoryResultDTO } from '../common/constants/dtos/repository-result.dto'
import { HTTP_STATUS } from '../common/constants/http-codes.constants'
import { authService } from './auth.service'

const login = async (req: Request, res: Response) => {
  const loginCredentials: LoginDTO = {
    email: req.body.email,
    password: req.body.password
  }

  const result: RepositoryResultDTO<{ token: string }> = await authService.login(
    loginCredentials
  )

  if (result.error)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.message })

  if (!result.data?.token)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Not able to authenticate' })

  res.cookie('jwt', result.data.token, {
    sameSite: 'strict',
    httpOnly: true
  })

  return res.status(HTTP_STATUS.OK).send({})
}

export const authController = {
  login
}
