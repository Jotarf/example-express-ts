import { ObjectSchema } from 'joi'

export type SchemaValidation<T> = {
  [key in keyof T]: ObjectSchema
}
