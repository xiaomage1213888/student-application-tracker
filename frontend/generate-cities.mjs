// 一次性脚本：读取当前 cities.ts，提取所有城市字面量，
// 严格去重并按拼音字典序排序，然后重写文件
import fs from 'fs'

const text = fs.readFileSync('./src/utils/cities.ts', 'utf8')

// 严格正则：只匹配独占一行的字符串字面量（数组项）
// 形如：  '北京',
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

// 按拼音字典序排序（Node 内置 Intl，使用 zh-Hans-CN 拼音排序）
const collator = new Intl.Collator('zh-Hans-CN-u-co-pinyin', {
  sensitivity: 'variant',
})
unique.sort((a, b) => collator.compare(a, b))

// 输出新文件
const out = `// 国内主要城市列表
// 已按拼音字典序排序并去重，由 generate-cities.mjs 脚本生成
// 共 ${unique.length} 个城市
// 修改本文件后请保持唯一性与排序一致；如需重新生成可运行：
//   node generate-cities.mjs
export const cities: readonly string[] = Object.freeze([
${unique.map(c => `  '${c}',`).join('\n')}
])

// 兼容旧引用：sortedCities 已等同于 cities（已排序）
export const sortedCities: readonly string[] = cities
`

fs.writeFileSync('./src/utils/cities.ts', out, 'utf8')
console.log('✓ 已重写 cities.ts')
