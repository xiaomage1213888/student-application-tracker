import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

// 获取 token 的函数（避免在拦截器中直接使用 store）
const getToken = () => {
  return localStorage.getItem('token')
}

class Request {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
    })

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data
      },
      (error) => {
        if (error.response) {
          const { status, data } = error.response
          
          if (status === 401) {
            localStorage.removeItem('token')
            ElMessage.error('登录已过期，请重新登录')
            // 延迟跳转到登录页
            setTimeout(() => {
              window.location.href = '/login'
            }, 1000)
          } else {
            ElMessage.error(data?.message || '请求失败')
          }
        } else {
          ElMessage.error('网络错误，请检查网络连接')
        }
        return Promise.reject(error)
      }
    )
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config)
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ method: 'GET', url, ...config })
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ method: 'POST', url, data, ...config })
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ method: 'PUT', url, data, ...config })
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ method: 'DELETE', url, ...config })
  }
}

export const request = new Request()
export default request
