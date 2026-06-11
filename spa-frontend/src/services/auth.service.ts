import { axiosInstance } from "@/axios-boot/axios"
import type { LoginPayload, LoginResponse, RefreshResponse } from "@/types/auth.type"

export class AuthService {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await axiosInstance.post<LoginResponse>("/auth/login", payload)
    return data
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await axiosInstance.post<RefreshResponse>("/auth/refresh-token", { refreshToken })
    return data
  }

  async register(payload: { name: string; email: string; password: string }) {
    const { data } = await axiosInstance.post("/users", payload)
    return data
  }
}

export const authService = new AuthService()
