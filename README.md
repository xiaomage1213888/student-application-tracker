# 学生秋招投递记录管理系统

一个专为学生和就业指导老师设计的秋招投递管理工具。

## 技术栈

- **前端**：Vue 3 + Element Plus + TypeScript + Vite
- **后端**：Node.js + Express + TypeScript
- **数据库**：SQLite（开发）/ MySQL（生产）
- **认证**：JWT Token

## 项目结构

```
student-application-tracker/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据库模型
│   │   ├── routes/         # 路由
│   │   ├── middleware/     # 中间件
│   │   ├── services/       # 业务逻辑
│   │   ├── config/         # 配置
│   │   └── index.ts        # 入口文件
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── views/          # 页面
│   │   ├── router/         # 路由
│   │   ├── stores/         # 状态管理
│   │   ├── api/            # API 客户端
│   │   ├── types/          # TypeScript 类型
│   │   └── App.vue
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 快速开始

### 后端启动

```bash
cd backend
npm install
npm run dev
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

## 功能特性

### 学生端
- 投递记录管理（增删改查）
- 个人数据统计看板
- 投递进展跟踪

### 老师端
- 学生名单管理（Excel/CSV 导入）
- 班级数据查看
- 多维度统计分析
- 数据导出

## 默认账号

**老师账号**：
- 用户名：admin
- 密码：admin123
