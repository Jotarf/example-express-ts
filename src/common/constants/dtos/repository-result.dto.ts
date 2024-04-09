export interface RepositoryResultDTO<T> {
  data?: T
  message?: string
  error: boolean
}
