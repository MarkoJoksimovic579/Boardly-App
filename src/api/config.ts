import { useSessionStore } from '@/stores/usersSessionStore'
import axios, { HttpStatusCode } from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

instance.interceptors.request.use((config) => {
  if (!config.params) {
    config.params = {}
  }
  const sid = localStorage.getItem('sid')
  config.params.sid = sid
  return config
})
instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      useSessionStore().logout()
    }
    return Promise.reject(error)
  },
)

export default instance
