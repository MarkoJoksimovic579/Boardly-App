export type Comment = {
  id: number
  username: string
  text: string
  created_at: string
}
export type CommentPayload = {
  tsk_id: number
  com_text: string
}
