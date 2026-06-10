<script setup lang="ts">
import type { Label } from '@/features/tasks/data/tasksTypes'

const props = defineProps<{
  label: Label
}>()

const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'edit', label: Label): void
}>()
</script>

<template>
  <div
    class="rounded-xl border border-border-divider bg-bg-subtle hover:bg-bg-nav-hover transition p-4"
  >
    <!-- COLOR BAR -->
    <div class="h-1.5 w-full rounded-full mb-3" :style="{ backgroundColor: label.color }" />

    <div class="flex items-center justify-between gap-3">
      <!-- LEFT -->
      <div class="flex items-center gap-3 min-w-0">
        <!-- ICON -->
        <div
          class="w-8 h-8 rounded-lg border border-border-divider flex items-center justify-center"
          :style="{
            backgroundColor: label.color + '20',
            borderColor: label.color + '40',
          }"
        >
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: label.color }" />
        </div>

        <!-- NAME -->
        <h3 class="text-text-nav-active text-sm font-medium truncate">
          {{ props.label.name }}
        </h3>
      </div>

      <!-- ACTIONS (ALWAYS VISIBLE) -->
      <div class="flex items-center gap-1 shrink-0">
        <!-- EDIT -->
        <button
          @click.stop="emit('edit', label)"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-text-subtle hover:bg-bg-nav-hover hover:text-text-nav-active transition"
          title="Edit"
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

        <!-- DELETE -->
        <button
          @click.stop="emit('delete', label.id)"
          class="w-7 h-7 rounded-lg flex items-center justify-center text-text-danger/60 hover:bg-bg-danger-hover hover:text-text-danger transition"
          title="Delete"
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

    <!-- FOOTER -->
    <div class="flex items-center justify-between mt-3">
      <p class="text-text-muted text-xs font-mono">#{{ String(label.id).padStart(4, '0') }}</p>

      <div
        class="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider"
        :style="{
          color: label.color,
          backgroundColor: label.color + '18',
        }"
      >
        {{ props.label.color }}
      </div>
    </div>
  </div>
</template>
