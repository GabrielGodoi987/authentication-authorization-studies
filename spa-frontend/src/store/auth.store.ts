import { create } from "zustand"
import type { LoginPayload, LoginResponse } from "@/types/auth.type"
import { authService } from "@/services/auth.service"

type AuthState = {
  user: LoginResponse["user"] | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
  setTokens: (accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  login: async (payload) => {
    const res = await authService.login(payload)
    set({
      user: res.user,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      isAuthenticated: true,
    })
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  },

  setTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken })
  },
}))
