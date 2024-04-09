import { userSchema } from '../schemas/user.schema'

export const userParamsValidation = {
  userId: userSchema.userIdSchema,
  email: userSchema.userEmailSchema
}
