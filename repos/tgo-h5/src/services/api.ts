/** `/v1/staff` 列表项与医生详情等接口返回的医生（坐席）行 */
export interface StaffResponse {
  tgo_staff_id: any
  name: any
  title: any
  hospital: any
  goodat: any
  data: {
  ID: number
  created_at: string
  updated_at: string
  name: string
  title: string
  hospital: string
  score: number
  consult_count: number
  goodat: string
  consult_fee: number
  avatar_url: string | null
  recommend: unknown | null
  exp: number
  status: number
  content: string
  user_id: number
  phone: string
  email: string
  is_temp: boolean
  license_file: string | null
  org_id: number
  tgo_staff_id: string
  tgo_staff_status: string
  audit_status: number
  audit_remark: string
  auditor_id: number
  audit_time: string | null
}
}
/** `/v1/staff` 列表项与医生详情等接口返回的医生（坐席）行 */
export interface StaffResponseList {
  ID: number
  created_at: string
  updated_at: string
  name: string
  title: string
  hospital: string
  score: number
  consult_count: number
  goodat: string
  consult_fee: number
  avatar_url: string | null
  recommend: unknown | null
  exp: number
  status: number
  content: string
  user_id: number
  phone: string
  email: string
  is_temp: boolean
  license_file: string | null
  org_id: number
  tgo_staff_id: string
  tgo_staff_status: string
  audit_status: number
  audit_remark: string
  auditor_id: number
  audit_time: string | null
}
type ApiRequestInit = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
  baseUrl?: string
}

/** 由封装方法单独传入 body 时的 init（不含 method/body） */
export type ApiMethodInit = Omit<ApiRequestInit, 'method' | 'body'>

function toRequestBody(body: unknown): BodyInit | undefined {
  if (body === undefined || body === null) return undefined
  if (
    typeof body === 'string' ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    body instanceof FormData ||
    body instanceof URLSearchParams
  ) {
    return body as BodyInit
  }
  return JSON.stringify(body)
}

function normalizeApiBase(): string {
  const fromRuntime =
    typeof window !== 'undefined'
      ? (window as unknown as { ENV?: { VITE_API_BASE_URL?: string } }).ENV?.VITE_API_BASE_URL
      : undefined
  const raw =
    fromRuntime ||
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL ||
    '/api'
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    return `${window.location.origin}${raw}`
  }
  return raw
}

function resolveBearerToken(): string | null {
  const envToken = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_STAFF_BEARER_TOKEN
  if (envToken) return envToken
  const localToken = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (localToken) return localToken
  return null
}

export async function apiRequest<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const { baseUrl, ...requestInit } = init || {}
  const token = resolveBearerToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(requestInit.headers || {}),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const normalizedBase = (baseUrl || normalizeApiBase()).replace(/\/$/, '')
  const response = await fetch(`${normalizedBase}${normalizedPath}`, {
    ...requestInit,
    headers,
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`[API] ${response.status} ${response.statusText} ${text}`)
  }
  return (await response.json()) as T
}

export async function apiGet<T>(path: string, init?: ApiMethodInit): Promise<T> {
  return apiRequest<T>(path, { ...init, method: 'GET' })
}

export async function apiPost<T>(path: string, body?: unknown, init?: ApiMethodInit): Promise<T> {
  return apiRequest<T>(path, { ...init, method: 'POST', body: toRequestBody(body) })
}

export async function apiPut<T>(path: string, body?: unknown, init?: ApiMethodInit): Promise<T> {
  return apiRequest<T>(path, { ...init, method: 'PUT', body: toRequestBody(body) })
}

export async function apiPatch<T>(path: string, body?: unknown, init?: ApiMethodInit): Promise<T> {
  return apiRequest<T>(path, { ...init, method: 'PATCH', body: toRequestBody(body) })
}

export async function apiDelete<T>(path: string, body?: unknown, init?: ApiMethodInit): Promise<T> {
  return apiRequest<T>(path, { ...init, method: 'DELETE', body: toRequestBody(body) })
}
