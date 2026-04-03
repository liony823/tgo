import { FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerVisitor, saveCachedVisitor } from '@/services/visitor'
import { resolveApiKey } from '@/utils/url'

function normalizeApiBase(): string {
  const raw = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL || '/api'
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    return `${window.location.origin}${raw}`
  }
  return raw
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiBase = useMemo(() => normalizeApiBase(), [])
  const apiKey = useMemo(() => resolveApiKey() || '', [])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!apiKey) {
      setError('缺少 URL 参数 apiKey，无法注册访客。')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const visitor = await registerVisitor({
        apiBase,
        platformApiKey: apiKey,
        extra: {
          target_staff_id:'ab43d58e-067e-4c93-8b55-07e104ccb7d7',
          nickname: nickname.trim() || undefined,
          source: 'h5-login-page',
        },
      })
      saveCachedVisitor(apiBase, apiKey, visitor)
      navigate('/im', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : '访客注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea] px-4 py-10 text-[#2f261a]">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-[#eadfcb] bg-[#fffdf8] p-6 shadow-[0_10px_26px_rgba(93,73,35,0.1)]">
        <h1 className="text-2xl font-semibold text-[#6f5318]">访客进入问诊</h1>
        <p className="mt-2 text-sm text-[#7d735f]">将按平台接口注册访客并缓存到 localStorage 后进入问诊页面。</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm text-[#6f5f46]">
            昵称（可选）
            <input
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#eadfcb] bg-white px-3 py-2 text-sm outline-none focus:border-[#b69443]"
              placeholder="请输入昵称"
            />
          </label>
          <div className="rounded-xl bg-[#f7efe0] px-3 py-2 text-xs text-[#7a5e2b] break-all">
            apiBase: {apiBase}
            <br />
            apiKey: {apiKey || '未提供'}
          </div>
          {error && <p className="rounded-xl bg-[#f8e8d8] px-3 py-2 text-xs text-[#7a4a2a]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#9b7b2f] px-4 py-2 text-sm font-medium text-[#fff9ec] disabled:opacity-60"
          >
            {loading ? '注册中...' : '进入问诊'}
          </button>
        </form>
      </div>
    </div>
  )
}

