import { userSchema } from '../schemas/user.schema'

const userSchemaToValidate = userSchema.userEmailSchema.concat(
  userSchema.userFullnameSchema
)

export const userSchemaValidation = {
  user: userSchemaToValidate
}
