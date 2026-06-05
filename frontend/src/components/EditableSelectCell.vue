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
      placeholder="请选择"
      @change="onChange"
      @visible-change="onVisibleChange"
      @keyup.escape="cancel"
    >
      <el-option
        v-for="opt in uniqueOptions"
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

// 防御性去重：无论上游传入什么，组件内部强制去重，避免 Element Plus
// 因为相同 value 的 el-option 重复注册导致 hover 高亮失效（先注册的 DOM
// 在 states.options Map 中被后注册的覆盖，is-hovering 类无法添加上去）
const uniqueOptions = computed(() => {
  const seen = new Set<string>()
  const result: string[] = []
  for (const opt of props.options) {
    const key = String(opt)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(opt)
    }
  }
  return result
})

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
