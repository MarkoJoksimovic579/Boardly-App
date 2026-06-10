import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { useSessionStore } from '@/stores/usersSessionStore'
import api from '@/api'
import type { User } from '../data/usersMockData'
import type { UserAddPayload } from '@/features/admin/UsersAddComp.vue'

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
    try {
      if (!session.sid) return

      const res = await api.getUsers(session.sid)

      if (res) {
        const data = res.data.data
        usersList.value = data
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function eraseUsers(id: number) {
    try {
      if (!session.sid) return

      const res = await api.deleteUsers(id, session.sid)

      if (res.data.success) {
        fetchUsers()
        alert('user deleted')
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function addUsers(newUser: UserAddPayload) {
    try {
      if (!session.sid) return

      const res = await api.postUsers(newUser, session.sid)

      if (res.data.success) {
        fetchUsers()
        alert('user added')
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function fetchUserById(id: number) {
    try {
      if (!session.sid) return

      const res = await api.getUsersById(id, session.sid)

      if (res) {
        const data = res.data.data
        return data as User
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function updateUsers(updatedUser: User) {
    try {
      if (!session.sid) return

      const res = await api.editUsers(updatedUser, session.sid)

      return res.data.message
    } catch (err) {
      console.log(err)
    }
  }
  async function adminUpdateUsers(updatedUser: User) {
    try {
      if (!session.sid) return

      const res = await api.adminEditUsers(updatedUser, session.sid)
      if (res.data.success) {
        fetchUsers()
        alert('user edited')
      }
      return res.data.message
    } catch (err) {
      console.log(err)
    }
  }

  return {
    usersList,
    fetchUsers,
    filteredUsers,
    nameSearch,
    eraseUsers,
    addUsers,
    fetchUserById,
    updateUsers,
    adminUpdateUsers,
  }
})
