<template>
  <div class="editable-select-cell" @dblclick="startEdit">
    <template v-if="!isEditing">
      <span v-if="value" class="cell-content">
        <slot :value="value">
          {{ value }}
        </slot>
      </span>
      <span v-else class="empty-placeholder">双击选择</span>
    </template>
    
    <template v-else>
      <el-select
        ref="selectRef"
        v-model="editValue"
        size="small"
        placeholder="请选择"
        @change="stopEdit"
        @keyup.escape="cancelEdit"
        class="editing-select"
      >
        <el-option
          v-for="option in options"
          :key="option"
          :label="option"
          :value="option"
        />
      </el-select>
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

const startEdit = () => {
  isEditing.value = true
  editValue.value = props.value || ''
  nextTick(() => {
    selectRef.value?.focus()
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
.editable-select-cell {
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

/* 编辑模式：选择框占据整个单元格 */
.editing-select {
  width: 100%;
}

.editing-select :deep(.el-select__wrapper) {
  box-shadow: none;
  border-radius: 0;
}
</style>
