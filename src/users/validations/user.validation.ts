import { SchemaValidation } from '../../common/types/schema-validation.type'
import { CreateUserDTO } from '../dtos/create-user.dto'
import { UserDTO } from '../dtos/user.dto'
import { userSchema } from '../schemas/user.schema'
import joi from 'joi'

const createUserSchema: SchemaValidation<CreateUserDTO> = {
  fullname: userSchema.fullnameField,
  email: userSchema.emailField,
  password: userSchema.passwordField
}

const updateUserSchema: SchemaValidation<UserDTO> = {
  fullname: userSchema.fullnameField,
  email: userSchema.emailField,
  id: userSchema.idField,
  password: userSchema.passwordField
}

export const createUserSchemaValidation = joi.object(createUserSchema)
export const updateUserSchemaValidation = joi.object(updateUserSchema)
