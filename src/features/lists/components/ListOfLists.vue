<script setup lang="ts">
import draggable from 'vuedraggable'
import { ref, watch } from 'vue'
import ListComp from './ListComp.vue'
import type { List, ListPayload, ReorderListItem } from '@/features/lists/data/listsTypes'
import { useTasksStore } from '@/features/tasks/store/tasksStore'
import TaskAddComp from '@/features/tasks/components/TaskAddComp.vue'
import type {
  DragTaskPayload,
  TaskDeletePayload,
  TaskPayload,
} from '@/features/tasks/data/tasksTypes'
import { useListsStore } from '../store/listsStore'

const props = defineProps<{
  lists: List[]
  canEdit: boolean
}>()

const listStore = useListsStore()
const taskStore = useTasksStore()

const localLists = ref<List[]>([])

const selectedListId = ref<number | null>(null)
const selectedBoardId = ref<number | null>(null)
const showAddTaskModal = ref(false)

const emit = defineEmits<{
  (e: 'edit', list: ListPayload): void
  (e: 'delete', id: number): void
  (e: 'open-task', id: number): void
  (e: 'add-task', listId: number): void
  (e: 'open-modal'): void
  (e: 'fetchTasks'): void
}>()

function openAddTask(listId: number, brdId: number) {
  selectedListId.value = listId
  selectedBoardId.value = brdId
  showAddTaskModal.value = true
}

async function saveAdd(payload: TaskPayload) {
  await taskStore.postTask({
    ...payload,
    list_id: selectedListId.value!,
    brd_id: selectedBoardId.value!,
  })

  emit('fetchTasks')
  showAddTaskModal.value = false
}

async function handleDelete(payload: TaskDeletePayload) {
  await taskStore.eraseTask(payload)
  emit('fetchTasks')
}

async function onListMove() {
  const positions: ReorderListItem[] = localLists.value.map((list, index) => ({
    list_id: list.id,
    position: index,
  }))
  const payload = { lists: positions }

  await listStore.reorderLists(payload)
}
async function handleTaskReorder(payload: DragTaskPayload[]) {
  try {
    await taskStore.moveTask(payload)
    emit('fetchTasks')
  } catch (err) {
    console.log(err)
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

  <TaskAddComp v-if="showAddTaskModal" @save="saveAdd" @cancel="showAddTaskModal = false" />
</template>
