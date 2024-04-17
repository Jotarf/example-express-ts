import Router from 'express'
import { validateParamsMiddleware } from './middlewares/validate-params.middleware'
import { validateCreateUserMiddleware } from './middlewares/validate-create-user.middleware'
import { userController } from './user.controller'
import { validateUserMiddleware } from './middlewares/validate-user.middleware'
import { validateJWTMiddleware } from '../auth/middlewares/jwt.middleware'

export const userRouter = Router()

userRouter.post('/', validateCreateUserMiddleware, userController.createUser)
userRouter.get('/', validateJWTMiddleware, userController.getAllUsers)
userRouter.get(
  '/id/:userId',
  validateParamsMiddleware,
  validateJWTMiddleware,
  userController.getUserById
)
userRouter.get(
  '/email/:email',
  validateParamsMiddleware,
  validateJWTMiddleware,
  userController.getUserByEmail
)
userRouter.put(
  '/:userId',
  validateParamsMiddleware,
  validateUserMiddleware,
  userController.updateUser
)
userRouter.delete(
  '/:userId',
  validateParamsMiddleware,
  validateJWTMiddleware,
  userController.deleteUser
)
