<template>
  <div class="applications-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>投递记录管理</span>
          <div class="header-actions">
            <el-button @click="goToDashboard">
              <el-icon><ArrowLeft /></el-icon>
              返回看板
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
        ref="tableRef"
        :data="tableData" 
        style="width: 100%" 
        v-loading="loading"
        border
        class="editable-table"
        :header-cell-style="{ 'user-select': 'none' }"
        @header-dragend="handleHeaderDragend"
        @row-contextmenu="handleRowContextMenu"
      >
        <el-table-column type="index" label="#" width="50" />
        
        <el-table-column label="公司" min-width="180" resizable>
          <template #default="{ row }">
            <template v-if="row.isAddRow">
              <div class="add-row-cell" @click="handleAddRow">
                <el-icon class="add-icon"><Plus /></el-icon>
                <span>添加新记录</span>
              </div>
            </template>
            <template v-else>
              <editable-cell 
                :value="row.company" 
                :row="row" 
                field="company"
                @update="(field, val) => handleCellUpdate(row, field, val)"
              />
            </template>
          </template>
        </el-table-column>
        
        <el-table-column label="岗位" min-width="150" resizable>
          <template #default="{ row }">
            <template v-if="row.isAddRow">
              <div class="add-row-cell" @click="handleAddRow"></div>
            </template>
            <template v-else>
              <editable-select-cell 
                :value="row.position" 
                :row="row" 
                field="position"
                :options="positionOptions"
                @update="(field, val) => handleCellUpdate(row, field, val)"
              />
            </template>
          </template>
        </el-table-column>
        
        <el-table-column label="投递时间" width="120" resizable>
          <template #default="{ row }">
            <template v-if="row.isAddRow">
              <div class="add-row-cell" @click="handleAddRow"></div>
            </template>
            <template v-else>
              <editable-date-cell 
                :value="row.applicationDate" 
                :row="row" 
                field="applicationDate"
                @update="(field, val) => handleCellUpdate(row, field, val)"
              />
            </template>
          </template>
        </el-table-column>
        
        <el-table-column label="渠道" width="120" resizable>
          <template #default="{ row }">
            <template v-if="row.isAddRow">
              <div class="add-row-cell" @click="handleAddRow"></div>
            </template>
            <template v-else>
              <editable-select-cell 
                :value="row.channel" 
                :row="row" 
                field="channel"
                :options="channelOptions"
                @update="(field, val) => handleCellUpdate(row, field, val)"
              />
            </template>
          </template>
        </el-table-column>
        
        <el-table-column label="类型" width="100" resizable>
          <template #default="{ row }">
            <template v-if="row.isAddRow">
              <div class="add-row-cell" @click="handleAddRow"></div>
            </template>
            <template v-else>
              <editable-select-cell 
                :value="row.type" 
                :row="row" 
                field="type"
                :options="typeOptions"
                @update="(field, val) => handleCellUpdate(row, field, val)"
              />
            </template>
          </template>
        </el-table-column>
        
        <el-table-column label="进展" width="120" resizable>
          <template #default="{ row }">
            <template v-if="row.isAddRow">
              <div class="add-row-cell" @click="handleAddRow"></div>
            </template>
            <template v-else>
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
          </template>
        </el-table-column>
        
        <el-table-column label="地点" width="100" resizable>
          <template #default="{ row }">
            <template v-if="row.isAddRow">
              <div class="add-row-cell" @click="handleAddRow"></div>
            </template>
            <template v-else>
              <editable-select-cell 
                :value="row.location" 
                :row="row" 
                field="location"
                :options="locationOptions"
                @update="(field, val) => handleCellUpdate(row, field, val)"
              />
            </template>
          </template>
        </el-table-column>
        
        <el-table-column label="重视度" width="100" resizable>
          <template #default="{ row }">
            <template v-if="row.isAddRow">
              <div class="add-row-cell" @click="handleAddRow"></div>
            </template>
            <template v-else>
              <el-rate 
                v-model="row.priority" 
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                @change="handlePriorityChange(row)"
                style="font-size: 14px"
              />
            </template>
          </template>
        </el-table-column>
        
        <el-table-column label="备注" min-width="200" resizable>
          <template #default="{ row }">
            <template v-if="row.isAddRow">
              <div class="add-row-cell" @click="handleAddRow"></div>
            </template>
            <template v-else>
              <editable-cell 
                :value="row.remarks" 
                :row="row" 
                field="remarks"
                type="textarea"
                @update="(field, val) => handleCellUpdate(row, field, val)"
              />
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 右键菜单 -->
      <div 
        v-if="contextMenuVisible" 
        class="context-menu"
        :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
      >
        <div class="context-menu-item" @click="handleDelete(selectedRow)">
          <el-icon><Delete /></el-icon>
          <span>删除此行</span>
        </div>
        <div class="context-menu-item" @click="openPresetManager">
          <el-icon><Setting /></el-icon>
          <span>管理预设值</span>
        </div>
      </div>

      <!-- 预设值管理对话框 -->
      <el-dialog
        v-model="presetDialogVisible"
        title="管理预设值"
        width="500px"
      >
        <div class="preset-manager">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="岗位" name="position">
              <div class="preset-options">
                <div 
                  v-for="(option, index) in positionOptions" 
                  :key="option"
                  class="preset-option-item"
                >
                  <span>{{ option }}</span>
                  <el-button 
                    type="danger" 
                    size="small" 
                    circle
                    @click="removePreset('position', index)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="add-preset">
                <el-input 
                  v-model="newPresetValue" 
                  placeholder="输入新的岗位"
                  @keyup.enter="addPreset('position')"
                />
                <el-button type="primary" @click="addPreset('position')">添加</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="渠道" name="channel">
              <div class="preset-options">
                <div 
                  v-for="(option, index) in channelOptions" 
                  :key="option"
                  class="preset-option-item"
                >
                  <span>{{ option }}</span>
                  <el-button 
                    type="danger" 
                    size="small" 
                    circle
                    @click="removePreset('channel', index)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="add-preset">
                <el-input 
                  v-model="newPresetValue" 
                  placeholder="输入新的渠道"
                  @keyup.enter="addPreset('channel')"
                />
                <el-button type="primary" @click="addPreset('channel')">添加</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="类型" name="type">
              <div class="preset-options">
                <div 
                  v-for="(option, index) in typeOptions" 
                  :key="option"
                  class="preset-option-item"
                >
                  <span>{{ option }}</span>
                  <el-button 
                    type="danger" 
                    size="small" 
                    circle
                    @click="removePreset('type', index)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="add-preset">
                <el-input 
                  v-model="newPresetValue" 
                  placeholder="输入新的类型"
                  @keyup.enter="addPreset('type')"
                />
                <el-button type="primary" @click="addPreset('type')">添加</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="进展" name="status">
              <div class="preset-options">
                <div 
                  v-for="(option, index) in statusOptions" 
                  :key="option"
                  class="preset-option-item"
                >
                  <span>{{ option }}</span>
                  <el-button 
                    type="danger" 
                    size="small" 
                    circle
                    @click="removePreset('status', index)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="add-preset">
                <el-input 
                  v-model="newPresetValue" 
                  placeholder="输入新的进展"
                  @keyup.enter="addPreset('status')"
                />
                <el-button type="primary" @click="addPreset('status')">添加</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="presetDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="savePresets">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, InfoFilled, ArrowLeft, Delete, Setting } from '@element-plus/icons-vue'
