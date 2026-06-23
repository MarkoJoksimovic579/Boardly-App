<script setup lang="ts">
import api from '@/api'
import BoardsAddComp from '@/features/boards/components/BoardsAddComp.vue'
import BoardsCardComp from '@/features/boards/components/BoardsCardComp.vue'
import BoardsEditComp from '@/features/boards/components/BoardsEditComp.vue'
import type { Board, BoardMember, BoardPayload } from '@/features/boards/data/boardsTypes'

import { useBoardStore } from '@/features/boards/stores/boardsStore'
import { useBoardUiStore } from '@/features/boards/stores/boardUiStore'
import MebemersView from '@/features/users/components/MebemersView.vue'

import MemebersAddModal from '@/features/users/components/MemebersAddModal.vue'
import { ensureSuccess } from '@/services/functions/ensureSuccess'
import { useAsyncAction } from '@/services/functions/useAsyncAction'
import { useConfirmStore } from '@/stores/confirmStore'
import { useMessageStore } from '@/stores/messageStore'
import { useSessionStore } from '@/stores/usersSessionStore'

import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const boardStore = useBoardStore()
const session = useSessionStore()
const isSavingBoard = ref(false)

const confirmStore = useConfirmStore()

const messageStore = useMessageStore()

const ui = useBoardUiStore()

const showEditModal = ref(false)

const showAddMembers = ref(false)
const showMembersView = ref(false)

const router = useRouter()

function openBoard(id: number) {
  router.push(`/app/boards/${id}`)
}

const selectedBoard = ref<Board>()

const isBoardLoading = ref(false)
async function handleDelete(id: number) {
  const confirmed = await confirmStore.ask({
    title: 'Delete board',
    message: 'Are you sure you want to delete this board?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  })

  if (!confirmed) return
  try {
    isBoardLoading.value = true

    await boardStore.eraseBoards(id)
    await boardStore.fetchBoards()

    messageStore.success('Board deleted successfully')
  } catch (err) {
    console.log(err)
    messageStore.fail('Failed to delete board')
  } finally {
    isBoardLoading.value = false
  }
}
const boardForEdit = ref<BoardPayload>()

function handleEdit(selectedBoard: BoardPayload) {
  boardForEdit.value = selectedBoard
  showEditModal.value = true
}

async function saveEdit(board: BoardPayload) {
  try {
    isSavingBoard.value = true

    await boardStore.putBoards(board)

    messageStore.success('Board updated successfully')
    showEditModal.value = false
  } catch {
    messageStore.fail('Failed to update board')
  } finally {
    isSavingBoard.value = false
  }
}

async function saveAdd(newBoard: BoardPayload) {
  try {
    isSavingBoard.value = true

    await boardStore.postBoards(newBoard)
    await boardStore.fetchBoards()

    messageStore.success('Board je uspešno dodat')
    ui.closeAddBoard()
  } catch (err) {
    console.error(err)
    messageStore.fail('Greška prilikom dodavanja boarda')
  } finally {
    isSavingBoard.value = false
  }
}
async function toggleFavorites(id: number) {
  const board = boardStore.boardsList.find((b) => b.id === id)
  if (!board) return

  board.is_favorite = !board.is_favorite // optimistic

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
const brd_id = ref<number | null>(null)

function handleAddMembers(id: number) {
  const board = boardStore.boardsList.find((b) => b.id === id)

  if (!board) return

  selectedBoard.value = board
  brd_id.value = id
  showAddMembers.value = true
}
const { loading: isMembersLoading, run } = useAsyncAction()

async function handleSaveAdded(members: number[]) {
  if (!session.sid || brd_id.value === null) return

  await run(
    async () => {
      await api.postMembers(members, brd_id.value!, session.sid!)
      await boardStore.fetchBoards()

      showAddMembers.value = false
    },
    {
      success: 'Members added successfully',
      error: 'Failed to add members',
    },
  )
}
const boardMembers = ref<BoardMember[]>([])

function handleShowMembers(board: Board) {
  selectedBoard.value = board
  showMembersView.value = true

  boardMembers.value = board.members.filter((m) => m.id !== board.created_by)
}

//pagination
const currentPage = ref(1)
const boardsPerPage = 6
const totalPages = computed(() => {
  return Math.ceil(boardStore.filteredBoards.length / boardsPerPage)
})

const paginatedBoards = computed(() => {
  const start = (currentPage.value - 1) * boardsPerPage
  const end = start + boardsPerPage

  return boardStore.filteredBoards.slice(start, end)
})

async function leaveBoard(brd_id: number) {
  if (!session.sid || !session.user) return

  const confirmed = await confirmStore.ask({
    title: 'Leave board',
    message: 'Are you sure you want to leave this board?',
    confirmText: 'Leave',
    cancelText: 'Cancel',
    variant: 'danger',
  })

  if (!confirmed) return

  await run(
    async () => {
      if (!session.sid) return
      const res = await api.deleteMembers(brd_id, session.usr_id, session.sid)

      ensureSuccess(res)
      boardStore.fetchBoards()
    },
    {
      success: 'You left the board',
      error: 'Failed to leave the board',
    },
  )
}

watch(
  () => totalPages.value,
  (newTotal) => {
    if (currentPage.value > newTotal) {
      currentPage.value = Math.max(1, newTotal) // ne da page 3 of2 , nego te vraca na 2of2
    }
  },
)
watch(
  () => boardStore.titleSearch, // gleda direktno u store
  () => {
    currentPage.value = 1
  },
)

onMounted(() => boardStore.fetchBoards())
</script>

<template>
  <div class="p-8 min-h-screen flex flex-col">
    <!-- HEADER -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-text-title">Your Boards</h1>
      <p class="text-text-body text-sm mt-1">Manage your projects and workflows</p>
    </div>

    <!-- GRID -->
    <div class="min-h-150">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <BoardsCardComp
          v-for="board in paginatedBoards"
          :key="board.id"
          :board="board"
          @open="openBoard"
          @delete="handleDelete"
          @edit="handleEdit"
          @toggle-favorite="toggleFavorites"
          @add-members="handleAddMembers"
          @show-members="handleShowMembers"
          @leave-board="leaveBoard"
        />
      </div>
    </div>
    <BoardsAddComp
      v-if="ui.showAddBoard"
      :loading="isSavingBoard"
      @save="saveAdd"
      @cancel="ui.closeAddBoard"
    />
    <BoardsEditComp
      v-if="showEditModal && boardForEdit"
      :board="boardForEdit as BoardPayload"
      :loading="isSavingBoard"
      @cancel="showEditModal = false"
      @save="saveEdit"
    />
    <MemebersAddModal
      v-if="showAddMembers && selectedBoard"
      :members="selectedBoard.members"
      :loading="isMembersLoading"
      @add="handleSaveAdded"
      @cancel="showAddMembers = false"
    />

    <MebemersView
      v-if="showMembersView && selectedBoard"
      @cancel="showMembersView = false"
      :members="boardMembers"
      :can-edit="selectedBoard.can_edit"
      @deleted="boardStore.fetchBoards"
    />

    <div
      v-if="totalPages > 1"
      class="flex items-center justify-center gap-2 pt-3 border-t border-border-divider mt-3"
    >
      <button
        class="w-7 h-7 flex items-center justify-center rounded-lg border border-border-default text-text-subtle hover:text-text-title hover:border-border-hover transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <span class="text-text-accent text-xs tabular-nums">
        {{ currentPage }} / {{ totalPages }}
      </span>

      <button
        class="w-7 h-7 flex items-center justify-center rounded-lg border border-border-default text-text-subtle hover:text-text-title hover:border-border-hover transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
