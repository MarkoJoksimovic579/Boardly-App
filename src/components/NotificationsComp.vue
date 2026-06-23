<script setup lang="ts">
import type { Notification } from '@/features/notifications/data/notificationTypes'

defineProps<{
  notifications: Notification[]
}>()

const emit = defineEmits<{
  (e: 'mark-read', id: number): void
  (e: 'mark-all-read'): void
  (e: 'clear-all'): void
}>()
</script>

<template>
  <div
    class="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto scrollbar-custom rounded-2xl border border-border-default bg-bg-modal shadow-2xl z-50"
  >
    <div class="px-4 py-3 border-b border-border-divider flex items-center justify-between">
      <p class="text-text-title text-sm font-semibold">Notifications</p>

      <!-- OVO JE CLEAR ALL -->
      <button
        v-if="notifications.length"
        @click.stop="emit('clear-all')"
        class="text-[11px] text-text-danger hover:opacity-80 transition"
      >
        Clear all
      </button>
    </div>

    <div v-if="notifications.length" class="p-2 space-y-1">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        @click="emit('mark-read', notification.id)"
        class="p-3 rounded-xl hover:bg-bg-card-hover transition cursor-pointer"
      >
        <div class="flex gap-2">
          <span
            class="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
            :class="notification.is_read === 0 ? 'bg-bg-btn-primary' : 'bg-border-default'"
          />

          <div class="min-w-0">
            <p class="text-text-body text-sm leading-snug">
              {{ notification.message }}
            </p>

            <p class="text-text-muted text-xs mt-1">
              {{ notification.created_at }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-5 text-center text-text-muted text-sm">No notifications</div>
  </div>
</template>
