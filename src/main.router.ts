import Router from 'express'
import { userRouter } from './users/user.router'
import { authRouter } from './auth/auth.router'

export const router = Router()

router.use('/users', userRouter)
router.use('/auth', authRouter)
