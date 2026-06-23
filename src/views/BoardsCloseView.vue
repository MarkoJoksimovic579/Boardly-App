<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ListPayload } from '/home/marko/Documents/Projects/praksa/Trello/src/features/lists/data/listsTypes.ts'

import { useBoardStore } from '@/features/boards/stores/boardsStore'
import ListOfLists from '@/features/lists/components/ListOfLists.vue'
import { useListsStore } from '@/features/lists/stores/listsStore'
import ListAddComp from '@/features/lists/components/ListAddComp.vue'
import ListEditComp from '@/features/lists/components/ListEditComp.vue'
import { useMessageStore } from '@/stores/messageStore'
import { useConfirmStore } from '@/stores/confirmStore'

const listStore = useListsStore()
const route = useRoute()
const router = useRouter()
const isListLoading = ref(false)
function openTask(id: number) {
  router.push(`/app/tasks/${id}`)
}
const messageStore = useMessageStore()
const showAddListModal = ref(false)

const showEditListModal = ref(false)
const boardId = computed(() => Number(route.params.id))
const boardsStore = useBoardStore()
const confirmStore = useConfirmStore()

const board = computed(() => boardsStore.boardsList.find((b) => b.id === boardId.value))

async function handleAddList(list: ListPayload) {
  try {
    isListLoading.value = true

    await listStore.postList({
      ...list,
      brd_id: boardId.value,
    })

    await listStore.fetchLists(boardId.value)

    messageStore.success('List created successfully')
    showAddListModal.value = false
  } catch (err) {
    console.error(err)

    messageStore.fail('Failed to create list')
  } finally {
    isListLoading.value = false
  }
}

const selectedList = ref<ListPayload>()

function handleEditList(list: ListPayload) {
  showEditListModal.value = true
  selectedList.value = list
}

async function saveEditList(updatedList: ListPayload) {
  try {
    isListLoading.value = true

    await listStore.putList({
      ...updatedList,
      brd_id: boardId.value,
    })

    await listStore.fetchLists(boardId.value)

    messageStore.success('List updated successfully')

    showEditListModal.value = false
  } catch (err) {
    console.log(err)

    messageStore.fail('Failed to update list')
  } finally {
    isListLoading.value = false
  }
}

async function handleDeleteList(list_id: number) {
  const confirmed = await confirmStore.ask({
    title: 'Delete list',
    message: 'Are you sure you want to delete this list?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  })

  if (!confirmed) return

  try {
    isListLoading.value = true

    await listStore.eraseLists(boardId.value, list_id)
    await listStore.fetchLists(boardId.value)

    messageStore.success('List deleted successfully')
  } catch (err) {
    console.error(err)

    messageStore.fail('Failed to delete list')
  } finally {
    isListLoading.value = false
  }
}
function fetchLists() {
  listStore.fetchLists(boardId.value)
}

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) return

    listStore.allLists = []
    await listStore.fetchLists(Number(newId))
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-full flex flex-col gap-5">
    <!-- HEADER -->
    <div
      class="px-8 py-6 border-b border-border-divider bg-bg-page backdrop-blur flex items-center justify-between"
    >
      <div>
        <h1 class="text-xl font-semibold text-text-title tracking-tight">
          {{ board?.title }}
        </h1>

        <p class="text-text-body text-sm mt-0.5">
          {{ board?.description }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          v-if="board?.can_edit"
          @click="router.push(`/app/labels/${boardId}`)"
          class="group h-9 px-3 rounded-xl border border-border-divider bg-bg-card text-text-body text-sm font-medium flex items-center gap-1.5 transition-all duration-200 hover:border-border-hover hover:bg-bg-subtle hover:text-text-title active:scale-95"
        >
          <span class="text-base text-text-accent transition-transform"> 🏷️ </span>

          Labels
        </button>
        <button
          v-if="board?.can_edit"
          @click="showAddListModal = true"
          class="btn-primary flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-medium text-white transition-all hover:brightness-110 active:scale-95"
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
    </div>

    <!-- LISTS -->
    <div class="flex-1 overflow-x-auto p-8 scrollbar-custom">
      <div v-if="listStore.loading" class="h-full flex items-center justify-center text-text-muted">
        Loading lists...
      </div>

      <ListOfLists
        v-else-if="listStore.allLists.length"
        :lists="listStore.allLists"
        :canEdit="board?.can_edit ?? false"
        @open-task="openTask"
        @delete="handleDeleteList"
        @edit="handleEditList"
        @fetch-tasks="fetchLists"
      />

      <div v-else class="h-full flex flex-col items-center justify-center text-center">
        <div class="text-8xl mb-6">📋</div>

        <h2 class="text-3xl font-semibold text-text-title">This board is empty</h2>

        <p class="mt-3 text-text-muted max-w-md">
          Create your first list and start organizing your tasks.
        </p>

        <button
          v-if="board?.can_edit"
          @click="showAddListModal = true"
          class="btn-primary mt-6 px-5 py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
        >
          Create first list
        </button>
      </div>
    </div>

    <ListAddComp
      v-if="showAddListModal"
      :loading="isListLoading"
      @add="handleAddList"
      @cancel="showAddListModal = false"
    />

    <ListEditComp
      v-if="showEditListModal && selectedList"
      :list="selectedList"
      @edit="saveEditList"
      @cancel="showEditListModal = false"
    />
  </div>
</template>
