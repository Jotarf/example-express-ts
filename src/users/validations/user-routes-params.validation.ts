import { userSchema } from '../schemas/user.schema'
import joi from 'joi'

export const userParamsValidation = joi.object({
  userId: userSchema.idField.optional(),
  email: userSchema.emailField.optional()
})
