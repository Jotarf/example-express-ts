import express from 'express'
import { router } from './main.router'
import cookieParser from 'cookie-parser'

export const app = express()
const globalPrefix = '/api'

app.use(cookieParser())
app.use(express.json())
app.use(globalPrefix, router)
