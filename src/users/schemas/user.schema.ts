import joi from 'joi'

const emailField = joi.string().required().email()
const fullnameField = joi.string().required()
const idField = joi.number().required()

export const userSchema = {
  emailField,
  fullnameField,
  idField
}
