/**
 * 探测医生列表接口：HTTP 状态、Content-Type、JSON 结构（是否数组或 data/list 等）。
 * 用法：
 *   node scripts/test-doctor-api.mjs
 *   node scripts/test-doctor-api.mjs http://127.0.0.1:8000
 *   node scripts/test-doctor-api.mjs http://127.0.0.1:5173/api   # 经 Vite 代理
 */
const baseArg = process.argv[2]?.replace(/\/$/, '')
const base =
  baseArg ||
  process.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://127.0.0.1:8000'

const path = '/index/doctor/getDoctorList?pageSize=80&page=0'
const url = `${base}${path}`

console.log('GET', url)

const res = await fetch(url, {
  headers: { Accept: 'application/json' },
})

const ct = res.headers.get('content-type') || ''
const text = await res.text()

console.log('status:', res.status, res.statusText)
console.log('content-type:', ct)

let parsed
try {
  parsed = JSON.parse(text)
} catch {
  console.log('body (not JSON, first 400 chars):')
  console.log(text.slice(0, 400))
  process.exit(res.ok ? 1 : 2)
}

const isArr = Array.isArray(parsed)
const keys = parsed && typeof parsed === 'object' && !isArr ? Object.keys(parsed) : []
console.log('json: array =', isArr, isArr ? `length=${parsed.length}` : `keys=${keys.join(',')}`)

if (!isArr && parsed && typeof parsed === 'object') {
  for (const k of ['data', 'list', 'records', 'items', 'rows']) {
    const v = parsed[k]
    if (Array.isArray(v)) console.log(`  .${k}: array length=${v.length}`)
  }
}

process.exit(res.ok ? 0 : 2)
