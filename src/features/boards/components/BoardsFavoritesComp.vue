<script setup lang="ts">
import BoardsCardComp from '@/features/boards/components/BoardsCardComp.vue'
import BoardsEditComp from '@/features/boards/components/BoardsEditComp.vue'
import type { BoardPayload } from '@/features/boards/data/boardsTypes'

import { useBoardStore } from '@/features/boards/store/boardsStore'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const boardStore = useBoardStore()
const showEditModal = ref(false)
const router = useRouter()

const favoriteBoards = computed(() => boardStore.boardsList.filter((b) => b.is_favorite))

function openBoard(id: number) {
  router.push(`/app/boards/${id}`)
}

function handleDelete(id: number) {
  boardStore.eraseBoards(id)
  boardStore.fetchBoards()
}

const boardForEdit = ref<BoardPayload>()

function handleEdit(selectedBoard: BoardPayload) {
  boardForEdit.value = selectedBoard
  showEditModal.value = true
}

async function saveEdit(updatedBoard: BoardPayload) {
  try {
    await boardStore.putBoards(updatedBoard)
    boardStore.fetchBoards()
    setTimeout(() => {
      showEditModal.value = false
    }, 1500)
  } catch (err) {
    console.error(err)
  }
}

async function toggleFavorites(id: number) {
  const board = boardStore.boardsList.find((b) => b.id === id)
  if (!board) return

  board.is_favorite = !board.is_favorite

  try {
    if (board.is_favorite) {
      await boardStore.addFavorites(id)
    } else {
      await boardStore.eraseFavorites(id)
    }
  } catch (err) {
    board.is_favorite = !board.is_favorite
    console.log(err)
  }
}

onMounted(() => boardStore.fetchBoards())
</script>

<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-white/80">Favorite Boards</h1>
      <p class="text-white/30 text-sm mt-1">Boards you've marked as favorite</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <BoardsCardComp
        v-for="board in favoriteBoards"
        :key="board.id"
        :board="board"
        @open="openBoard"
        @delete="handleDelete"
        @edit="handleEdit"
        @toggle-favorite="toggleFavorites"
      />

      <div v-if="favoriteBoards.length === 0" class="text-white/30 text-sm col-span-3">
        No favorite boards yet.
      </div>
    </div>

    <BoardsEditComp
      v-if="showEditModal && boardForEdit"
      :board="boardForEdit as BoardPayload"
      @cancel="showEditModal = false"
      @save="saveEdit"
    ></BoardsEditComp>
  </div>
</template>
