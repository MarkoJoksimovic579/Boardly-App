import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBoardUiStore = defineStore('ui', () => {
  const showAddBoard = ref(false)

  function openAddBoard() {
    showAddBoard.value = true
  }

  function closeAddBoard() {
    showAddBoard.value = false
  }

  return { showAddBoard, openAddBoard, closeAddBoard }
})
