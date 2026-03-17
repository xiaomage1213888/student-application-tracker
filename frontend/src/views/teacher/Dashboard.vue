<template>
  <div class="teacher-dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="12">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background: #409eff">
              <el-icon><OfficeBuilding /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.totalClasses }}</div>
              <div class="stat-label">班级数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="12">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background: #67c23a">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.totalStudents }}</div>
              <div class="stat-label">学生总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="12">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background: #e6a23c">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.totalApplications }}</div>
              <div class="stat-label">投递总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="12">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background: #f56c6c">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ offerCount }}</div>
              <div class="stat-label">Offer 总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>各班级投递统计</span>
      </template>
      <el-table :data="classStats" style="width: 100%">
        <el-table-column prop="className" label="班级" width="150" />
        <el-table-column prop="studentCount" label="学生数" width="100" />
        <el-table-column prop="totalApplications" label="投递总数" width="100" sortable />
        <el-table-column prop="avgApplications" label="人均投递" width="100" />
        <el-table-column label="进展分布" min-width="300">
          <template #default="{ row }">
            <div class="status-tags">
              <el-tag
                v-for="(count, status) in row.statusCount"
                :key="status"
                size="small"
                style="margin-right: 5px; margin-bottom: 5px"
              >
                {{ status }}: {{ count }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewClassDetail(row.className)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>整体进展分布</span>
      </template>
      <div ref="chartRef" style="height: 400px"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import teacherApi from '@/api/teacher'
import type { OverallStatistics, ClassStatistics } from '@/types'

const router = useRouter()
const statistics = ref<OverallStatistics>({
  totalClasses: 0,
  totalStudents: 0,
  totalApplications: 0,
  statusCount: {},
})
const classStats = ref<ClassStatistics[]>([])
const chartRef = ref<HTMLElement>()
let chart: ECharts | null = null

const offerCount = computed(() => statistics.value.statusCount['Offer'] || 0)

const fetchStatistics = async () => {
  try {
    const res = await teacherApi.getOverallStatistics()
    statistics.value = res.data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const fetchClassStats = async () => {
  try {
    const res = await teacherApi.getClasses()
    const classNames = res.data
    
    const stats = await Promise.all(
      classNames.map((className: string) =>
        teacherApi.getClassStatistics(className)
      )
    )
    
    classStats.value = stats.map((res: any) => res.data)
  } catch (error) {
    console.error('获取班级统计失败:', error)
  }
}

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  const statusData = Object.entries(statistics.value.statusCount).map(([name, value]) => ({
    name,
    value,
  }))

  chart.setOption({
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
        radius: ['40%', '70%'],
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

const viewClassDetail = (className: string) => {
  router.push(`/teacher/class/${encodeURIComponent(className)}`)
}

onMounted(() => {
  fetchStatistics()
  fetchClassStats()
  
  setTimeout(() => {
    initChart()
  }, 100)
  
  window.addEventListener('resize', () => {
    chart?.resize()
  })
})
</script>

<style scoped>
.teacher-dashboard-container {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  margin-right: 15px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 5px;
}

.status-tags {
  display: flex;
  flex-wrap: wrap;
}
</style>
