import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { List, ListPayload, ReorderListItem } from '../data/listsTypes'
import { useSessionStore } from '@/stores/usersSessionStore'
import api from '@/api'
import { ensureSuccess } from '@/services/functions/ensureSuccess'

export const useListsStore = defineStore('lists', () => {
  const allLists = ref<List[]>([])
  const loading = ref(false)
  const session = useSessionStore()

  async function fetchLists(brd_id: number) {
    if (!session.sid) throw new Error('No session')

    loading.value = true

    try {
      const res = await api.getLists(brd_id, session.sid)
      ensureSuccess(res)

      allLists.value = res.data.data as List[]
    } finally {
      loading.value = false
    }
  }

  async function eraseLists(brd_id: number, list_id: number) {
    if (!session.sid) throw new Error('No session')

    const res = await api.deleteLists(brd_id, list_id, session.sid)
    ensureSuccess(res)
  }

  async function postList(list: ListPayload) {
    if (!session.sid) throw new Error('No session')

    const res = await api.addLists(list, session.sid)
    ensureSuccess(res)
  }

  async function putList(list: ListPayload) {
    if (!session.sid) throw new Error('No session')

    const res = await api.editLists(list, session.sid)
    ensureSuccess(res)
  }

  async function reorderLists(payload: { lists: ReorderListItem[] }) {
    if (!session.sid) throw new Error('No session')

    const res = await api.reorderLists(payload, session.sid)
    ensureSuccess(res)
  }

  return {
    allLists,
    fetchLists,
    postList,
    eraseLists,
    putList,
    reorderLists,
    loading,
  }
})
