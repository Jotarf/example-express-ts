import joi from 'joi'

const userIdSchema = joi.object({
  userId: joi.number().required()
})

export const userParamsValidation = {
  userId: userIdSchema
}
