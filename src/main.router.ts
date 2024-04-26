import Router, { Response } from 'express'
import { userRouter } from './users/user.router'
import { authRouter } from './auth/auth.router'

export const router = Router()

router.use('/users', userRouter)
router.use('/auth', authRouter)
router.use('/health', (_, res: Response) => res.send('OK'))
