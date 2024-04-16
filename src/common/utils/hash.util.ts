import bcrypt from 'bcrypt'

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const compareHash = async (password: string, hash: string): Promise<boolean> => {
  const arePasswordsEqual = await bcrypt.compare(password, hash)
  return arePasswordsEqual
}
