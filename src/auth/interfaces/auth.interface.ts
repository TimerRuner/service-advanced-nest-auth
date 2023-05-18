export interface IUser {
  id: number
  email: string
  isActivate: boolean
}

export interface IAuthResponse {
  user: IUser
  refreshToken: string
  accessToken: string
}