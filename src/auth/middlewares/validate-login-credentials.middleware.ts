import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS } from '../../common/constants/http-codes.constants'
import { LoginDTO } from '../dtos/login.dto'
import { loginCredentialsSchemaValidation } from '../validations/login-credentials.validation'

export function validateLoginMiddleware(req: Request, res: Response, next: NextFunction) {
  const loginCredentials: LoginDTO = {
    email: req.body.email,
    password: req.body.password
  }

  const { error } = loginCredentialsSchemaValidation.validate(loginCredentials)

  if (error)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message })

  next()
}
