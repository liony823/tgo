import { apiPost } from './api'
import { resolveApiKey } from '@/utils/url'
export interface TransferSessionRequest {
  target_staff_id: string
  reason?: string | null
}

export interface TransferSessionResponse {
  success: boolean
  message: string
  old_session_id: string
  new_session_id?: string | null
  visitor_id: string
  from_staff_id: string
  to_staff_id: string
}

export interface TransferSessionResponse {
    success: boolean
    message: string
    old_session_id: string
    new_session_id?: string | null
    visitor_id: string
    from_staff_id: string
    to_staff_id: string
  }
      const platformApiKey = resolveApiKey() || ''
function createTransferBody(params: TransferSessionRequest): TransferSessionRequest {
  return {
    target_staff_id: params.target_staff_id,
    ...(params.reason !== undefined ? { reason: params.reason } : {reason: 'string'}),
  }
}

export const imListApi = {
  /**
   * 通过会话 ID 转移会话
   * POST /v1/sessions/{session_id}/transfer
   */
  async transferSessionBySessionId(sessionId: string, params: TransferSessionRequest) {
    console.log(`/v1/sessions/${encodeURIComponent(sessionId)}/transfer`,'=================================');
    
    return apiPost<TransferSessionResponse>(
      `/v1/sessions/${encodeURIComponent(sessionId)}/transfer`,
      createTransferBody(params),
    )
  },

  /**
   * 通过访客 ID 转移会话
   * POST /v1/sessions/visitor/{visitor_id}/transfer
   */
  async transferSessionByVisitorId(visitorId: string, params: TransferSessionRequest) {
    return apiPost<TransferSessionResponse>(
      `/v1/sessions/visitor/${encodeURIComponent(visitorId)}/transfer`,
      createTransferBody(params),
    )
  },
  //同步频道消息
  async syncChannelMessages(params: {channel_id: string, channel_type: number,limit?: number, pull_mode?: number}) {
    return apiPost<TransferSessionResponse>(
      `/v1/visitors/messages/sync`,
      {...params, platform_api_key: platformApiKey},
    )
  },
}
