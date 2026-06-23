<script setup lang="ts">
import draggable from 'vuedraggable'
import { ref, watch } from 'vue'

import ListComp from './ListComp.vue'
import TaskAddComp from '@/features/tasks/components/TaskAddComp.vue'

import type { List, ListPayload, ReorderListItem } from '@/features/lists/data/listsTypes'
import type {
  DragTaskPayload,
  TaskDeletePayload,
  TaskPayload,
} from '@/features/tasks/data/tasksTypes'

import { useTasksStore } from '@/features/tasks/stores/tasksStore.ts'
import { useListsStore } from '../stores/listsStore.ts'
import { useMessageStore } from '@/stores/messageStore'
import { useAsyncAction } from '@/services/functions/useAsyncAction'
import { useConfirmStore } from '@/stores/confirmStore.ts'

const props = defineProps<{
  lists: List[]
  canEdit: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', list: ListPayload): void
  (e: 'delete', id: number): void
  (e: 'open-task', id: number): void
  (e: 'fetchTasks'): void
}>()

const messageStore = useMessageStore()
const listStore = useListsStore()
const taskStore = useTasksStore()
const confirmStore = useConfirmStore()

const { loading: isTaskLoading, run } = useAsyncAction()

const localLists = ref<List[]>([])

const selectedListId = ref<number | null>(null)
const selectedBoardId = ref<number | null>(null)
const showAddTaskModal = ref(false)

function openAddTask(listId: number, brdId: number) {
  selectedListId.value = listId
  selectedBoardId.value = brdId
  showAddTaskModal.value = true
}

async function saveAdd(payload: TaskPayload) {
  if (!selectedListId.value || !selectedBoardId.value) return

  await run(
    async () => {
      await taskStore.postTask({
        ...payload,
        list_id: selectedListId.value!,
        brd_id: selectedBoardId.value!,
      })

      emit('fetchTasks')
      showAddTaskModal.value = false
    },
    {
      success: 'Task created successfully',
      error: 'Failed to create task',
    },
  )
}

async function handleDelete(payload: TaskDeletePayload) {
  const confirmed = await confirmStore.ask({
    title: 'Delete task',
    message: 'Are you sure you want to delete this task?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  })

  if (!confirmed) return

  await run(
    async () => {
      await taskStore.eraseTask(payload)
      emit('fetchTasks')
    },
    {
      success: 'Task deleted successfully',
      error: 'Failed to delete task',
    },
  )
}

async function onListMove() {
  const positions: ReorderListItem[] = localLists.value.map((list, index) => ({
    list_id: list.id,
    position: index,
  }))

  try {
    await listStore.reorderLists({ lists: positions })
  } catch (err) {
    console.log(err)
    messageStore.fail('Failed to reorder lists')
  }
}

async function handleTaskReorder(payload: DragTaskPayload[]) {
  try {
    await taskStore.moveTask(payload)
  } catch (err) {
    console.log(err)
    messageStore.fail('Failed to reorder tasks')
    emit('fetchTasks')
  }
}

watch(
  () => props.lists,
  (lists) => {
    localLists.value = [...lists]
  },
  { immediate: true },
)
</script>

<template>
  <draggable
    v-model="localLists"
    item-key="id"
    class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6"
    ghost-class="opacity-0"
    :animation="200"
    :disabled="!props.canEdit"
    @change="onListMove"
  >
    <template #item="{ element: list }">
      <ListComp
        :list="list"
        :can-edit="props.canEdit"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @open-task="emit('open-task', $event)"
        @add-task="openAddTask(list.id, list.brd_id)"
        @delete-task="handleDelete"
        @reorder-tasks="handleTaskReorder"
      />
    </template>
  </draggable>

  <TaskAddComp
    v-if="showAddTaskModal && selectedBoardId"
    :brd_id="selectedBoardId"
    :loading="isTaskLoading"
    @save="saveAdd"
    @cancel="showAddTaskModal = false"
  />
</template>
