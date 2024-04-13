import { SchemaValidation } from '../../common/types/schema-validation.type'
import { CreateUserDTO } from '../dtos/create-user.dto'
import { UserDTO } from '../dtos/user.dto'
import { userSchema } from '../schemas/user.schema'

export const createUserSchemaValidation: SchemaValidation<CreateUserDTO> = {
  fullname: userSchema.userFullnameSchema.required(),
  email: userSchema.userEmailSchema.required()
}

export const updateUserSchemaValidation: SchemaValidation<UserDTO> = {
  fullname: userSchema.userFullnameSchema.required(),
  email: userSchema.userEmailSchema.required(),
  id: userSchema.userIdSchema.required()
}
