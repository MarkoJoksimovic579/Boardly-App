<script setup lang="ts">
import api from '@/api'
import type { BoardMember } from '@/features/boards/data/boardsTypes'
import { ensureSuccess } from '@/services/functions/ensureSuccess'
import { useAsyncAction } from '@/services/functions/useAsyncAction'
import { useConfirmStore } from '@/stores/confirmStore'

import { useSessionStore } from '@/stores/usersSessionStore'
import { ref } from 'vue'

const { loading: isMemberLoading, run } = useAsyncAction()

const props = defineProps<{
  members: BoardMember[]
  canEdit?: boolean
}>()
const localBoardMembers = ref<BoardMember[]>(props.members)

const sessions = useSessionStore()
const confirmStore = useConfirmStore()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

async function changeRole(member: BoardMember, role: 'admin' | 'member') {
  if (!sessions.sid) return

  await run(
    async () => {
      const res = await api.putMembersRoles(member.brd_id, member.id, role)
      ensureSuccess(res)

      member.role = role
    },
    {
      success: 'Role updated',
      error: 'Failed to update role',
    },
  )
}

async function deleteMember(member_id: number, brd_id: number) {
  if (!sessions.sid) return

  const confirmed = await confirmStore.ask({
    title: 'Delete member',
    message: 'Are you sure you want to delete this member?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  })

  if (!confirmed) return

  await run(
    async () => {
      const res = await api.deleteMembers(brd_id, member_id, sessions.sid!)

      ensureSuccess(res)

      localBoardMembers.value = localBoardMembers.value.filter((m) => m.id !== member_id)

      emit('deleted')
    },
    {
      success: 'Member removed successfully',
      error: 'Failed to remove member',
    },
  )
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
    <div
      class="w-full max-w-md max-h-[85vh] overflow-hidden rounded-2xl border border-border-modal bg-bg-modal shadow-2xl"
    >
      <div
        v-if="localBoardMembers.length === 0"
        class="flex flex-col items-center justify-center py-12"
      >
        <div class="text-4xl mb-2">👥</div>

        <p class="text-text-muted text-sm mb-4">No members found</p>

        <button
          @click="emit('cancel')"
          class="px-4 py-2 rounded-xl border border-border-default text-text-body hover:bg-bg-subtle transition"
        >
          Close
        </button>
      </div>
      <!-- HEADER -->
      <div
        v-else
        class="flex items-center justify-between px-6 py-4 border-b border-border-divider"
      >
        <div>
          <h2 class="text-xl font-semibold text-text-title">Board Members</h2>

          <p class="text-sm text-text-muted mt-1">{{ localBoardMembers.length }} members</p>
        </div>

        <button @click="emit('cancel')" class="text-text-muted hover:text-text-title transition">
          ✕
        </button>
      </div>

      <!-- LIST -->
      <div class="overflow-y-auto max-h-[65vh] p-4 space-y-2">
        <div
          v-for="member in localBoardMembers"
          :key="member.id"
          class="member-card flex relative items-center gap-3 p-3"
        >
          <!-- Avatar -->
          <div
            class="w-9 h-9 rounded-full bg-bg-accent border border-border-accent flex items-center justify-center text-text-accent text-sm font-semibold flex-shrink-0"
          >
            {{ member.username.charAt(0).toUpperCase() }}
          </div>

          <!-- User info -->
          <div class="min-w-0">
            <p class="text-text-title text-sm font-medium truncate">
              {{ member.fullname }}
            </p>

            <p class="text-text-muted text-xs truncate">
              {{ member.username }}
            </p>
          </div>

          <!-- Actions -->
          <div v-if="props.canEdit" class="ml-auto flex items-center gap-2">
            <select
              :value="member.role"
              :disabled="isMemberLoading"
              class="px-2 py-1 rounded-lg border border-border-divider bg-bg-card text-text-title text-xs outline-none hover:border-border-accent transition disabled:opacity-40"
              @change="
                changeRole(member, ($event.target as HTMLSelectElement).value as 'admin' | 'member')
              "
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>

            <!-- Delete -->
            <button
              class="w-7 h-7 rounded-lg flex items-center justify-center text-text-danger opacity-60 hover:opacity-100 hover:bg-bg-danger-hover transition-all duration-150 disabled:opacity-30"
              :disabled="isMemberLoading"
              @click.stop="deleteMember(member.id, member.brd_id)"
            >
              <span v-if="isMemberLoading" class="spinner spinner-sm"></span>

              <svg
                v-else
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
      </div>
    </div>
  </div>
</template>
