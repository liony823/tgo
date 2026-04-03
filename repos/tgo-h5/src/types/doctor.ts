export type DoctorStatus = 'online' | 'offline' | 'busy'

export interface Doctor {
  ID: number
  name: string
  title: string
  avatar_url: string
  tags: string[]
  content: string
  status: number|string
  category: string
  hospital: string
  goodat: string
  tgo_staff_id: string
  tgo_staff_status: string
}

