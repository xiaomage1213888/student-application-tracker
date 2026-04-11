import request from './request'

interface UserConfig {
  id: number
  userId: number
  configKey: string
  configValue: string
  createdAt: string
  updatedAt: string
}

interface UserConfigResponse {
  success: boolean
  data: UserConfig
}

interface UserConfigListResponse {
  success: boolean
  data: UserConfig[]
}

export const userConfigApi = {
  // 获取用户配置列表
  getList() {
    return request.get<UserConfigListResponse>('/user-configs')
  },

  // 保存用户配置
  save(key: string, value: string) {
    return request.post<UserConfigResponse>('/user-configs', { key, value })
  },

  // 删除用户配置
  delete(id: number) {
    return request.delete(`/user-configs/${id}`)
  },
}

export default userConfigApi