import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS } from '../../common/constants/http-codes.constants'
import { UserDTO } from '../dtos/user.dto'
import { userSchemaValidation } from '../validations/user.validation'

export function validateUserMiddleware(req: Request, res: Response, next: NextFunction) {
  const user: UserDTO = req.body.user

  const { error } = userSchemaValidation.user.validate(user)

  if (error)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message })

  next()
}
