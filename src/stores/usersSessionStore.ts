import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { computed } from 'vue'
import api from '@/api'

export const useSessionStore = defineStore('session', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null')) //pakujem string u objekat
  const sid = ref(localStorage.getItem('sid') || null)

  // LOGIN
  async function login(username: string, password: string) {
    const { data } = await api.loginUser({ username, password })

    user.value = data.user
    sid.value = data.sid

    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('sid', data.sid)
  }

  // LOGOUT
  function logout() {
    user.value = null
    sid.value = null

    localStorage.removeItem('user')
    localStorage.removeItem('sid')
    setTimeout(() => {
      router.push('/login')
    }, 800)
  }

  // CHECK
  const isLoggedIn = computed(() => !!sid.value)
  const isAdmin = computed(() => user.value?.roles?.includes('admin'))

  return { user, sid, login, logout, isLoggedIn, isAdmin }
})
