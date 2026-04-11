<template>
  <div class="editable-cell" :class="{ editing: isEditing }" @dblclick="startEdit">
    <template v-if="!isEditing">
      <span v-if="value" class="cell-content">
        <slot :value="value">
          {{ value }}
        </slot>
      </span>
      <span v-else class="empty-placeholder">双击编辑</span>
    </template>
    
    <template v-else>
      <div class="editing-container">
        <el-input
          v-if="type === 'text'"
          ref="inputRef"
          v-model="editValue"
          size="small"
          @keyup.enter="stopEdit"
          @keyup.escape="cancelEdit"
          @blur="stopEdit"
          class="editing-input"
        />
        <el-input
          v-else
          ref="inputRef"
          v-model="editValue"
          type="textarea"
          :rows="4"
          size="small"
          @keyup.escape="cancelEdit"
          @blur="stopEdit"
          class="editing-textarea"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElInput } from 'element-plus'

interface Props {
  value: string | number | undefined
  row: any
  field: string
  type?: 'text' | 'textarea'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})

const emit = defineEmits<{
  update: [field: string, value: any]
}>()

const isEditing = ref(false)
const editValue = ref('')
const inputRef = ref<InstanceType<typeof ElInput>>()

const startEdit = () => {
  isEditing.value = true
  editValue.value = props.value || ''
  nextTick(() => {
    inputRef.value?.focus()
    // 强制聚焦
    setTimeout(() => {
      inputRef.value?.focus()
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
.editable-cell {
  width: 100%;
  height: 100%;
  min-height: 32px;
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}

.editable-cell.editing {
  border: 2px solid #409eff;
  background: #f0f9ff;
  box-sizing: border-box;
}

.cell-content {
  width: 100%;
  padding: 4px 8px;
  min-height: 24px;
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

/* 编辑模式：输入框占据整个单元格 */
.editing-input {
  width: 100% !important;
  height: 100% !important;
  min-height: 32px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

.editing-input :deep(.el-input) {
  width: 100% !important;
  height: 100% !important;
  min-height: 32px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

.editing-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
  padding: 0 !important;
  background: transparent !important;
  border-radius: 0 !important;
  border: none !important;
  height: 100% !important;
  min-height: 32px !important;
  box-sizing: border-box !important;
}

.editing-input :deep(.el-input__inner) {
  height: 100% !important;
  min-height: 32px !important;
  line-height: 32px !important;
  margin: 0 !important;
  padding: 0 4px !important;
  box-sizing: border-box !important;
}

.editing-textarea {
  width: 100%;
  height: 100%;
  min-height: 80px;
  box-sizing: border-box;
}

.editing-textarea :deep(.el-textarea) {
  width: 100%;
  height: 100%;
  min-height: 80px;
  box-sizing: border-box;
}

.editing-textarea :deep(.el-textarea__inner) {
  box-shadow: none !important;
  border-radius: 0 !important;
  padding: 4px 8px !important;
  background: transparent !important;
  border: none !important;
  height: 100% !important;
  min-height: 80px !important;
  box-sizing: border-box !important;
}
</style>
