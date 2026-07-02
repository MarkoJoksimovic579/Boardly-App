<script setup lang="ts">
import { formatDateAndTime } from '@/features/boards/data/boardsTypes'
import type { Task, TaskDeletePayload } from '@/features/tasks/data/tasksTypes'

const props = defineProps<{
  task: Task
  canEdit: boolean
}>()

const emit = defineEmits<{
  (e: 'open', id: number): void
  (e: 'delete-task', payload: TaskDeletePayload): void
  (e: 'edit', task: Task): void
}>()
</script>

<template>
  <div
    @click="emit('open', props.task.id)"
    class="rounded-xl border border-border-divider bg-bg-subtle p-3 cursor-pointer hover:bg-bg-nav-hover transition"
  >
    <!-- LABELS -->
    <div v-if="props.task.labels?.length" class="flex flex-wrap gap-1 mb-2">
      <span
        v-for="label in props.task.labels"
        :key="label.name"
        class="px-2 py-0.5 rounded-md text-[10px] text-white"
        :style="{ backgroundColor: label.color }"
      >
        {{ label.name }}
      </span>
    </div>

    <!-- TITLE -->
    <h3 class="text-sm text-text-nav-active font-medium">
      {{ props.task.title }}
    </h3>

    <!-- FOOTER -->
    <div class="mt-3 flex items-center justify-between">
      <span class="text-[11px] text-text-muted">
        Created at: {{ formatDateAndTime(props.task.created_at) }}
      </span>

      <div class="flex items-center gap-1">
        <!-- Edit & Delete — samo ako canEdit -->
        <template v-if="props.canEdit">
          <button
            class="w-7 h-7 rounded-lg flex items-center justify-center text-text-subtle hover:bg-bg-nav-hover hover:text-text-nav-active transition-all duration-150"
            title="Edit"
            @click.stop="emit('edit', props.task)"
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
            class="w-7 h-7 rounded-lg flex items-center justify-center text-text-danger/60 hover:bg-bg-danger-hover hover:text-text-danger/80 transition-all duration-150"
            title="Delete"
            @click.stop="emit('delete-task', { tsk_id: props.task.id, brd_id: props.task.brd_id })"
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
        </template>

        <!-- Drag handle — uvek vidljiv -->
        <button
          type="button"
          class="task-drag-handle w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-nav-hover hover:text-text-nav-active cursor-grab active:cursor-grabbing transition-all duration-150"
          title="Drag to reorder"
          @click.stop
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