import applicationApi from '@/api/application'
import userConfigApi from '@/api/user-config'
import type { Application } from '@/types'
import EditableCell from '@/components/EditableCell.vue'
import EditableSelectCell from '@/components/EditableSelectCell.vue'
import EditableDateCell from '@/components/EditableDateCell.vue'
import { sortedCities } from '@/utils/cities'

const router = useRouter()
const route = useRoute()
const tableRef = ref()

const applications = ref<Application[]>([])
const loading = ref(false)

// 表格数据，包含添加行按钮
const tableData = computed(() => {
  return [...applications.value, { isAddRow: true }]
})

// 右键菜单相关
const contextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const selectedRow = ref<any>(null)

// 预设值管理相关
const presetDialogVisible = ref(false)
const activeTab = ref('position')
const newPresetValue = ref('')

// 选项数据
const channelOptions = ref([
  'Boss 直聘',
  '实习僧',
  '公司官网',
  '内推',
  '智联招聘',
  '牛客网',
  '其他',
])

const typeOptions = ref([
  '实习',
  '秋招正式批',
])

const statusOptions = ref([
  '已投递/未处理',
  '简历筛选',
  '笔试/测评',
  '面试中',
  'OC',
  'Offer',
  '已拒',
  '已结束',
])

// 岗位选项（从 localStorage 读取或初始值）
const defaultPositionOptions = [
  '后端开发',
  '前端开发',
  '全栈开发',
  '移动端开发',
  '测试开发',
  '算法工程师',
  '数据分析师',
  '产品经理',
  '运营',
]

