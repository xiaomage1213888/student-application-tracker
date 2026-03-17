<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h1>学生注册</h1>
        <p>填写信息完成注册</p>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        size="large"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名（用于登录）"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入真实姓名"
            prefix-icon="UserFilled"
            clearable
          />
        </el-form-item>

        <el-form-item label="班级" prop="className">
          <el-input
            v-model="formData.className"
            placeholder="请输入班级（如：2024 级计算机 1 班）"
            prefix-icon="OfficeBuilding"
            clearable
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱（选填）"
            prefix-icon="Message"
            clearable
          />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号（选填）"
            prefix-icon="Phone"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>

        <div class="register-footer">
          <span>已有账号？</span>
          <router-link to="/login">返回登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  className: '',
  email: '',
  phone: '',
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 50, message: '用户名长度在 3-50 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
  ],
  className: [
    { required: true, message: '请输入班级', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
}

const handleRegister = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      await userStore.register({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        className: formData.className,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
      })
      ElMessage.success('注册成功')
      router.push(userStore.isTeacher ? '/teacher/dashboard' : '/dashboard')
    } catch (error: any) {
      console.error('注册失败:', error)
      const message = error.response?.data?.message || error.message || '注册失败'
      ElMessage.error(message)
      
      // 如果是授权名单验证失败，显示提示
      if (message.includes('授权名单') || message.includes('不在名单')) {
        ElMessageBox.alert(
          '学生注册需要老师预先导入授权名单。\n\n请联系老师导入学生名单，或使用已创建的测试账号登录。',
          '注册提示',
          {
            confirmButtonText: '确定',
            type: 'warning',
          }
        )
      }
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-box {
  width: 100%;
  max-width: 480px;
  padding: 40px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h1 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 8px;
  font-weight: 600;
}

.register-header p {
  font-size: 14px;
  color: #909399;
}

.register-footer {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #606266;
}

.register-footer a {
  color: #409eff;
  text-decoration: none;
  margin-left: 8px;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>
