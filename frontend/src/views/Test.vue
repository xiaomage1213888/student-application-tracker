<template>
  <div style="padding: 20px">
    <h1>测试页面</h1>
    <p>如果你能看到这个页面，说明前端已经正常加载了</p>
    <el-button type="primary" @click="goToLogin">去登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>