const positionOptions = ref<string[]>([])

// 初始化岗位选项
const initPositionOptions = () => {
  const saved = localStorage.getItem('position-options')
  if (saved) {
    positionOptions.value = JSON.parse(saved)
  } else {
    positionOptions.value = defaultPositionOptions
  }
}

const locationOptions = sortedCities

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

const goToDashboard = () => {
  router.push('/dashboard')
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

// 处理列宽拖动
const handleHeaderDragend = async (newWidth: number, oldWidth: number, column: any, event: Event) => {
  // 保存列宽到后端
  const columnKey = column.property || column.label
  const configKey = `table-column-width-${columnKey}`
  try {
    await userConfigApi.save(configKey, newWidth.toString())
  } catch (error) {
    console.error('保存列宽失败:', error)
    // 失败时回退到localStorage
    localStorage.setItem(configKey, newWidth.toString())
  }
}

// 处理行右键菜单
const handleRowContextMenu = (row: any, column: any, event: MouseEvent) => {
  // 跳过添加行按钮的右键菜单
  if (row.isAddRow) {
    return
  }
  
  event.preventDefault()
  event.stopPropagation()
  
  selectedRow.value = row
  contextMenuX.value = event.clientX
  contextMenuY.value = event.clientY
  contextMenuVisible.value = true
}

// 打开预设值管理对话框
const openPresetManager = () => {
  contextMenuVisible.value = false
  presetDialogVisible.value = true
  newPresetValue.value = ''
  activeTab.value = 'position'
}

// 添加预设值
const addPreset = (type: string) => {
  if (!newPresetValue.value.trim()) {
    ElMessage.warning('请输入预设值内容')
    return
  }
  
  switch (type) {
    case 'position':
      if (!positionOptions.value.includes(newPresetValue.value.trim())) {
        positionOptions.value.push(newPresetValue.value.trim())
      } else {
        ElMessage.warning('该预设值已存在')
      }
      break
    case 'channel':
      if (!channelOptions.value.includes(newPresetValue.value.trim())) {
        channelOptions.value.push(newPresetValue.value.trim())
      } else {
        ElMessage.warning('该预设值已存在')
      }
      break
    case 'type':
      if (!typeOptions.value.includes(newPresetValue.value.trim())) {
        typeOptions.value.push(newPresetValue.value.trim())
      } else {
        ElMessage.warning('该预设值已存在')
      }
      break
    case 'status':
      if (!statusOptions.value.includes(newPresetValue.value.trim())) {
        statusOptions.value.push(newPresetValue.value.trim())
      } else {
        ElMessage.warning('该预设值已存在')
      }
      break
  }
  newPresetValue.value = ''
}

// 删除预设值
const removePreset = (type: string, index: number) => {
  switch (type) {
    case 'position':
      positionOptions.value.splice(index, 1)
      break
    case 'channel':
      channelOptions.value.splice(index, 1)
      break
    case 'type':
      typeOptions.value.splice(index, 1)
      break
    case 'status':
      statusOptions.value.splice(index, 1)
      break
  }
}

// 保存预设值
const savePresets = () => {
  // 保存岗位选项到 localStorage
  localStorage.setItem('position-options', JSON.stringify(positionOptions.value))
  
  // 保存其他选项到 localStorage
  localStorage.setItem('channel-options', JSON.stringify(channelOptions.value))
  localStorage.setItem('type-options', JSON.stringify(typeOptions.value))
  localStorage.setItem('status-options', JSON.stringify(statusOptions.value))
  
  ElMessage.success('预设值保存成功')
  presetDialogVisible.value = false
}

// 初始化所有预设值
const initPresets = () => {
  // 初始化岗位选项
  initPositionOptions()
  
  // 初始化渠道选项
  const savedChannel = localStorage.getItem('channel-options')
  if (savedChannel) {
    channelOptions.value = JSON.parse(savedChannel)
  }
  
  // 初始化类型选项
  const savedType = localStorage.getItem('type-options')
  if (savedType) {
    typeOptions.value = JSON.parse(savedType)
  }
  
  // 初始化状态选项
  const savedStatus = localStorage.getItem('status-options')
  if (savedStatus) {
    statusOptions.value = JSON.parse(savedStatus)
  }
}

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenuVisible.value = false
  selectedRow.value = null
}

