import request from './request'
import type { LoginData, RegisterData, User } from '@/types'

interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

interface ProfileResponse {
  success: boolean
  data: User
}

export const authApi = {
  // 登录
  login(data: LoginData) {
    return request.post<AuthResponse>('/auth/login', data)
  },

  // 注册
  register(data: RegisterData) {
    return request.post<AuthResponse>('/auth/register', data)
  },

  // 获取用户信息
  getProfile() {
    return request.get<ProfileResponse>('/auth/profile')
  },

  // 更新用户信息
  updateProfile(data: Partial<User>) {
    return request.put<ProfileResponse>('/auth/profile', data)
  },
}

export default authApi
