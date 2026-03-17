<template>
  <div class="editable-date-cell" @dblclick="startEdit">
    <template v-if="!isEditing">
      <span v-if="value" class="cell-content">{{ value }}</span>
      <span v-else class="empty-placeholder">双击选择</span>
    </template>
    
    <template v-else>
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
}

.cell-content {
  width: 100%;
  padding: 4px 8px;
}

.empty-placeholder {
  color: #c0c4cc;
  font-size: 13px;
  padding: 4px 8px;
}

/* 编辑模式：日期选择器占据整个单元格 */
.editing-date {
  width: 100%;
}

.editing-date :deep(.el-input__wrapper) {
  box-shadow: none;
  border-radius: 0;
}
</style>
