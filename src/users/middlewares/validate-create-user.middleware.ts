import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS } from '../../common/constants/http-codes.constants'
import { createUserSchemaValidation } from '../validations/user.validation'
import { CreateUserDTO } from '../dtos/create-user.dto'

export function validateCreateUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user: CreateUserDTO = {
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password
  }

  const { error } = createUserSchemaValidation.validate(user)

  if (error)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message })

  next()
}
