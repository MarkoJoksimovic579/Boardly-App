<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ListPayload } from '/home/marko/Documents/Projects/praksa/Trello/src/features/lists/data/listsTypes.ts'

import { useBoardStore } from '@/features/boards/store/boardsStore'
import ListOfLists from '@/features/lists/components/ListOfLists.vue'
import { useListsStore } from '@/features/lists/store/listsStore'
import ListAddComp from '@/features/lists/components/ListAddComp.vue'
import ListEditComp from '@/features/lists/components/ListEditComp.vue'

const listStore = useListsStore()
const route = useRoute()
const router = useRouter()

function openTask(id: number) {
  router.push(`/app/tasks/${id}`)
}

const showAddListModal = ref(false)

const showEditListModal = ref(false)
const boardId = Number(route.params.id)
const boardsStore = useBoardStore()

const board = computed(() => boardsStore.boardsList.find((b) => b.id === boardId))

async function handleAddList(list: ListPayload) {
  try {
    await listStore.postList({
      ...list,
      brd_id: boardId, // im adding brd_id so i can check if user is owner of board, only then he can add it
    })
    listStore.fetchLists(boardId)
    showAddListModal.value = false
  } catch (err) {
    console.error(err)
  }
}

const selectedList = ref<ListPayload>()

function handleEditList(list: ListPayload) {
  showEditListModal.value = true
  selectedList.value = list
}

async function saveEditList(updatedList: ListPayload) {
  try {
    await listStore.putList({ ...updatedList, brd_id: boardId })

    listStore.fetchLists(boardId)
    showEditListModal.value = false
  } catch (err) {
    console.log(err)
  }
}

async function handleDeleteList(list_id: number) {
  try {
    await listStore.eraseLists(boardId, list_id)
    listStore.fetchLists(boardId)
    alert('list deleted')
  } catch (err) {
    console.error(err)
  }
}
function fetchLists() {
  listStore.fetchLists(boardId)
}

onMounted(() => {
  fetchLists()
  boardsStore.fetchBoards()
})

watch(
  () => route.params.id,

  (newId) => {
    if (!newId) return

    listStore.fetchLists(Number(newId))
  },
)
</script>

<template>
  <div class="h-full flex flex-col gap-5 text-white">
    <!-- HEADER -->

    <div
      class="px-8 py-6 border-b border-white/[0.06] bg-[#0a0a0a]/60 backdrop-blur flex items-center justify-between"
    >
      <div>
        <h1 class="text-xl font-semibold text-white/80 tracking-tight">
          {{ board?.title }}
        </h1>
        <p class="text-white/30 text-sm mt-0.5">
          {{ board?.description }}
        </p>
      </div>

      <button
        v-if="board?.can_edit"
        @click="showAddListModal = true"
        class="flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
        style="background: linear-gradient(135deg, #6366f1, #8b5cf6)"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add list
      </button>
    </div>
    <div class="self-center text-4xl font-semibold">Board lists</div>
    <!-- LISTS -->

    <div class="flex-1 overflow-x-auto p-8 scrollbar-custom">
      <template v-if="listStore.allLists.length">
        <ListOfLists
          :lists="listStore.allLists"
          :canEdit="board?.can_edit ?? false"
          @open-task="openTask"
          @open-modal="showAddListModal = true"
          @delete="handleDeleteList"
          @edit="handleEditList"
          @fetch-tasks="fetchLists"
        />
      </template>

      <template v-else>
        <div class="h-full flex flex-col items-center justify-center text-center">
          <div class="text-8xl mb-6">📋</div>

          <h2 class="text-3xl font-semibold text-white">This board is empty</h2>

          <p class="mt-3 text-white/50 max-w-md">
            Create your first list and start organizing your tasks.
          </p>

          <button
            v-if="board?.can_edit"
            @click="showAddListModal = true"
            class="mt-6 px-5 py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
            style="background: linear-gradient(135deg, #6366f1, #8b5cf6)"
          >
            Create first list
          </button>
        </div>
      </template>
    </div>
    <ListAddComp
      v-if="showAddListModal && boardId"
      :board-id="boardId"
      @add="handleAddList"
      @cancel="showAddListModal = false"
    />
    <ListEditComp
      v-if="showEditListModal && selectedList"
      :list="selectedList"
      @edit="saveEditList"
      @cancel="showEditListModal = false"
    >
    </ListEditComp>
  </div>
</template>
