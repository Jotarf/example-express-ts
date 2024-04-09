import express from 'express'
import { router } from './main.router'

const app = express()
const port = 3000
const globalPrefix = '/api'

app.use(express.json())
app.use(globalPrefix, router)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
