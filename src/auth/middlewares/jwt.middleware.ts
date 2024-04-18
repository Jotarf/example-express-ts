import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS } from '../../common/constants/http-codes.constants'
import * as jwt from 'jsonwebtoken'

export function validateJWTMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.jwt ?? null

    if (!token)
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Token is missing' })

    const tokenContent = jwt.verify(token, process.env.JWT_SECRET as string, {
      ignoreExpiration: false
    }) as { id: number; email: string }

    req.user = tokenContent

    next()
  } catch {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Token has expired' })
  }
}
