import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import api from '@/api'
import { ensureSuccess } from '@/services/functions/ensureSuccess'

export const useSessionStore = defineStore('session', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const sid = ref(localStorage.getItem('sid') || null)

  const usr_id = computed(() => user.value?.usr_id)

  const isLoggedIn = computed(() => !!sid.value)

  const isAdmin = computed(() => user.value?.roles?.includes('admin') ?? false)
  const isOwner = computed(() => user.value?.roles?.includes('owner') ?? false)

  async function login(username: string, password: string) {
    const res = await api.loginUser({ username, password })

    ensureSuccess(res)

    const { user: loggedUser, sid: sessionId } = res.data.data

    user.value = loggedUser
    sid.value = sessionId

    localStorage.setItem('user', JSON.stringify(loggedUser))
    localStorage.setItem('sid', sessionId)

    return res.data.data
  }

  function logout() {
    user.value = null
    sid.value = null

    localStorage.removeItem('user')
    localStorage.removeItem('sid')

    router.push('/login')
  }

  return {
    user,
    sid,
    usr_id,
    login,
    logout,
    isLoggedIn,
    isAdmin,
    isOwner,
  }
})
