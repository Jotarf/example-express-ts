import express from 'express'
import { router } from './main.router'
import { getPrismaClient } from './common/prisma/prisma.config'

const app = express()
const port = 3000
const globalPrefix = '/api'
const prismaClient = getPrismaClient()

app.use(express.json())
app.use(globalPrefix, router)

process.on('SIGINT', async () => {
  await prismaClient.$disconnect()
  process.exit()
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
