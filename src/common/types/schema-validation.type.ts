import { BooleanSchema, NumberSchema, StringSchema } from 'joi'

export type SchemaValidation<T> = {
  [key in keyof T]: StringSchema | NumberSchema | BooleanSchema
}
