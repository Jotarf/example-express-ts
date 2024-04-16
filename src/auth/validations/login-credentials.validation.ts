import { SchemaValidation } from '../../common/types/schema-validation.type'
import { userSchema } from '../../users/schemas/user.schema'
import { LoginDTO } from '../dtos/login.dto'
import joi from 'joi'

const loginCredentialsSchema: SchemaValidation<LoginDTO> = {
  email: userSchema.emailField,
  password: userSchema.passwordField
}

export const loginCredentialsSchemaValidation = joi.object(loginCredentialsSchema)
