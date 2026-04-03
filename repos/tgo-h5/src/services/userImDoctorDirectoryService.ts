import type { StaffResponseList } from '@/services/api'
import { staffApi } from '@/services/staffApi'
import type { Doctor } from '@/types/doctor'

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=240&q=80'

function staffRowToDoctorCard(s: StaffResponseList, onlineFromWuKong: boolean | undefined): Doctor {
  const dbOnline = s.tgo_staff_status?.toLowerCase() === 'online'
  const isOnline = typeof onlineFromWuKong === 'boolean' ? onlineFromWuKong : dbOnline
  return {
    ID: s.ID,
    name: s.name,
    title: s.title?.trim() ? s.title : '医师',
    avatar: s.avatar_url?.trim() ? s.avatar_url : FALLBACK_AVATAR,
    tags: s.hospital?.trim() ? [s.hospital.trim()] : [],
    description:
      s.goodat?.trim() ||
      '可为您提供健康咨询与分诊引导，实际会话由平台客服频道承载。',
    status: isOnline ? 'online' : 'offline',
    category: '全部',
    staffId: s.tgo_staff_id,
  }
}

function matchesCategory(staff: StaffResponseList, category: string): boolean {
  if (category === '全部') return true
  const text = `${staff.name} ${staff.title} ${staff.goodat} ${staff.hospital}`.toLowerCase()
  if (category === '针灸') return text.includes('针')
  if (category === '草本医学') return text.includes('草') || text.includes('药')
  if (category === '体质调理') return text.includes('体质') || text.includes('调理')
  return true
}

export async function fetchUserImDoctorList(category: string): Promise<Doctor[]> {
  const { data } = await staffApi.listStaff({ limit: 80, offset: 0 })
  const filtered = data.filter(staff => matchesCategory(staff, category))
  if (filtered.length === 0) return []
  const ids = filtered.map(s => s.tgo_staff_id)
  const onlineMap = await staffApi.getOnlineStatus(ids)
  return filtered.map(s => staffRowToDoctorCard(s, onlineMap[s.tgo_staff_id]))
}

