<template>
  <div class="editable-date-cell" :class="{ editing: isEditing }" @dblclick="startEdit">
    <template v-if="!isEditing">
      <span v-if="value" class="cell-content">{{ value }}</span>
      <span v-else class="empty-placeholder">双击选择</span>
    </template>
    
    <template v-else>
      <div class="editing-container">
        <el-date-picker
          ref="dateRef"
          v-model="editValue"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
          size="small"
          @change="stopEdit"
          @keyup.escape="cancelEdit"
          class="editing-date"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElDatePicker } from 'element-plus'

interface Props {
  value: string | undefined
  row: any
  field: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  update: [field: string, value: any]
}>()

const isEditing = ref(false)
const editValue = ref('')
const dateRef = ref<InstanceType<typeof ElDatePicker>>()

const startEdit = () => {
  isEditing.value = true
  editValue.value = props.value || ''
  nextTick(() => {
    dateRef.value?.focus()
    // 强制聚焦
    setTimeout(() => {
      dateRef.value?.focus()
    }, 100)
  })
}

const stopEdit = () => {
  if (isEditing.value) {
    emit('update', props.field, editValue.value)
    isEditing.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editValue.value = ''
}
</script>

<style scoped>
.editable-date-cell {
  width: 100%;
  height: 100%;
  min-height: 32px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.editable-date-cell.editing {
  border: 2px solid #409eff;
  background: #f0f9ff;
  box-sizing: border-box;
}

.cell-content {
  width: 100%;
  padding: 4px 8px;
  box-sizing: border-box;
}

.empty-placeholder {
  color: #c0c4cc;
  font-size: 13px;
  padding: 4px 8px;
  box-sizing: border-box;
}

/* 编辑容器 */
.editing-container {
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  margin: 2px;
}

/* 编辑模式：日期选择器占据整个单元格 */
.editing-date {
  width: 100% !important;
  height: 100% !important;
  min-height: 32px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

.editing-date :deep(.el-date-picker) {
  width: 100% !important;
  height: 100% !important;
  min-height: 32px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

.editing-date :deep(.el-input) {
  width: 100% !important;
  height: 100% !important;
  min-height: 32px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

.editing-date :deep(.el-input__wrapper) {
  box-shadow: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  height: 100% !important;
  min-height: 32px !important;
  box-sizing: border-box !important;
}

.editing-date :deep(.el-input__inner) {
  height: 100% !important;
  min-height: 32px !important;
  line-height: 32px !important;
  margin: 0 !important;
  padding: 0 4px !important;
  box-sizing: border-box !important;
}
</style>
