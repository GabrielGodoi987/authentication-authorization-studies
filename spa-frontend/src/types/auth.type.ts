export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  user: {
    id: string
    name: string
    email: string
  }
  accessToken: string
  refreshToken: string
}

export type RefreshResponse = {
  accessToken: string
  refreshToken: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}
