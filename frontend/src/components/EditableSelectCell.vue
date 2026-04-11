<template>
  <div class="editable-select-cell" :class="{ editing: isEditing }" @dblclick="startEdit">
    <template v-if="!isEditing">
      <span v-if="value" class="cell-content">
        <slot :value="value">
          {{ value }}
        </slot>
      </span>
      <span v-else class="empty-placeholder">双击选择</span>
    </template>
    
    <template v-else>
      <div class="editing-container">
        <el-select
          ref="selectRef"
          v-model="editValue"
          size="small"
          placeholder="请选择"
          filterable
          @change="handleSelectChange"
          @keyup.escape="cancelEdit"
          @blur="handleBlur"
          class="editing-select"
        >
          <el-option
            v-for="option in filteredOptions"
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { SelectInstance } from 'element-plus'

interface Props {
  value: string | undefined
  row: any
  field: string
  options: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  update: [field: string, value: any]
}>()

const isEditing = ref(false)
const editValue = ref('')
const selectRef = ref<SelectInstance>()
const filteredOptions = ref<string[]>([])

const startEdit = () => {
  isEditing.value = true
  editValue.value = props.value || ''
  filteredOptions.value = [...props.options]
  nextTick(() => {
    const selectInstance = selectRef.value as any
    if (selectInstance) {
      setTimeout(() => {
        selectInstance.focus()
        // 尝试多种方法打开下拉框，确保可靠性
        if (selectInstance.handleOpen) {
          selectInstance.handleOpen()
        } else if (selectInstance.toggleMenu) {
          selectInstance.toggleMenu()
        } else if (selectInstance.showPopper) {
          selectInstance.showPopper()
        } else {
          // 直接设置visible属性
          selectInstance.visible = true
        }
      }, 50)
    }
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

// 处理选择变化
const handleSelectChange = (value: any) => {
  emit('update', props.field, value)
  isEditing.value = false
}

// 处理失去焦点
const handleBlur = () => {
  // 延迟一点时间，确保选择事件先处理
  setTimeout(() => {
    if (isEditing.value) {
      emit('update', props.field, editValue.value)
      isEditing.value = false
    }
  }, 200)
}
</script>

<style scoped>
.editable-select-cell {
  width: 100%;
  height: 100%;
  min-height: 32px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.editable-select-cell.editing {
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

/* 编辑模式：选择框占据整个单元格 */
.editing-select {
  width: 100% !important;
  height: 100% !important;
  min-height: 32px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

.editing-select :deep(.el-select) {
  width: 100% !important;
  height: 100% !important;
  min-height: 32px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

.editing-select :deep(.el-select__wrapper) {
  box-shadow: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  height: 100% !important;
  min-height: 32px !important;
  box-sizing: border-box !important;
}

.editing-select :deep(.el-select__inner) {
  height: 100% !important;
  min-height: 32px !important;
  line-height: 32px !important;
  margin: 0 !important;
  padding: 0 4px !important;
  box-sizing: border-box !important;
}
</style>
