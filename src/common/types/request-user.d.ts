import 'express'

declare module 'express' {
  interface Request {
    user?: { id: number; email: string }
  }
}

// import 'express-serve-static-core'
// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: { id: number; email: string }
//   }
// }

// declare module 'express-serve-static-core' {
//   interface Request {
//     user: { id: number; email: string }
//   }
// }
