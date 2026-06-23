import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { useSessionStore } from '@/stores/usersSessionStore'
import api from '@/api'
import type { User } from '../data/usersMockData'
import type { UserAddPayload } from '@/features/admin/UsersAddComp.vue'
import { ensureSuccess } from '@/services/functions/ensureSuccess'

export const useUsersStore = defineStore('users', () => {
  const session = useSessionStore()

  const usersList = ref<User[]>([])
  const nameSearch = ref('')

  const filteredUsers = computed(() => {
    let result = usersList.value

    if (nameSearch.value !== '') {
      result = result.filter((user) =>
        user.usr_fullname.toLowerCase().trim().includes(nameSearch.value.toLowerCase().trim()),
      )
    }

    return result
  })

  async function fetchUsers() {
    if (!session.sid) throw new Error('No session')

    const res = await api.getUsers(session.sid)

    ensureSuccess(res)

    usersList.value = res.data.data
  }

  async function eraseUsers(id: number) {
    if (!session.sid) throw new Error('No session')

    const res = await api.deleteUsers(id, session.sid)

    ensureSuccess(res)

    return res.data.data
  }

  async function addUsers(newUser: UserAddPayload) {
    if (!session.sid) throw new Error('No session')

    const res = await api.postUsers(newUser, session.sid) // ← ovo baca AxiosError za 403
    // ensureSuccess se nikad ne poziva za 403 jer await već baca!
    ensureSuccess(res)

    return res.data.data
  }

  async function fetchUserById(id: number) {
    if (!session.sid) throw new Error('No session')

    const res = await api.getUsersById(id, session.sid)

    ensureSuccess(res)

    return res.data.data as User
  }

  async function updateUsers(updatedUser: User) {
    if (!session.sid) throw new Error('No session')

    const res = await api.editUsers(updatedUser, session.sid)

    ensureSuccess(res)

    return res.data.data
  }

  async function adminUpdateUsers(updatedUser: User) {
    if (!session.sid) throw new Error('No session')

    const res = await api.adminEditUsers(updatedUser, session.sid)

    ensureSuccess(res)

    return res.data.data
  }

  return {
    usersList,
    nameSearch,
    filteredUsers,

    fetchUsers,
    eraseUsers,
    addUsers,
    fetchUserById,
    updateUsers,
    adminUpdateUsers,
  }
})
