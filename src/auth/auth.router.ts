import Router from 'express'
import { validateLoginMiddleware } from './middlewares/validate-login-credentials.middleware'
import { authController } from './auth.controller'

export const authRouter = Router()

authRouter.post('/', validateLoginMiddleware, authController.login)
