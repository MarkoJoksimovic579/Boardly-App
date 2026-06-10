import type { Task } from '@/features/tasks/data/tasksTypes'

export type List = {
  id: number
  title: string

  position: number
  brd_id: number
  tasks: Task[]
}
export type ListPayload = {
  id?: number
  title?: string
  position?: number
  brd_id?: number
}
export interface ReorderListItem {
  list_id: number
  position: number
}
