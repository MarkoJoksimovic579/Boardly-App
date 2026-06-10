export type RoleOnBoard = 'owner' | 'admin' | 'member'
import dayjs from 'dayjs'

export type BoardMember = {
  id: number
  brd_id: number
  fullname: string
  username: string
}

export type Board = {
  id: number
  title: string
  description: string
  created_at: string
  members_count: number
  is_favorite?: boolean
  creator: string
  can_edit: boolean
  members: BoardMember[]
}
export function formatDate(date: string) {
  return dayjs(date).format('DD.MM.YYYY')
}

export function formatDateAndTime(date: string) {
  return dayjs(date).format('DD.MM.YYYY HH:mm')
}

export type BoardPayload = {
  id?: number
  title?: string
  description?: string
}
