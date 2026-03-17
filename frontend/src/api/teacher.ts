import request from './request'
import type { AuthorizedStudent, ClassStatistics, OverallStatistics, Application } from '@/types'

interface StudentsResponse {
  success: boolean
  data: AuthorizedStudent[]
}

interface ClassesResponse {
  success: boolean
  data: string[]
}

interface ClassStatsResponse {
  success: boolean
  data: ClassStatistics
}

interface OverallStatsResponse {
  success: boolean
  data: OverallStatistics
}

interface ApplicationsResponse {
  success: boolean
  data: (Application & { user?: { name: string; className: string } })[]
}

interface ImportResponse {
  success: boolean
  message: string
  data: {
    count: number
  }
}

export const teacherApi = {
  // 导入学生名单
  importStudents(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return request.post<ImportResponse>('/teacher/import-students', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 获取学生名单
  getStudents(params?: { className?: string }) {
    return request.get<StudentsResponse>('/teacher/students', { params })
  },

  // 获取班级列表
  getClasses() {
    return request.get<ClassesResponse>('/teacher/classes')
  },

  // 获取班级统计
  getClassStatistics(className: string) {
    return request.get<ClassStatsResponse>(`/teacher/statistics/class/${className}`)
  },

  // 获取总体统计
  getOverallStatistics() {
    return request.get<OverallStatsResponse>('/teacher/statistics/overall')
  },

  // 获取所有投递记录
  getApplications(params?: {
    className?: string
    status?: string
    channel?: string
    type?: string
    startDate?: string
    endDate?: string
  }) {
    return request.get<ApplicationsResponse>('/teacher/applications', { params })
  },

  // 导出投递记录
  exportApplications(params?: {
    className?: string
    status?: string
    channel?: string
    type?: string
    startDate?: string
    endDate?: string
  }) {
    return request.get('/teacher/applications/export', {
      params,
      responseType: 'blob',
    })
  },
}

export default teacherApi
