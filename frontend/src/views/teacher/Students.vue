<template>
  <div class="students-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>学生名单管理</span>
          <el-button type="primary" @click="handleImport">
            <el-icon><Upload /></el-icon>
            导入名单
          </el-button>
        </div>
      </template>

      <el-form :inline="true" class="filter-form">
        <el-form-item label="班级">
          <el-select v-model="className" placeholder="全部" clearable @change="fetchStudents">
            <el-option
              v-for="cls in classNames"
              :key="cls"
              :label="cls"
              :value="cls"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-table :data="students" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="className" label="班级" width="150" />
        <el-table-column label="注册状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.isUsed ? 'success' : 'info'">
              {{ row.isUsed ? '已注册' : '未注册' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="导入时间" width="180" />
      </el-table>
    </el-card>

    <!-- 导入对话框 -->
    <el-dialog v-model="importDialogVisible" title="导入学生名单" width="500px">
      <el-upload
        ref="uploadRef"
        drag
        :auto-upload="false"
        :on-change="handleFileChange"
        :limit="1"
        accept=".csv, .xlsx, .xls"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            只支持 csv/xlsx/xls 文件，Excel 文件需包含 name 和 className 列
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpload" :loading="uploading">
          开始导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, type UploadProps } from 'element-plus'
import teacherApi from '@/api/teacher'
import type { AuthorizedStudent } from '@/types'

const students = ref<AuthorizedStudent[]>([])
const classNames = ref<string[]>([])
const loading = ref(false)
const className = ref('')
const importDialogVisible = ref(false)
const uploading = ref(false)
const selectedFile = ref<File | null>(null)

const fetchStudents = async () => {
  loading.value = true
  try {
    const params = className.value ? { className: className.value } : {}
    const res = await teacherApi.getStudents(params)
    students.value = res.data
  } catch (error) {
    console.error('获取学生名单失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchClassNames = async () => {
  try {
    const res = await teacherApi.getClasses()
    classNames.value = res.data
  } catch (error) {
    console.error('获取班级列表失败:', error)
  }
}

const handleImport = () => {
  importDialogVisible.value = true
  selectedFile.value = null
}

const handleFileChange: UploadProps['onChange'] = (file) => {
  selectedFile.value = file.raw || null
}

const handleUpload = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请选择文件')
    return
  }

  uploading.value = true
  try {
    await teacherApi.importStudents(selectedFile.value)
    ElMessage.success('导入成功')
    importDialogVisible.value = false
    fetchStudents()
    fetchClassNames()
  } catch (error: any) {
    console.error('导入失败:', error)
  } finally {
    uploading.value = false
  }
}

onMounted(() => {
  fetchStudents()
  fetchClassNames()
})
</script>

<style scoped>
.students-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-form {
  margin-bottom: 20px;
}
</style>
