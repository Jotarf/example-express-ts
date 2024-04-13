import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS } from '../../common/constants/http-codes.constants'
import { updateUserSchemaValidation } from '../validations/user.validation'
import { UserDTO } from '../dtos/user.dto'

export function validateUserMiddleware(req: Request, res: Response, next: NextFunction) {
  const user: UserDTO = {
    fullname: req.body.fullname,
    email: req.body.email,
    id: req.body.id
  }

  const { error } = updateUserSchemaValidation.validate(user)

  if (error)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message })

  next()
}
