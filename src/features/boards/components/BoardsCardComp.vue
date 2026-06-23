<script setup lang="ts">
import dayjs from 'dayjs'
import type { Board, BoardPayload } from '../data/boardsTypes'

const props = defineProps<{
  board: Board
}>()

const emit = defineEmits<{
  (e: 'edit', board: BoardPayload): void
  (e: 'delete', id: number): void
  (e: 'open', id: number): void
  (e: 'toggle-favorite', id: number): void
  (e: 'addMembers', id: number): void
  (e: 'showMembers', board: Board): void
}>()

function onEdit() {
  emit('edit', {
    id: props.board.id,
    title: props.board.title,
    description: props.board.description,
  })
}

function formatDate(date: string) {
  return dayjs(date).format('DD MMM YYYY')
}
</script>

<template>
  <div
    @click="emit('open', props.board.id)"
    class="cursor-pointer rounded-2xl border border-border-default bg-bg-card p-5 hover:bg-bg-card-hover hover:border-border-hover transition-all duration-200"
    style="
      box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.3),
        0 1px 0 rgba(255, 255, 255, 0.04) inset;
    "
  >
    <!-- TOP -->
    <div class="flex items-center justify-between mb-4">
      <div
        class="w-10 h-10 rounded-xl bg-bg-accent border border-border-accent flex items-center justify-center text-text-accent text-sm font-semibold tracking-wide"
      >
        {{ board.title.charAt(0).toUpperCase() }}
      </div>

      <span
        class="text-[10px] font-medium text-text-muted bg-bg-subtle px-2.5 py-1 rounded-md tracking-[0.02em]"
      >
        Created At: {{ formatDate(board.created_at) }}
      </span>

      <button
        @click.stop="emit('toggle-favorite', props.board.id)"
        class="text-text-body hover:text-text-danger transition-colors duration-150"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            :fill="board.is_favorite ? '#f87171' : 'none'"
            :stroke="board.is_favorite ? '#f87171' : 'currentColor'"
          />
        </svg>
      </button>
    </div>

    <!-- TITLE -->
    <h2 class="text-text-title font-semibold text-[13px] mb-1.5 tracking-[0.01em]">
      {{ board.title }}
    </h2>

    <!-- DESCRIPTION -->
    <p class="text-text-body text-[12px] leading-relaxed line-clamp-2">
      {{ board.description }}
    </p>

    <!-- FOOTER -->
    <div class="mt-4 pt-4 border-t border-border-divider flex items-center justify-between">
      <!-- MEMBERS -->
      <div class="flex items-center gap-1.5">
        <div class="flex -space-x-1.5"></div>
        <button
          @click.stop="emit('showMembers', props.board)"
          class="cursor-pointer ml-1 w-6 h-6 rounded-full bg-bg-subtle border border-border-default disabled:hover:bg-bg-subtle disabled:hover:text-text-body flex items-center justify-center text-text-body hover:text-text-title hover:bg-bg-subtle/50 transition"
          title="Show members"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </button>
        <span class="text-[11px] text-text-muted ml-1">{{ board.members_count - 1 }} members</span>
      </div>

      <!-- CREATOR -->
      <span
        class="text-[10px] font-medium px-2 py-1 rounded-md bg-bg-accent border border-border-accent text-text-accent tracking-[0.01em]"
      >
        Owner: {{ board.creator }}
      </span>
    </div>

    <!-- ACTIONS -->
    <div v-if="board.can_edit" class="mt-3 flex gap-2">
      <button
        @click.stop="onEdit"
        class="flex items-center gap-1.5 text-[11px] font-medium text-text-subtle hover:text-text-title px-2.5 py-1.5 rounded-lg hover:bg-bg-subtle transition-all duration-150"
      >
        <svg
          width="12"
          height="12"
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
        Edit
      </button>

      <button
        class="w-7 h-7 rounded-lg flex items-center justify-center text-text-danger/60 hover:bg-bg-danger-hover hover:text-text-danger/80 transition-all duration-150"
        title="Delete"
        @click.stop="emit('delete', board.id)"
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

      <div class="flex-1" />

      <button
        @click.stop="emit('addMembers', props.board.id)"
        class="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-bg-accent border border-border-accent text-text-accent hover:bg-bg-accent-hover hover:border-border-accent hover:text-text-accent transition-all duration-150 whitespace-nowrap"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
        Add members
      </button>
    </div>
  </div>
</template>
