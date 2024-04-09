import Router from 'express'
//import { HTTP_STATUS } from '../common/constants/http-codes.constants'
import { validateParamsMiddleware } from './middlewares/validate-params.middleware'
import { validateUserMiddleware } from './middlewares/validate-user.middleware'
import { userController } from './user.controller'

export const userRouter = Router()

userRouter.post('/', validateUserMiddleware, userController.createUser)
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
