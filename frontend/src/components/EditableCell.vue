<template>
  <div class="editable-cell" @dblclick="startEdit">
    <template v-if="!isEditing">
      <span v-if="value" class="cell-content">
        <slot :value="value">
          {{ value }}
        </slot>
      </span>
      <span v-else class="empty-placeholder">双击编辑</span>
    </template>
    
    <template v-else>
      <el-input
        v-if="type === 'text'"
        ref="inputRef"
        v-model="editValue"
        size="small"
        @keyup.enter="stopEdit"
        @keyup.escape="cancelEdit"
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
        class="editing-textarea"
      />
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
    // 自动选中文本
    const input = inputRef.value?.$el?.querySelector('input')
    if (input) {
      input.select()
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
</script>

<style scoped>
.editable-cell {
  width: 100%;
  height: 100%;
  min-height: 32px;
  display: flex;
  align-items: center;
  position: relative;
}

.cell-content {
  width: 100%;
  padding: 4px 8px;
  min-height: 24px;
}

.empty-placeholder {
  color: #c0c4cc;
  font-size: 13px;
  padding: 4px 8px;
}

/* 编辑模式：输入框占据整个单元格 */
.editing-input {
  width: 100%;
}

.editing-input :deep(.el-input__wrapper) {
  box-shadow: none;
  padding: 0;
  background: #fff;
  border-radius: 0;
}

.editing-textarea {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.editing-textarea :deep(.el-textarea__inner) {
  box-shadow: none;
  border-radius: 0;
  padding: 4px 8px;
}
</style>
