import { RepositoryResultDTO } from '../common/constants/dtos/repository-result.dto'
import { getPrismaClient } from '../common/prisma/prisma.config'
import { compareHash } from '../common/utils/hash.util'
import { UserDTO } from '../users/dtos/user.dto'
import { LoginDTO } from './dtos/login.dto'
import * as jwt from 'jsonwebtoken'

const prismaClient = getPrismaClient()

const login = async (
  loginCredentials: LoginDTO
): Promise<RepositoryResultDTO<{ user: UserDTO; token: string }>> => {
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        email: loginCredentials.email
      }
    })

    if (!user) return { error: true, message: 'User or password incorrect' }

    const passwordMatch = await compareHash(loginCredentials.password, user.password)

    if (!passwordMatch) return { error: true, message: 'User or password incorrect' }

    const payload = { id: user.id, email: user.email }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '30s'
    })

    const { password, ...userWithoutPassword } = user

    const result: RepositoryResultDTO<{ user: UserDTO; token: string }> = {
      data: { user: userWithoutPassword, token },
      error: false
    }

    return result
  } catch (error) {
    return { error: true, message: 'Error authenticating user' }
  }
}

export const authRepository = {
  login
}