// 监听全局点击事件，关闭右键菜单
onMounted(async () => {
  // 初始化所有预设值
  initPresets()
  
  // 获取投递记录
  await fetchApplications()
  
  // 获取用户配置并应用列宽
  await loadUserConfigs()
  
  // 检查是否需要自动添加新行
  if (route.query.add === 'true') {
    await handleAddRow()
  }
  
  document.addEventListener('click', closeContextMenu)
})

// 加载用户配置并应用列宽
const loadUserConfigs = async () => {
  try {
    const response = await userConfigApi.getList()
    if (response.success && response.data) {
      const configs = response.data
      // 应用列宽配置
      nextTick(() => {
        if (tableRef.value) {
          configs.forEach(config => {
            if (config.configKey.startsWith('table-column-width-')) {
              const columnKey = config.configKey.replace('table-column-width-', '')
              const width = parseInt(config.configValue)
              if (!isNaN(width)) {
                // 查找对应的列并设置宽度
                const columns = tableRef.value.columns
                const column = columns.find(col => col.property === columnKey || col.label === columnKey)
                if (column) {
                  column.width = width
                }
              }
            }
          })
          // 重新渲染表格
          tableRef.value.doLayout()
        }
      })
    }
  } catch (error) {
    console.error('加载用户配置失败:', error)
    // 失败时尝试从localStorage加载
    loadFromLocalStorage()
  }
}

// 从localStorage加载列宽
const loadFromLocalStorage = () => {
  nextTick(() => {
    if (tableRef.value) {
      const columns = tableRef.value.columns
      columns.forEach(column => {
        const columnKey = column.property || column.label
        const configKey = `table-column-width-${columnKey}`
        const widthStr = localStorage.getItem(configKey)
        if (widthStr) {
          const width = parseInt(widthStr)
          if (!isNaN(width)) {
            column.width = width
          }
        }
      })
      // 重新渲染表格
      tableRef.value.doLayout()
    }
  })
}

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu)
})

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

/* 列宽拖动样式 */
.editable-table :deep(.el-table__header th) {
  position: relative;
  user-select: none;
}

/* 确保列可以调整宽度 */
.editable-table :deep(.el-table__header .el-table__cell) {
  overflow: visible;
  cursor: default;
}

/* 拖动把手区域 */
.editable-table :deep(.el-table__header .el-table__cell:hover::after) {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 8px;
  cursor: col-resize;
  background-color: transparent;
}

/* 拖动时的样式 */
.editable-table :deep(.el-table__header .el-table__cell.el-table__cell--resizing:hover::after) {
  background-color: #409eff;
  opacity: 0.5;
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 9999;
  min-width: 120px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  transition: background-color 0.2s;
}

.context-menu-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.context-menu-item .el-icon {
  font-size: 16px;
}

/* 添加行按钮样式 */
.add-row-cell {
  width: 100%;
  height: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10px;
  box-sizing: border-box;
  cursor: pointer;
  color: #409eff;
  transition: all 0.3s ease;
}

.add-row-cell:hover {
  background-color: #ecf5ff;
}

.add-icon {
  margin-right: 8px;
  font-size: 16px;
}

/* 预设值管理对话框样式 */
.preset-manager {
  padding: 10px 0;
}

.preset-options {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}

.preset-option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-bottom: 1px solid #f0f0f0;
}

.preset-option-item:last-child {
  border-bottom: none;
}

.add-preset {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.add-preset .el-input {
  flex: 1;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
