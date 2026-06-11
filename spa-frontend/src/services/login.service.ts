import { axiosInstance } from "@/axios-boot/axios"
import type { LoginType } from "@/types/login.type"

export class LoginService {
  async login(loginData: LoginType) {
    const response = await axiosInstance.post("/auth/login", loginData)
    return response.data
  }
}
