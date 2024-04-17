import { RepositoryResultDTO } from '../common/constants/dtos/repository-result.dto'
import { UserDTO } from '../users/dtos/user.dto'
import { authRepository } from './auth.repository'
import { LoginDTO } from './dtos/login.dto'

const login = async (
  loginCredentials: LoginDTO
): Promise<RepositoryResultDTO<{ user: UserDTO; token: string }>> => {
  try {
    const result = await authRepository.login(loginCredentials)
    return result
  } catch (error: unknown) {
    return error as RepositoryResultDTO<{ user: UserDTO; token: string }>
  }
}

export const authService = {
  login
}
