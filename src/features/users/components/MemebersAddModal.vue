<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUsersStore } from '../stores/usersStore'
import BaseButton from '@/components/ui/BaseButton.vue'

import type { BoardMember } from '@/features/boards/data/boardsTypes'

const userStore = useUsersStore()

const props = defineProps<{
  loading?: boolean
  members: BoardMember[]
}>()

const selectedUserIds = ref<number[]>([])

function toggleUser(id: number) {
  if (selectedUserIds.value.includes(id)) {
    selectedUserIds.value = selectedUserIds.value.filter((i) => i !== id)
  } else {
    selectedUserIds.value.push(id)
  }
}

const availableUsers = computed(() => {
  const memberIds = new Set(props.members.map((m) => m.id))

  return userStore.usersList.filter((user) => !memberIds.has(user.usr_id))
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'add', ids: number[]): void
}>()
onMounted(() => userStore.fetchUsers())
</script>
<template>
  <div class="modal-overlay">
    <div class="modal-container !max-w-3xl !w-full !max-h-[85vh] overflow-hidden">
      <!-- HEADER -->
      <div class="flex items-center justify-between pb-4 border-b border-border-divider">
        <div>
          <h2 class="modal-title mb-0">Add Board Members</h2>

          <p class="text-sm text-text-body mt-1">Select users you want to add to this board</p>
        </div>

        <button @click="emit('cancel')" class="text-text-muted hover:text-text-title transition">
          ✕
        </button>
      </div>

      <!-- LIST -->
      <div class="overflow-y-auto max-h-[65vh] p-4 space-y-2">
        <div
          v-for="user in availableUsers"
          :key="user.usr_id"
          @click="toggleUser(user.usr_id)"
          class="flex items-center justify-between p-3 rounded-xl border border-border-default bg-bg-user-panel hover:bg-bg-card-hover cursor-pointer transition"
        >
          <div class="flex flex-col">
            <span class="text-text-title font-medium">
              {{ user.usr_fullname }}
            </span>

            <span class="text-text-muted text-sm">
              {{ user.usr_username }} • {{ user.usr_email }}
            </span>
          </div>

          <!-- checkbox -->
          <div
            class="w-5 h-5 rounded border flex items-center justify-center transition-all"
            :class="
              selectedUserIds.includes(user.usr_id)
                ? 'bg-bg-btn-primary border-bg-btn-primary text-white'
                : 'border-border-default'
            "
          >
            <span v-if="selectedUserIds.includes(user.usr_id)" class="text-xs"> ✓ </span>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="p-4 border-t border-border-divider flex justify-end gap-2">
        <button @click="emit('cancel')" class="modal-cancel">Cancel</button>

        <BaseButton
          variant="primary"
          :loading="props.loading"
          @click="emit('add', selectedUserIds)"
        >
          Add selected ({{ selectedUserIds.length }})
        </BaseButton>
      </div>
    </div>
  </div>
</template>
