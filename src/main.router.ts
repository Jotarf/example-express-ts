import Router from 'express'
import { userRouter } from './users/user.router'

export const router = Router()

router.use('/users', userRouter)
