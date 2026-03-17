<template>
  <div class="class-detail-container">
    <el-page-header @back="$router.back()" :title="className">
      <template #content>
        <div class="header-content">
          <span>学生数：{{ stats.studentCount }}</span>
          <span style="margin-left: 20px">投递总数：{{ stats.totalApplications }}</span>
          <span style="margin-left: 20px">人均投递：{{ stats.avgApplications }}</span>
        </div>
      </template>
    </el-page-header>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12" :xs="24">
        <el-card>
          <template #header>
            <span>进展分布</span>
          </template>
          <div ref="statusChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12" :xs="24">
        <el-card>
          <template #header>
            <span>学生投递排名</span>
          </template>
          <el-table :data="studentRanks" style="width: 100%" :show-header="false">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="studentName" label="学生姓名" />
            <el-table-column prop="count" label="投递数" width="100">
              <template #default="{ row }">
                <el-tag :type="getRankType(row.count)">{{ row.count }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>投递记录详情</span>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出 Excel
          </el-button>
        </div>
      </template>

      <el-table :data="applications" style="width: 100%" v-loading="loading">
        <el-table-column prop="user.name" label="学生" width="100" />
        <el-table-column prop="user.className" label="班级" width="120" />
        <el-table-column prop="company" label="公司" min-width="150" />
        <el-table-column prop="position" label="岗位" min-width="120" />
        <el-table-column prop="applicationDate" label="投递时间" width="110" sortable />
        <el-table-column prop="channel" label="渠道" width="100" />
        <el-table-column prop="status" label="进展" width="110">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="地点" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import teacherApi from '@/api/teacher'
import type { ClassStatistics, Application } from '@/types'

const route = useRoute()
const className = ref(decodeURIComponent(route.params.className as string))
const stats = ref<ClassStatistics>({
  className: '',
  studentCount: 0,
  totalApplications: 0,
  avgApplications: '0',
  statusCount: {},
  studentRanks: [],
})
const applications = ref<(Application & { user?: { name: string; className: string } })[]>([])
const loading = ref(false)
const statusChartRef = ref<HTMLElement>()
let statusChart: ECharts | null = null

const studentRanks = ref<Array<{ studentId: number; studentName: string; count: number }>>([])

const fetchClassStats = async () => {
  try {
    const res = await teacherApi.getClassStatistics(className.value)
    stats.value = res.data
    studentRanks.value = res.data.studentRanks
    initStatusChart()
  } catch (error) {
    console.error('获取班级统计失败:', error)
  }
}

const fetchApplications = async () => {
  loading.value = true
  try {
    const res = await teacherApi.getApplications({ className: className.value })
    applications.value = res.data
  } catch (error) {
    console.error('获取投递记录失败:', error)
  } finally {
    loading.value = false
  }
}

const initStatusChart = () => {
  if (!statusChartRef.value) return
  
  statusChart = echarts.init(statusChartRef.value)
  const statusData = Object.entries(stats.value.statusCount).map(([name, value]) => ({
    name,
    value,
  }))

  statusChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: statusData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  })
}

const handleExport = async () => {
  try {
    const blob = await teacherApi.exportApplications({ className: className.value })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${className.value}_投递记录.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出失败:', error)
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

const getRankType = (count: number) => {
  if (count >= 10) return 'success'
  if (count >= 5) return 'primary'
  if (count >= 3) return 'warning'
  return 'info'
}

onMounted(() => {
  fetchClassStats()
  fetchApplications()
  
  window.addEventListener('resize', () => {
    statusChart?.resize()
  })
})
</script>

<style scoped>
.class-detail-container {
  padding: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: #606266;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
