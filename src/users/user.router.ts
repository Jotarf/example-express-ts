import Router from 'express'
import { Request, Response } from 'express'

export const userRouter = Router()

userRouter.get('/', (_: Request, res: Response) => {
  res.send('you are getting a user...')
})
