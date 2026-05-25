<template>
  <div
    class="cell-root"
    :class="{ 'is-editing': isEditing }"
    @dblclick="startEdit"
  >
    <template v-if="!isEditing">
      <span v-if="hasValue" class="cell-text">
        <slot :value="value">{{ value }}</slot>
      </span>
      <span v-else class="cell-text cell-empty">双击选择</span>
    </template>

    <el-select
      v-else
      ref="selectRef"
      v-model="editValue"
      class="cell-editor"
      filterable
      :teleported="true"
      placeholder="请选择"
      @change="onChange"
      @visible-change="onVisibleChange"
      @keyup.escape="cancel"
    >
      <el-option
        v-for="opt in options"
        :key="opt"
        :label="opt"
        :value="opt"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
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
const editValue = ref<string>('')
const selectRef = ref<SelectInstance>()

const hasValue = computed(
  () => props.value !== undefined && props.value !== null && props.value !== ''
)

const startEdit = () => {
  if (isEditing.value) return
  isEditing.value = true
  editValue.value = props.value ?? ''
  nextTick(() => {
    const inst = selectRef.value as any
    inst?.focus?.()
    setTimeout(() => {
      if (typeof inst?.toggleMenu === 'function') inst.toggleMenu()
    }, 50)
  })
}

const onChange = (val: string) => {
  isEditing.value = false
  if (val !== (props.value ?? '')) emit('update', props.field, val)
}

const onVisibleChange = (visible: boolean) => {
  if (!visible) {
    setTimeout(() => {
      isEditing.value = false
    }, 150)
  }
}

const cancel = () => {
  isEditing.value = false
}
</script>
