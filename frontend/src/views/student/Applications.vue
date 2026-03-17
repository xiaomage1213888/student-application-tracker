<template>
  <div class="applications-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>投递记录管理</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleAddRow">
              <el-icon><Plus /></el-icon>
              新增行
            </el-button>
            <el-button @click="refreshData">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <div class="table-tip">
        <el-icon><InfoFilled /></el-icon>
        <span>双击单元格可直接编辑，修改后自动保存</span>
      </div>

      <!-- 表格 -->
      <el-table 
        :data="applications" 
        style="width: 100%" 
        v-loading="loading"
        border
        class="editable-table"
      >
        <el-table-column type="index" label="#" width="50" />
        
        <el-table-column label="公司" min-width="180">
          <template #default="{ row }">
            <editable-cell 
              :value="row.company" 
              :row="row" 
              field="company"
              @update="(field, val) => handleCellUpdate(row, field, val)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="岗位" min-width="150">
          <template #default="{ row }">
            <editable-cell 
              :value="row.position" 
              :row="row" 
              field="position"
              @update="(field, val) => handleCellUpdate(row, field, val)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="投递时间" width="120">
          <template #default="{ row }">
            <editable-date-cell 
              :value="row.applicationDate" 
              :row="row" 
              field="applicationDate"
              @update="(field, val) => handleCellUpdate(row, field, val)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="渠道" width="120">
          <template #default="{ row }">
            <editable-select-cell 
              :value="row.channel" 
              :row="row" 
              field="channel"
              :options="channelOptions"
              @update="(field, val) => handleCellUpdate(row, field, val)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <editable-select-cell 
              :value="row.type" 
              :row="row" 
              field="type"
              :options="typeOptions"
              @update="(field, val) => handleCellUpdate(row, field, val)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="进展" width="120">
          <template #default="{ row }">
            <editable-select-cell 
              :value="row.status" 
              :row="row" 
              field="status"
              :options="statusOptions"
              @update="(field, val) => handleCellUpdate(row, field, val)"
            >
              <template #default="scope">
                <el-tag :type="getStatusType(scope.value)" size="small">{{ scope.value }}</el-tag>
              </template>
            </editable-select-cell>
          </template>
        </el-table-column>
        
        <el-table-column label="地点" width="100">
          <template #default="{ row }">
            <editable-cell 
              :value="row.location" 
              :row="row" 
              field="location"
              @update="(field, val) => handleCellUpdate(row, field, val)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="重视度" width="100">
          <template #default="{ row }">
            <el-rate 
              v-model="row.priority" 
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              @change="handlePriorityChange(row)"
              style="font-size: 14px"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="备注" min-width="200">
          <template #default="{ row }">
            <editable-cell 
              :value="row.remarks" 
              :row="row" 
              field="remarks"
              type="textarea"
              @update="(field, val) => handleCellUpdate(row, field, val)"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import applicationApi from '@/api/application'
import type { Application } from '@/types'
import EditableCell from '@/components/EditableCell.vue'
import EditableSelectCell from '@/components/EditableSelectCell.vue'
import EditableDateCell from '@/components/EditableDateCell.vue'

const applications = ref<Application[]>([])
const loading = ref(false)

// 选项数据
const channelOptions = [
  'Boss 直聘',
  '实习僧',
  '公司官网',
  '内推',
  '智联招聘',
  '牛客网',
  '其他',
]

const typeOptions = [
  '实习',
  '秋招正式批',
]

const statusOptions = [
  '已投递/未处理',
  '简历筛选',
  '笔试/测评',
  '面试中',
  'OC',
  'Offer',
  '已拒',
  '已结束',
]

const fetchApplications = async () => {
  loading.value = true
  try {
    const res = await applicationApi.list()
    applications.value = res.data
  } catch (error) {
    console.error('获取投递记录失败:', error)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchApplications()
}

// 新增一行
const handleAddRow = async () => {
  try {
    const defaultData = {
      company: '新公司',
      position: '岗位名称',
      applicationDate: new Date().toISOString().split('T')[0],
      channel: '',
      type: '秋招正式批',
      status: '已投递/未处理',
      location: '',
      priority: 3,
      remarks: '',
    }
    
    const res = await applicationApi.create(defaultData)
    applications.value.unshift(res.data)
    ElMessage.success('新增成功，双击单元格可编辑')
  } catch (error: any) {
    console.error('新增失败:', error)
  }
}

// 单元格更新
const handleCellUpdate = async (row: any, field: string, value: any) => {
  try {
    await applicationApi.update(row.id, { [field]: value })
    row[field] = value
    ElMessage.success('保存成功')
  } catch (error: any) {
    console.error('更新失败:', error)
    ElMessage.error('更新失败：' + (error.message || '未知错误'))
  }
}

// 重视度改变
const handlePriorityChange = async (row: Application) => {
  try {
    await applicationApi.update(row.id, { priority: row.priority })
  } catch (error: any) {
    console.error('更新失败:', error)
  }
}

// 删除记录
const handleDelete = async (row: Application) => {
  try {
    await ElMessageBox.confirm('确定要删除这条投递记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await applicationApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchApplications()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
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
  fetchApplications()
})
</script>

<style scoped>
.applications-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.table-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  color: #909399;
  font-size: 13px;
}

/* 表格样式优化 */
.editable-table :deep(.el-table__cell) {
  padding: 0;
}

.editable-table :deep(.el-table__body tr) {
  height: 40px;
}

/* 编辑时输入框占据整个单元格 */
.editable-table :deep(.editable-cell),
.editable-table :deep(.editable-select-cell),
.editable-table :deep(.editable-date-cell) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

/* 输入框样式 */
.editable-table :deep(.editing-input .el-input__wrapper),
.editable-table :deep(.editing-select .el-select__wrapper),
.editable-table :deep(.editing-date .el-input__wrapper) {
  box-shadow: none;
  border-radius: 0;
  padding: 0 8px;
}

/* 文本域样式 */
.editable-table :deep(.editing-textarea) {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.editable-table :deep(.editing-textarea .el-textarea__inner) {
  box-shadow: none;
  border-radius: 0;
  padding: 8px;
}
</style>
