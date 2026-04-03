import { Doctor } from "@/types/doctor"
import { ApiResponse } from "@/types/api"
import { apiRequest } from "./api"

export interface DoctorListPageResult {
    list: Doctor[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
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

export const bizApi = {
    // 医生列表
    async getDoctorList(params?: { pageSize?: number; page?: number }): Promise<DoctorListPageResult> {
        const pageSize = params?.pageSize ?? 10
        const page = params?.page ?? 1
        const query = new URLSearchParams({ pageSize: String(pageSize), page: String(page) })

        const { data } = await apiRequest<ApiResponse<{ list: Doctor[], total: number }>>(`index/doctor/getDoctorList?${query.toString()}`, {
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
