import Router from 'express'
import { validateParamsMiddleware } from './middlewares/validate-params.middleware'
import { validateCreateUserMiddleware } from './middlewares/validate-create-user.middleware'
import { userController } from './user.controller'
import { validateUserMiddleware } from './middlewares/validate-user.middleware'

export const userRouter = Router()

userRouter.post('/', validateCreateUserMiddleware, userController.createUser)
userRouter.get('/', userController.getAllUsers)
userRouter.get('/id/:userId', validateParamsMiddleware, userController.getUserById)
userRouter.get('/email/:email', validateParamsMiddleware, userController.getUserByEmail)
userRouter.put(
  '/:userId',
  validateParamsMiddleware,
  validateUserMiddleware,
  userController.updateUser
)
userRouter.delete('/:userId', validateParamsMiddleware, userController.deleteUser)
