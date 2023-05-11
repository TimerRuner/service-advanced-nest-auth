export interface IAuthResponse {
  id: number
  email: string
  password: string
  tokenId: number
  mailId: number
  createdAt: string
  updatedAt: string
  refreshToken: string
  accessToken: string
  isActivate: boolean
}