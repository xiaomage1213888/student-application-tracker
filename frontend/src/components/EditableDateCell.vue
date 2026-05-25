<template>
  <div
    class="cell-root"
    :class="{ 'is-editing': isEditing }"
    @dblclick="startEdit"
  >
    <template v-if="!isEditing">
      <span v-if="hasValue" class="cell-text">{{ value }}</span>
      <span v-else class="cell-text cell-empty">双击选择</span>
    </template>

    <el-date-picker
      v-else
      ref="dateRef"
      v-model="editValue"
      class="cell-editor"
      type="date"
      placeholder="选择日期"
      value-format="YYYY-MM-DD"
      :teleported="true"
      :clearable="false"
      @change="onChange"
      @blur="commit"
      @keyup.escape="cancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
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
const editValue = ref<string>('')
const dateRef = ref<InstanceType<typeof ElDatePicker>>()

const hasValue = computed(
  () => props.value !== undefined && props.value !== null && props.value !== ''
)

const startEdit = () => {
  if (isEditing.value) return
  isEditing.value = true
  editValue.value = props.value ?? ''
  nextTick(() => {
    const inst = dateRef.value as any
    inst?.focus?.()
    setTimeout(() => inst?.handleOpen?.(), 50)
  })
}

const onChange = (val: string) => {
  isEditing.value = false
  if (val !== (props.value ?? '')) emit('update', props.field, val)
}

const commit = () => {
  if (!isEditing.value) return
  isEditing.value = false
  if (editValue.value !== (props.value ?? '')) {
    emit('update', props.field, editValue.value)
  }
}

const cancel = () => {
  isEditing.value = false
}
</script>
