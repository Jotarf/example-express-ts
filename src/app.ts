import express from 'express'
import { router } from './main.router'

export const app = express()
const globalPrefix = '/api'

app.use(express.json())
app.use(globalPrefix, router)
