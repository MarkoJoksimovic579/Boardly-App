import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { useSessionStore } from '@/stores/usersSessionStore'
import api from '@/api'
import type { Board, BoardPayload } from '../data/boardsTypes'

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
    try {
      if (!session.sid) return

      const res = await api.getBoards(session.sid)
      const data = res.data.data as Board[]

      boardsList.value = data
    } catch (err) {
      console.log(err)
    }
  }

  async function eraseBoards(id: number) {
    try {
      if (!session.sid) return

      const res = await api.deleteBoards(id, session.sid)

      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
  async function putBoards(updatedBoard: BoardPayload) {
    try {
      if (!session.sid) return

      const res = await api.editBoards(updatedBoard, session.sid)

      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
  async function postBoards(board: BoardPayload) {
    try {
      if (!session.sid) return
      console.log('SID:', session.sid)
      const res = await api.addBoards(board, session.sid)

      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  async function eraseFavorites(id: number) {
    try {
      if (!session.sid) return
      await api.deleteFavorites(id, session.sid)
    } catch (err) {
      console.log(err)
    }
  }
  async function addFavorites(id: number) {
    try {
      if (!session.sid) return
      await api.postFavorites(id, session.sid)
    } catch (err) {
      console.log(err)
    }
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
