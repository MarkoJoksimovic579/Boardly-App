export type User = {
  usr_id: number
  usr_fullname: string
  usr_username: string
  usr_email: string
  roles: Role[]
}
export type Role = {
  rol_id: number
  rol_name: string
}
