// 一次性脚本：读取当前 cities.ts，提取所有城市字面量，
// 按优先级分层排序（一线 > 省会/新一线 > 其他），然后重写文件
import fs from 'fs'

const text = fs.readFileSync('./src/utils/cities.ts', 'utf8')

// 严格正则：只匹配独占一行的字符串字面量（数组项）
const lines = text.split(/\r?\n/)
const cityLineRe = /^\s*'([^']+)',?\s*$/
const raw = lines
  .map(l => {
    const m = l.match(cityLineRe)
    return m ? m[1] : null
  })
  .filter(Boolean)

console.log('原始数组项数:', raw.length)

// 去重
const unique = [...new Set(raw)]
console.log('去重后:', unique.length)

// 定义城市优先级
const tier1 = ['北京', '上海', '广州', '深圳'] // 一线城市

const tier2 = [
  // 新一线城市 + 省会城市（按经济规模和热度排序）
  '杭州', '成都', '重庆', '武汉', '西安', '天津', '苏州',
  '南京', '长沙', '郑州', '沈阳', '青岛', '宁波', '东莞',
  '合肥', '昆明', '福州', '厦门', '济南', '哈尔滨',
  '石家庄', '长春', '南昌', '贵阳', '太原', '南宁',
  '兰州', '呼和浩特', '乌鲁木齐', '西宁', '银川', '拉萨', '海口',
]

// 分层
const tier1Cities = tier1.filter(c => unique.includes(c))
const tier2Cities = tier2.filter(c => unique.includes(c))
const tier3Cities = unique.filter(c => !tier1.includes(c) && !tier2.includes(c))

// tier3 按拼音排序
const collator = new Intl.Collator('zh-Hans-CN-u-co-pinyin', {
  sensitivity: 'variant',
})
tier3Cities.sort((a, b) => collator.compare(a, b))

// 合并
const sorted = [...tier1Cities, ...tier2Cities, ...tier3Cities]

console.log('分层统计:')
console.log('  一线城市:', tier1Cities.length, tier1Cities)
console.log('  省会/新一线:', tier2Cities.length)
console.log('  其他城市:', tier3Cities.length)

// 输出新文件
const out = `// 国内主要城市列表
// 已按优先级分层排序：一线城市 > 省会/新一线 > 其他（拼音序）
// 由 generate-cities.mjs 脚本生成，共 ${sorted.length} 个城市
// 修改本文件后请保持唯一性；如需重新生成可运行：
//   node generate-cities.mjs

// ===== 一线城市 =====
export const tier1Cities: readonly string[] = Object.freeze([
${tier1Cities.map(c => `  '${c}',`).join('\n')}
])

// ===== 省会城市 & 新一线城市 =====
export const tier2Cities: readonly string[] = Object.freeze([
${tier2Cities.map(c => `  '${c}',`).join('\n')}
])

// ===== 其他城市（拼音序） =====
export const tier3Cities: readonly string[] = Object.freeze([
${tier3Cities.map(c => `  '${c}',`).join('\n')}
])

// ===== 完整列表（优先级排序） =====
export const cities: readonly string[] = Object.freeze([
${sorted.map(c => `  '${c}',`).join('\n')}
])

// 兼容旧引用：sortedCities 已等同于 cities（已分层排序）
export const sortedCities: readonly string[] = cities
`

fs.writeFileSync('./src/utils/cities.ts', out, 'utf8')
console.log('✓ 已重写 cities.ts，采用分层排序')

