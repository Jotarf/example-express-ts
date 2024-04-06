import { Request, Response, NextFunction } from 'express'
import { userParamsValidation } from '../validations/user-routes-params.validation'
import { HTTP_STATUS } from '../../common/constants/http-codes.constants'

export function validateParamsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  for (let param in req.params) {
    const objectParam = {
      [param]: req.params[param]
    }

    const { error } =
      userParamsValidation[param as keyof typeof userParamsValidation].validate(
        objectParam
      )

    if (error)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message })
  }
  next()
}
