import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Test.vue'),
    meta: { title: '测试页面', requiresAuth: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册', requiresAuth: false },
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/student/Dashboard.vue'),
    meta: { title: '个人看板', requiresAuth: true, studentOnly: true },
  },
  {
    path: '/applications',
    name: 'Applications',
    component: () => import('@/views/student/Applications.vue'),
    meta: { title: '投递记录', requiresAuth: true, studentOnly: true },
  },
  {
    path: '/teacher/dashboard',
    name: 'TeacherDashboard',
    component: () => import('@/views/teacher/Dashboard.vue'),
    meta: { title: '数据看板', requiresAuth: true, teacherOnly: true },
  },
  {
    path: '/teacher/students',
    name: 'TeacherStudents',
    component: () => import('@/views/teacher/Students.vue'),
    meta: { title: '学生管理', requiresAuth: true, teacherOnly: true },
  },
  {
    path: '/teacher/applications',
    name: 'TeacherApplications',
    component: () => import('@/views/teacher/Applications.vue'),
    meta: { title: '投递记录', requiresAuth: true, teacherOnly: true },
  },
  {
    path: '/teacher/class/:className',
    name: 'ClassDetail',
    component: () => import('@/views/teacher/ClassDetail.vue'),
    meta: { title: '班级详情', requiresAuth: true, teacherOnly: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} - 学生秋招投递记录管理系统`
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth !== false) {
    const token = localStorage.getItem('token')
    if (!token) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  }

  next()
})

export default router
