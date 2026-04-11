<template>
  <div class="dashboard-container">
    <el-card class="stats-card">
      <template #header>
        <div class="card-header">
          <span>投递统计</span>
          <div class="header-actions">
            <el-button @click="goToApplications">
              <el-icon><List /></el-icon>
              查看投递记录
            </el-button>
            <el-button type="primary" @click="goToApplicationsWithAdd">
              <el-icon><Plus /></el-icon>
              新增投递
            </el-button>
          </div>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8" :xs="24">
          <div class="stat-item">
            <div class="stat-icon" style="background: #409eff">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.total }}</div>
              <div class="stat-label">投递总数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8" :xs="24">
          <div class="stat-item">
            <div class="stat-icon" style="background: #67c23a">
              <el-icon><SuccessFilled /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ offerCount }}</div>
              <div class="stat-label">Offer 数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8" :xs="24">
          <div class="stat-item">
            <div class="stat-icon" style="background: #e6a23c">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ interviewCount }}</div>
              <div class="stat-label">面试中</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

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
            <span>投递趋势（近 7 天）</span>
          </template>
          <div ref="trendChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>投递渠道分布</span>
        </div>
      </template>
      <div ref="channelChartRef" style="height: 300px"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { Document, SuccessFilled, VideoPlay, List, Plus } from '@element-plus/icons-vue'
import applicationApi from '@/api/application'
import type { Statistics } from '@/types'

const router = useRouter()

const statistics = ref<Statistics>({
  total: 0,
  statusCount: {},
  typeCount: {},
  channelCount: {},
  trend: {},
})

const statusChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()
const channelChartRef = ref<HTMLElement>()

let statusChart: ECharts | null = null
let trendChart: ECharts | null = null
let channelChart: ECharts | null = null

const offerCount = computed(() => statistics.value.statusCount['Offer'] || 0)
const interviewCount = computed(() => statistics.value.statusCount['面试中'] || 0)

const goToApplications = () => {
  router.push('/applications')
}

const goToApplicationsWithAdd = () => {
  router.push('/applications?add=true')
}

const fetchStatistics = async () => {
  try {
    const res = await applicationApi.getStatistics()
    statistics.value = res.data
    initCharts()
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const initCharts = () => {
  // 进展分布饼图
  if (statusChartRef.value) {
    statusChart = echarts.init(statusChartRef.value)
    const statusData = Object.entries(statistics.value.statusCount).map(([name, value]) => ({
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

  // 趋势折线图
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    const trendData = Object.entries(statistics.value.trend)

    trendChart.setOption({
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: trendData.map(([date]) => date.slice(5)),
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
      },
      series: [
        {
          data: trendData.map(([, count]) => count),
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.3,
          },
          itemStyle: {
            color: '#409eff',
          },
        },
      ],
    })
  }

  // 渠道分布柱状图
  if (channelChartRef.value) {
    channelChart = echarts.init(channelChartRef.value)
    const channelData = Object.entries(statistics.value.channelCount)

    channelChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: channelData.map(([name]) => name),
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
      },
      series: [
        {
          data: channelData.map(([, count]) => count),
          type: 'bar',
          itemStyle: {
            color: '#67c23a',
          },
        },
      ],
    })
  }
}

onMounted(() => {
  fetchStatistics()
  window.addEventListener('resize', () => {
    statusChart?.resize()
    trendChart?.resize()
    channelChart?.resize()
  })
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
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
</style>
