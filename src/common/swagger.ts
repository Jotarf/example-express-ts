import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from '../../swagger.json'

export const swagger = (app: Express) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}
