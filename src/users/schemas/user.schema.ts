import joi from 'joi'

const emailField = joi.string().required().email()
const fullnameField = joi.string().required()
const idField = joi.number().required()
const passwordField = joi.string().required()

export const userSchema = {
  emailField,
  fullnameField,
  idField,
  passwordField
}
