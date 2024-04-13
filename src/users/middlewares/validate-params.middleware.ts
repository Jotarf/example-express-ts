import { Request, Response, NextFunction } from 'express'
import { userParamsValidation } from '../validations/user-routes-params.validation'
import { HTTP_STATUS } from '../../common/constants/http-codes.constants'

export function validateParamsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = userParamsValidation.validate(req.params)

  if (error)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message })
  next()
}
