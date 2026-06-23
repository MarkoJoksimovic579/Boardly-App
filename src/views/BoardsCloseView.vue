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
const boardId = Number(route.params.id)
const boardsStore = useBoardStore()
const confirmStore = useConfirmStore()

const board = computed(() => boardsStore.boardsList.find((b) => b.id === boardId))

async function handleAddList(list: ListPayload) {
  try {
    isListLoading.value = true

    await listStore.postList({
      ...list,
      brd_id: boardId,
    })

    await listStore.fetchLists(boardId)

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
      brd_id: boardId,
    })

    await listStore.fetchLists(boardId)

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

    await listStore.eraseLists(boardId, list_id)
    await listStore.fetchLists(boardId)

    messageStore.success('List deleted successfully')
  } catch (err) {
    console.error(err)

    messageStore.fail('Failed to delete list')
  } finally {
    isListLoading.value = false
  }
}
function fetchLists() {
  listStore.fetchLists(boardId)
}

watch(
  () => route.params.id,
  (newId) => {
    if (!newId) return

    listStore.fetchLists(Number(newId))
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

      <button
        v-if="board?.can_edit"
        @click="showAddListModal = true"
        class="btn-primary flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
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
    <!-- <div class="self-center text-3xl font-semibold text-text-title">Lists</div>??-->
    <!-- LISTS -->
    <div class="flex-1 overflow-x-auto p-8 scrollbar-custom">
      <template v-if="listStore.allLists.length">
        <ListOfLists
          :lists="listStore.allLists"
          :canEdit="board?.can_edit ?? false"
          @open-task="openTask"
          @delete="handleDeleteList"
          @edit="handleEditList"
          @fetch-tasks="fetchLists"
        />
      </template>

      <template v-else>
        <div class="h-full flex flex-col items-center justify-center text-center">
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
      </template>
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
