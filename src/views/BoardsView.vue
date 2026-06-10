<script setup lang="ts">
import api from '@/api'
import BoardsAddComp from '@/features/boards/components/BoardsAddComp.vue'
import BoardsCardComp from '@/features/boards/components/BoardsCardComp.vue'
import BoardsEditComp from '@/features/boards/components/BoardsEditComp.vue'
import type { BoardMember, BoardPayload } from '@/features/boards/data/boardsTypes'

import { useBoardStore } from '@/features/boards/store/boardsStore'
import { useBoardUiStore } from '@/features/boards/store/boardUiStore'
import MebemersView from '@/features/users/components/MebemersView.vue'

import MemebersAddModal from '@/features/users/components/MemebersAddModal.vue'
import { useSessionStore } from '@/stores/usersSessionStore'

import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const boardStore = useBoardStore()
const session = useSessionStore()

const ui = useBoardUiStore()

const showEditModal = ref(false)
const showAddModal = ref(false)
const showAddMembers = ref(false)
const showMembersView = ref(false)
const route = useRoute()
const router = useRouter()

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

async function saveAdd(newBoard: BoardPayload) {
  try {
    await boardStore.postBoards(newBoard)
    boardStore.fetchBoards()
    setTimeout(() => {
      ui.closeAddBoard()
    }, 1500)
  } catch (err) {
    console.error(err)
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
  brd_id.value = id
  showAddMembers.value = true
}
async function handleSaveAdded(members: number[]) {
  try {
    if (!session.sid || brd_id.value === null) return
    await api.postMembers(members, brd_id.value, session.sid)
    boardStore.fetchBoards()
    setTimeout(() => {
      showAddMembers.value = false
    }, 1500)
  } catch (err) {
    console.log(err)
  }
}
const boardMembers = ref<BoardMember[]>([])

function handleShowMembers(members: BoardMember[]) {
  showMembersView.value = true
  boardMembers.value = members
}

onMounted(() => {
  if (route.query.create === '1') {
    showAddModal.value = true
  }
})

onMounted(() => boardStore.fetchBoards())
</script>

<template>
  <div class="p-8">
    <!-- HEADER -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-text-title">Your Boards</h1>
      <p class="text-text-body text-sm mt-1">Manage your projects and workflows</p>
    </div>

    <!-- GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <BoardsCardComp
        v-for="board in boardStore.filteredBoards"
        :key="board.id"
        :board="board"
        @open="openBoard"
        @delete="handleDelete"
        @edit="handleEdit"
        @toggle-favorite="toggleFavorites"
        @add-members="handleAddMembers"
        @show-members="handleShowMembers"
      />
    </div>
    <BoardsAddComp v-if="ui.showAddBoard" @cancel="ui.closeAddBoard" @save="saveAdd" />
    <BoardsEditComp
      v-if="showEditModal && boardForEdit"
      :board="boardForEdit as BoardPayload"
      @cancel="showEditModal = false"
      @save="saveEdit"
    />
    <MemebersAddModal
      v-if="showAddMembers"
      @cancel="showAddMembers = false"
      @add="handleSaveAdded"
    />
    <MebemersView
      v-if="showMembersView"
      @cancel="showMembersView = false"
      :members="boardMembers"
      @deleted="boardStore.fetchBoards"
    />
  </div>
</template>
