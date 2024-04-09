import joi from 'joi'

const userEmailSchema = joi.object({
  email: joi.string().required().email()
})

const userFullnameSchema = joi.object({
  fullname: joi.string().required()
})

const userIdSchema = joi.object({
  userId: joi.number().required()
})

export const userSchema = {
  userEmailSchema,
  userFullnameSchema,
  userIdSchema
}
