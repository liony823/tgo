import type { ConsultationSession, ConsultationListResponse } from '../types/api'

/**
 * Create a 1-on-1 consultation session between a visitor and a staff (doctor).
 * If an OPEN session already exists for the same pair, the server returns it (idempotent).
 */
export async function createConsultation(params: {
  apiBase: string
  platformApiKey: string
  visitorId: string
  staffId: string
  signal?: AbortSignal
}): Promise<ConsultationSession> {
  const { apiBase, platformApiKey, visitorId, staffId, signal } = params
  const url = `${apiBase.replace(/\/$/, '')}/v1/visitors/consultations`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform_api_key: platformApiKey,
        visitor_id: visitorId,
        staff_id: staffId,
      }),
      signal: signal ?? controller.signal,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`[Consultation] create failed: ${res.status} ${res.statusText} ${text}`)
    }

    const data = (await res.json()) as ConsultationSession
    if (!data?.session_id || !data?.channel_id) {
      throw new Error('[Consultation] invalid response: missing session_id or channel_id')
    }
    return data
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * List all consultation sessions for a visitor (optionally including closed ones).
 */
export async function listConsultations(params: {
  apiBase: string
  platformApiKey: string
  visitorId: string
  includeClosed?: boolean
  signal?: AbortSignal
}): Promise<ConsultationSession[]> {
  const { apiBase, platformApiKey, visitorId, includeClosed, signal } = params
  const qs = new URLSearchParams({
    platform_api_key: platformApiKey,
    visitor_id: visitorId,
  })
  if (includeClosed) qs.set('include_closed', 'true')

  const url = `${apiBase.replace(/\/$/, '')}/v1/visitors/consultations?${qs.toString()}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: signal ?? controller.signal,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`[Consultation] list failed: ${res.status} ${res.statusText} ${text}`)
    }

    const body = (await res.json()) as ConsultationListResponse
    return body?.data ?? []
  } finally {
    clearTimeout(timeout)
  }
}
