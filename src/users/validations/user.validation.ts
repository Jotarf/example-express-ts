import joi from 'joi'

const userEmailSchema = joi.object({
  email: joi.string().required().email()
})

const userFullnameSchema = joi.object({
  fullname: joi.string().required()
})

const userSchema = userEmailSchema.concat(userFullnameSchema)

export const userSchemaValidation = {
  user: userSchema
}
