import express from 'express'
import { router } from './main.router'
import cookieParser from 'cookie-parser'
import { swagger } from './common/swagger'

export const app = express()
const globalPrefix = '/api'

app.use(cookieParser())
app.use(express.json())
app.use(globalPrefix, router)

if (process.env.NODE_ENV !== 'test') swagger(app)
