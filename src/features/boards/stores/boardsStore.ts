import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { useSessionStore } from '@/stores/usersSessionStore'
import api from '@/api'
import type { Board, BoardPayload } from '../data/boardsTypes'
import { ensureSuccess } from '@/services/functions/ensureSuccess'

export const useBoardStore = defineStore('boards', () => {
  const boardsList = ref<Board[]>([])

  const latestBoards = computed(() => {
    return [...boardsList.value]
      .sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
      .slice(0, 3)
  })

  const titleSearch = ref('')

  const filteredBoards = computed(() => {
    let result = boardsList.value

    if (titleSearch.value !== '') {
      result = result.filter((board) =>
        board.title.toLocaleLowerCase().includes(titleSearch.value.toLocaleLowerCase()),
      )
    }

    return result
  })

  //function getBoardById(id:number)

  const session = useSessionStore()

  async function fetchBoards() {
    if (!session.sid) throw new Error('No session')

    const res = await api.getBoards()

    ensureSuccess(res)

    boardsList.value = res.data.data
  }

  async function eraseBoards(id: number) {
    if (!session.sid) throw new Error('No session')

    const res = await api.deleteBoards(id, session.sid)

    ensureSuccess(res)

    return res.data.data
  }

  async function putBoards(updatedBoard: BoardPayload) {
    if (!session.sid) throw new Error('No session')

    const res = await api.editBoards(updatedBoard, session.sid)

    ensureSuccess(res)

    await fetchBoards()

    return res.data.data
  }

  async function postBoards(board: BoardPayload) {
    if (!session.sid) throw new Error('No session')

    const res = await api.addBoards(board, session.sid)

    ensureSuccess(res)

    return res.data.data
  }

  async function eraseFavorites(id: number) {
    if (!session.sid) throw new Error('No session')

    const res = await api.deleteFavorites(id, session.sid)

    ensureSuccess(res)

    return res.data.data
  }

  async function addFavorites(id: number) {
    if (!session.sid) throw new Error('No session')

    const res = await api.postFavorites(id, session.sid)

    ensureSuccess(res)

    return res.data.data
  }

  return {
    boardsList,
    titleSearch,
    filteredBoards,
    latestBoards,
    fetchBoards,
    eraseBoards,
    postBoards,
    putBoards,
    addFavorites,
    eraseFavorites,
  }
})
