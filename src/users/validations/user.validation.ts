import joi from 'joi'

const userSchema = joi.object({
  email: joi.string().required().email(),
  fullname: joi.string().required()
})

export const userSchemaValidation = {
  user: userSchema
}
