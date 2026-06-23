import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { List, ListPayload, ReorderListItem } from '../data/listsTypes'
import { useSessionStore } from '@/stores/usersSessionStore'
import api from '@/api'

export const useListsStore = defineStore('lists', () => {
  const allLists = ref<List[]>([])

  const session = useSessionStore()

  async function fetchLists(brd_id: number) {
    try {
      if (!session.sid) return
      console.log('SID:', session.sid)
      const res = await api.getLists(brd_id, session.sid)
      const data = res.data.data as List[]

      allLists.value = data
    } catch (err) {
      console.log(err)
    }
  }

  async function eraseLists(brd_id: number, list_id: number) {
    try {
      if (!session.sid) return

      const res = await api.deleteLists(brd_id, list_id, session.sid)

      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  async function postList(list: ListPayload) {
    try {
      if (!session.sid) return

      const res = await api.addLists(list, session.sid)

      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  async function putList(list: ListPayload) {
    try {
      if (!session.sid) return

      const res = await api.editLists(list, session.sid)

      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  async function reorderLists(payload: { lists: ReorderListItem[] }) {
    try {
      if (!session.sid) return

      const res = await api.reorderLists(payload, session.sid)

      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  return { allLists, fetchLists, postList, eraseLists, putList, reorderLists }
})
