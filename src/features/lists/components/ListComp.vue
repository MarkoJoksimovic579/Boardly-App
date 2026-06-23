<script setup lang="ts">
import type { List, ListPayload } from '@/features/lists/data/listsTypes'
import TaskCardComp from '@/features/tasks/components/TaskCardComp.vue'
import TaskEditComp from '@/features/tasks/components/TaskEditComp.vue'
import {
  type Task,
  type TaskDeletePayload,
  type TaskEditPayload,
} from '@/features/tasks/data/tasksTypes'
import { useTasksStore } from '@/features/tasks/stores/tasksStore'
import { ref, watch } from 'vue'
import { useListsStore } from '../stores/listsStore'
import draggable from 'vuedraggable'
import type { DragTaskPayload } from '@/features/tasks/data/tasksTypes'
import { useDragState } from '@/services/functions/useDragState'

import { useAsyncAction } from '@/services/functions/useAsyncAction'

const { loading: isTaskLoading, run } = useAsyncAction()
const props = defineProps<{
  list: List
  canEdit: boolean
}>()

const titleSearch = ref('')
const taskStore = useTasksStore()
const listStore = useListsStore()

const localTasks = ref<Task[]>([])

const isVisible = (task: Task) => {
  return task.title.toLowerCase().includes(titleSearch.value.toLowerCase())
}

const showEditTaskModal = ref(false)
const selectedTask = ref<Task>()

const { isDraggingTask } = useDragState()

function handleEdit(task: Task) {
  showEditTaskModal.value = true
  selectedTask.value = task
}

const emit = defineEmits<{
  (e: 'edit', list: ListPayload): void
  (e: 'delete', id: number): void
  (e: 'open-task', id: number): void
  (e: 'add-task', listId: number): void
  (e: 'delete-task', payload: TaskDeletePayload): void
  (e: 'reorder-tasks', payload: DragTaskPayload[]): void
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onTaskChange(event: any) {
  // Ako je task OTIŠAO iz ove liste (removed), ne emitujemo reorder
  // Reorder se samo šalje kada task DOĐE ili se SORTIRA unutar iste liste
  if (event.removed) return

  const payload: DragTaskPayload[] = localTasks.value.map((task, index) => ({
    tsk_id: task.id,
    tsk_position: index,
    list_id: props.list.id,
    brd_id: task.brd_id,
  }))

  emit('reorder-tasks', payload)
}

function onEdit() {
  emit('edit', {
    id: props.list.id,
    title: props.list.title,
  })
}

function onDelete(payload: TaskDeletePayload) {
  emit('delete-task', payload)
}

async function saveEdit(task: TaskEditPayload) {
  await run(
    async () => {
      await taskStore.putTask(task)
      await listStore.fetchLists(task.brd_id!)

      showEditTaskModal.value = false
      selectedTask.value = undefined
    },
    {
      success: 'Task updated successfully',
      error: 'Failed to update task',
    },
  )
}
watch(
  () => props.list.tasks,
  (tasks) => {
    localTasks.value = [...tasks]
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="w-full shrink-0 rounded-2xl border border-border-default bg-bg-card flex flex-col max-h-[80vh]"
    style="
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 1px 0 rgba(255, 255, 255, 0.04) inset;
    "
  >
    <!-- HEADER -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-border-divider">
      <div class="flex items-center gap-2">
        <h2
          :title="props.list.title"
          class="max-w-[100px] truncate text-[13px] font-semibold text-text-title tracking-[0.01em] cursor-help"
        >
          {{ props.list.title }}
        </h2>
        <span
          class="text-[10px] font-medium px-[7px] py-[2px] rounded-full bg-bg-subtle text-text-muted tracking-[0.02em]"
        >
          {{ localTasks.length }}
        </span>
      </div>

      <div class="hidden md:flex flex-1 p-1 justify-center">
        <div class="relative">
          <input
            v-model="titleSearch"
            placeholder="Search tasks..."
            class="w-full h-7 pl-7 pr-4 rounded-xl bg-bg-input border border-border-default text-text-body text-sm outline-none focus:border-border-accent"
          />

          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      <!-- Action buttons -->
      <div v-if="props.canEdit" class="flex gap-1">
        <button
          class="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-subtle hover:text-text-title transition-all duration-150"
          title="Edit"
          @click="onEdit"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          class="w-7 h-7 rounded-lg flex items-center justify-center text-text-danger hover:bg-bg-danger-hover transition-all duration-150"
          title="Delete"
          @click="emit('delete', props.list.id)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- TASKS -->
    <div
      class="flex-1 max-h-82 overflow-y-auto p-2.5 flex flex-col gap-1.5 items-stretch scrollbar-custom"
    >
      <draggable
        v-model="localTasks"
        item-key="id"
        group="tasks"
        class="flex flex-col gap-1.5"
        ghost-class="opacity-0"
        :animation="200"
        @change="onTaskChange"
        @start="isDraggingTask = true"
        @end="isDraggingTask = false"
      >
        <template #item="{ element: task }">
          <div v-show="isVisible(task)">
            <TaskCardComp
              :task="task"
              :canEdit="props.canEdit"
              @open="emit('open-task', task.id)"
              @delete-task="onDelete"
              @edit="handleEdit"
            />
          </div>
        </template>
        <!-- Ovo se prikazuje samo kad je lista prazna -->
        <template #footer>
          <div
            v-if="localTasks.length === 0 && isDraggingTask"
            class="flex items-center justify-center h-[60px] rounded-[10px] border border-dashed border-border-accent text-text-muted text-xs tracking-[0.01em]"
            style="background: var(--color-bg-accent)"
          >
            Drop here
          </div>
        </template>
      </draggable>
      <div
        v-if="props.list.tasks.length === 0"
        class="text-xs text-text-muted text-center py-7 tracking-[0.01em]"
      >
        No tasks yet
      </div>
    </div>

    <!-- FOOTER -->
    <div v-if="canEdit" class="p-2.5 border-t border-border-divider">
      <button
        @click="emit('add-task', props.list.id)"
        class="w-full rounded-[10px] border border-dashed border-border-default py-2 text-[12px] font-medium text-text-muted hover:bg-bg-subtle hover:border-border-hover hover:text-text-body transition-all duration-150 flex items-center justify-center gap-1.5 tracking-[0.01em]"
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
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add task
      </button>
    </div>

    <TaskEditComp
      v-if="showEditTaskModal && selectedTask"
      :task="selectedTask"
      :loading="isTaskLoading"
      @cancel="showEditTaskModal = false"
      @save="saveEdit"
    />
  </div>
</template>
