# Express - Typescript | Example App

## Users CRUD and Auth app using Express and Typescript

API for handling users CRUD operations and authentication, developed with the following technologies:

- Typescript
- Express
- Postgres
- Prisma ORM
- Jest
- Docker
- Github Actions
- Swagger
- NodeJS
- NPM
- Eslint

## Execution Steps

1. Clone the repository

   > git clone https://github.com/Jotarf/example-express-ts.git

2. Configure env file: You should rename "example.env" file to ".env" and configure enviroment variables that are going to be used

3. Install dependencies

   > npm install

4. Generate prisma schema

   > npx prisma generate

5. Apply database migrations

   > npx prisma migrate dev

6. Run express app as development using nodemon
   > npm run start:dev

## Optional Steps

- Build application
  > npm run build
- Run e2e tests
  > npm run test
- Run e2e tests in watch mode
  > npm run test:watch
- Run production docker container
  > npm run compose:prod
- Run development docker container
  > npm run compose:dev
- Run linter (eslint)
  > npm run lint
