import Router from 'express'
import { validateLoginMiddleware } from './middlewares/validate-login-credentials.middleware'
import { authController } from './auth.controller'
import { validateJWTMiddleware } from './middlewares/jwt.middleware'

export const authRouter = Router()

authRouter.post('/', validateLoginMiddleware, authController.login)
authRouter.post('/logout', validateJWTMiddleware, authController.logout)
