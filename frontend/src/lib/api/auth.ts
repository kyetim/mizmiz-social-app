import apiClient from './client'
import { UserInterface } from '@/interfaces/user.interface'

interface RegisterData {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
}

interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  user: UserInterface
  token: string
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/register', data)
    return response.data.data
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/login', data)
    return response.data.data
  },

  async getCurrentUser(): Promise<UserInterface> {
    const response = await apiClient.get('/api/auth/me')
    return response.data.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout')
    localStorage.removeItem('token')
  },
}

