// Types for API contract (derived from docs/api.json)

export type VisitorSystemInfo = {
  source_detail?: string | null
  browser?: string | null
  operating_system?: string | null
}


export type VisitorRegisterRequest = {
  platform_api_key: string
  name?: string | null
  nickname?: string | null
  avatar_url?: string | null
  phone_number?: string | null
  email?: string | null
  company?: string | null
  job_title?: string | null
  source?: string | null
  note?: string | null
  custom_attributes?: Record<string, string | null>
  system_info?: VisitorSystemInfo | null
  timezone?: string | null
  target_staff_id?: string | null
  skip_channel?: boolean
}

export type VisitorRegisterResponse = {
  id: string
  platform_open_id: string
  project_id: string
  platform_id: string
  created_at: string
  updated_at: string
  first_visit_time: string
  last_visit_time: string
  last_offline_time?: string | null
  is_online: boolean
  // Messaging (null when skip_channel=true)
  channel_id?: string | null
  channel_type?: number | null
  im_token?: string
  // Optional profile fields
  name?: string | null
  nickname?: string | null
  avatar_url?: string | null
  phone_number?: string | null
  email?: string | null
  company?: string | null
  job_title?: string | null
  source?: string | null
  note?: string | null
  custom_attributes?: Record<string, string | null>
}

export type CachedVisitor = {
  apiBase: string
  platform_api_key: string
  visitor_id: string
  platform_open_id: string
  channel_id?: string
  channel_type?: number
  im_token?: string
  project_id: string
  platform_id: string
  created_at: string
  updated_at: string
  expires_at?: number
}

// ---------------------------------------------------------------------------
// Consultation (online-diagnosis) types
// ---------------------------------------------------------------------------

export type ConsultationCreateRequest = {
  platform_api_key: string
  visitor_id: string
  staff_id: string
}

export type ConsultationSession = {
  session_id: string
  channel_id: string
  channel_type: number
  staff_id: string
  staff_name?: string | null
  staff_avatar?: string | null
  status: string
  last_message_at?: string | null
  message_count: number
  created_at: string
}

export type ConsultationListResponse = {
  data: ConsultationSession[]
}

export type ApiResponse<T> = {
  code: number
  data: T
  msg: string
}