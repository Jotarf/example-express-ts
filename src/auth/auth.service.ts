import { RepositoryResultDTO } from '../common/constants/dtos/repository-result.dto'
import { authRepository } from './auth.repository'
import { LoginDTO } from './dtos/login.dto'

const login = async (
  loginCredentials: LoginDTO
): Promise<RepositoryResultDTO<{ token: string }>> => {
  try {
    const result = await authRepository.login(loginCredentials)
    return result
  } catch (error: unknown) {
    return error as RepositoryResultDTO<{ token: string }>
  }
}

export const authService = {
  login
}
