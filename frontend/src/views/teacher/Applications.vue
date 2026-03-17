<template>
  <div class="teacher-applications-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>投递记录管理</span>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出 Excel
          </el-button>
        </div>
      </template>

      <!-- 筛选器 -->
      <el-form :inline="true" :model="filters" class="filter-form" size="default">
        <el-form-item label="班级">
          <el-select v-model="filters.className" placeholder="全部" clearable style="width: 150px">
            <el-option
              v-for="cls in classNames"
              :key="cls"
              :label="cls"
              :value="cls"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公司">
          <el-input v-model="filters.company" placeholder="搜索公司" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="filters.channel" placeholder="全部" clearable style="width: 120px">
            <el-option label="Boss 直聘" value="Boss 直聘" />
            <el-option label="实习僧" value="实习僧" />
            <el-option label="公司官网" value="公司官网" />
            <el-option label="内推" value="内推" />
            <el-option label="智联招聘" value="智联招聘" />
            <el-option label="牛客网" value="牛客网" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="全部" clearable style="width: 120px">
            <el-option label="实习" value="实习" />
            <el-option label="秋招正式批" value="秋招正式批" />
          </el-select>
        </el-form-item>
        <el-form-item label="进展">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width: 130px">
            <el-option label="已投递/未处理" value="已投递/未处理" />
            <el-option label="简历筛选" value="简历筛选" />
            <el-option label="笔试/测评" value="笔试/测评" />
            <el-option label="面试中" value="面试中" />
            <el-option label="OC" value="OC" />
            <el-option label="Offer" value="Offer" />
            <el-option label="已拒" value="已拒" />
            <el-option label="已结束" value="已结束" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchApplications">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="applications" style="width: 100%" v-loading="loading">
        <el-table-column prop="user.name" label="学生" width="100" />
        <el-table-column prop="user.className" label="班级" width="120" />
        <el-table-column prop="company" label="公司" min-width="150" />
        <el-table-column prop="position" label="岗位" min-width="120" />
        <el-table-column prop="applicationDate" label="投递时间" width="110" sortable />
        <el-table-column prop="channel" label="渠道" width="100" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="status" label="进展" width="110">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="地点" width="100" />
        <el-table-column prop="priority" label="重视度" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.priority" disabled show-text text-color="#ff9900" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import teacherApi from '@/api/teacher'
import type { Application } from '@/types'

const applications = ref<(Application & { user?: { name: string; className: string } })[]>([])
const classNames = ref<string[]>([])
const loading = ref(false)

const filters = reactive({
  className: '',
  company: '',
  channel: '',
  type: '',
  status: '',
})

const fetchClassNames = async () => {
  try {
    const res = await teacherApi.getClasses()
    classNames.value = res.data
  } catch (error) {
    console.error('获取班级列表失败:', error)
  }
}

const fetchApplications = async () => {
  loading.value = true
  try {
    const res = await teacherApi.getApplications(filters)
    applications.value = res.data
  } catch (error) {
    console.error('获取投递记录失败:', error)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.className = ''
  filters.company = ''
  filters.channel = ''
  filters.type = ''
  filters.status = ''
  fetchApplications()
}

const handleExport = async () => {
  try {
    const blob = await teacherApi.exportApplications(filters)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `投递记录导出_${new Date().toISOString().split('T')[0]}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error: any) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    '已投递/未处理': 'info',
    '简历筛选': '',
    '笔试/测评': 'warning',
    '面试中': 'primary',
    'OC': 'success',
    'Offer': 'success',
    '已拒': 'danger',
    '已结束': 'info',
  }
  return typeMap[status] || ''
}

onMounted(() => {
  fetchClassNames()
  fetchApplications()
})
</script>

<style scoped>
.teacher-applications-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-form {
  margin-bottom: 20px;
}
</style>
