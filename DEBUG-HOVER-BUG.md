# 调试步骤：城市下拉 hover 无反馈问题

## 已完成的修复

1. **数据去重**：`frontend/src/utils/cities.ts` 已重构，283 个城市按拼音排序且无重复
2. **组件去重**：`EditableSelectCell.vue` 已加防御性去重逻辑
3. **样式修复**：`editable-table.css` 已补充 `.is-hovering` 样式

## 验证步骤

### 1. 清除所有缓存并重启 dev server

```bash
# 停止当前运行的 dev server（Ctrl+C）

# 清除 node_modules 缓存（可选，如果问题持续）
cd frontend
rmdir /s /q node_modules\.vite

# 重启 dev server
npm run dev
```

### 2. 清除浏览器缓存

- **Chrome/Edge**：打开 DevTools (F12) → Network 标签 → 勾选"Disable cache"
- 或者：Ctrl+Shift+Delete → 清除"缓存的图像和文件"
- **强制刷新**：Ctrl+Shift+R

### 3. 查看控制台调试输出

刷新页面后，打开浏览器控制台（F12），应该看到：

```
[DEBUG] locationOptions 长度: 283
[DEBUG] locationOptions 去重后长度: 283
[DEBUG] 兰州出现次数: 1
```

**如果看到 "兰州出现次数: 2" 或其他异常**：说明浏览器还在用旧缓存，强制刷新重试。

### 4. 双击地点单元格进入编辑

控制台应该输出：

```
[DEBUG EditableSelectCell] 传入options长度: 283
[DEBUG EditableSelectCell] 去重后长度: 283
```

**如果两个数字不同**：说明上游传入的 props.options 包含重复，组件的去重逻辑会兜底处理。

### 5. 测试 hover 效果

- 所有城市项鼠标悬停应该都有浅灰色背景（`#f5f7fa`）
- 不应该再有"上面的没反馈，下面的正常"的现象

## 如果问题仍然存在

说明原因不在数据，而在 Element Plus 的渲染机制或 CSS 层叠。请提供：

1. 浏览器控制台的完整调试输出截图
2. 浏览器 DevTools → Elements 标签，选中"没有 hover 反馈"的那个选项，查看其 HTML 结构和 applied styles
3. 具体哪个城市重复了

## 修复完成后

删除 `Applications.vue` 和 `EditableSelectCell.vue` 中的调试 console.log 代码块。
