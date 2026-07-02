export type Task = TaskCard & {
  due_date?: string
  created_by: CreatedBy
  updated_at?: string
}
export type TaskPayload = {
  title: string
  description?: string
  list_id?: number
  due_date?: string
  brd_id?: number
  labels?: number[]
}

export type TaskCard = {
  id: number
  title: string
  description: string
  position: number
  list_id: number
  brd_id: number
  is_completed?: boolean
  created_at: string
  labels: Label[]
}

export type Label = {
  id: number
  name: string
  color: string
}

export type CreatedBy = {
  id: number
  username: string
}

export type TaskDeletePayload = {
  tsk_id: number
  brd_id: number
}
export type TaskEditPayload = {
  id: number
  title: string
  description?: string
  due_date?: string
  list_id?: number
  brd_id?: number
  labels: number[] // 👈 ID-evi
}
export type DragTaskPayload = {
  tsk_id: number
  tsk_position: number
  list_id: number
  brd_id: number
}
export type Telefon = {
  tel_id: number
  tel_name: string
}
export const telList: Telefon[] = [
  {
    tel_id: 1,
    tel_name: 'iPhone 16 Pro',
  },
  {
    tel_id: 2,
    tel_name: 'Samsung Galaxy S25 Ultra',
  },
  {
    tel_id: 3,
    tel_name: 'Google Pixel 10',
  },
  {
    tel_id: 4,
    tel_name: 'Xiaomi 15',
  },
  {
    tel_id: 5,
    tel_name: 'OnePlus 13',
  },
]
