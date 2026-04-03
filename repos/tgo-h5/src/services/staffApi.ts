import { Doctor } from '@/types/doctor'
import { ApiResponse } from '@/types/api'
import { apiRequest, type StaffResponse, type StaffResponseList  } from './api'

export type { StaffResponse }

export interface StaffListResponse {
  data: StaffResponseList[]
  pagination: {
    total: number
    limit: number
    offset: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface DoctorListPageResult {
  list: Doctor[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/** 兼容后端返回「裸数组」或 { data/list/... } 包装 */
function parseDoctorListPayload(raw: unknown): StaffResponseList[] {
  if (Array.isArray(raw)) return raw as StaffResponseList[]
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    for (const key of ['data', 'list', 'records', 'items', 'rows'] as const) {
      const v = o[key]
      if (Array.isArray(v)) return v as StaffResponseList[]
    }
    const data = o.data
    if (data && typeof data === 'object') {
      const inner = data as Record<string, unknown>
      for (const key of ['list', 'records', 'items', 'rows'] as const) {
        const v = inner[key]
        if (Array.isArray(v)) return v as StaffResponseList[]
      }
    }
  }
  return []
}

function normalizeDoctorApiBase(): string {
  const fromRuntime =
    typeof window !== 'undefined'
      ? (window as unknown as { ENV?: { VITE_DOCTOR_API_BASE_URL?: string } }).ENV?.VITE_DOCTOR_API_BASE_URL
      : undefined
  const raw =
    fromRuntime ||
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_DOCTOR_API_BASE_URL ||
    '/apidoctor'
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    return `${window.location.origin}${raw}`
  }
  return raw
}

export const staffApi = {
  async listStaff(params?: { limit?: number; offset?: number }) {
    const limit = params?.limit ?? 80
    const offset = params?.offset ?? 0
    const query = new URLSearchParams({ limit: String(limit), offset: String(offset) })
    return apiRequest<StaffListResponse>(`/v1/staff?${query.toString()}`)
  },

  async getStaff(id: string) {
    return apiRequest<StaffResponse>(`/v1/staff/${encodeURIComponent(id)}`)
  },

  async getOnlineStatus(staffIds: string[]) {
    if (staffIds.length === 0) return {} as Record<string, boolean>
    return apiRequest<Record<string, boolean>>('/v1/staff/wukongim/online-status', {
      method: 'POST',
      body: JSON.stringify({ staff_ids: staffIds }),
    })
  },
  // 医生列表
  async getDoctorList(params?: { pageSize?: number; page?: number }): Promise<DoctorListPageResult> {
    const pageSize = params?.pageSize ?? 10
    const page = params?.page ?? 1
    const query = new URLSearchParams({ pageSize: String(pageSize), page: String(page) })

    const {data} = await apiRequest<ApiResponse<{list: Doctor[], total: number}>>(`index/doctor/getDoctorList?${query.toString()}`, {
      baseUrl: normalizeDoctorApiBase(),
    })

    const list = data?.list ?? []
    const total = Number(data?.total ?? 0)
    const hasMore = total > 0 ? page * pageSize < total : list.length === pageSize

    return {
      list,
      total,
      page,
      pageSize,
      hasMore,
    }
  },
  //医生详情
  async getDoctorDetail(ID: number | string) {
    return apiRequest<ApiResponse<Doctor>>(`index/doctor/findDoctor?ID=${ID}`, {
      baseUrl: normalizeDoctorApiBase(),
    })
  },
}

