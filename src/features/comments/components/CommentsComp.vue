<script setup lang="ts">
import dayjs from 'dayjs'
import type { Comment } from '../data/commentTypes'

const props = defineProps<{
  comment: Comment
}>()
dayjs.locale('sr')
const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()

const initials = (username: string) => username.slice(0, 2).toUpperCase()

const formattedDate = (dateStr: string) => dayjs(dateStr).format('D. MMM YYYY. HH:mm')
</script>

<template>
  <div class="flex gap-3 py-3.5 border-b border-border-divider last:border-none">
    <!-- Avatar -->
    <div
      class="w-8 h-8 min-w-[32px] rounded-full bg-bg-accent text-text-accent flex items-center justify-center text-xs font-medium"
    >
      {{ initials(props.comment.username) }}
    </div>

    <!-- Sadržaj -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-text-title">
          {{ props.comment.username }}
        </span>

        <span class="text-xs text-text-muted">
          {{ formattedDate(props.comment.created_at) }}
        </span>

        <button
          class="ml-auto text-text-danger opacity-60 hover:opacity-100 transition-all p-0.5 rounded"
          title="Delete Comment"
          @click="emit('delete', props.comment.id)"
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

      <p class="text-sm text-text-muted leading-relaxed mt-1">
        {{ props.comment.text }}
      </p>
    </div>
  </div>
</template>
