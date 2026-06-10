<script setup lang="ts">
import api from '@/api'
import type { BoardMember } from '@/features/boards/data/boardsTypes'

import { useSessionStore } from '@/stores/usersSessionStore'
import { ref } from 'vue'

const props = defineProps<{
  members: BoardMember[]
}>()
const localBoardMembers = ref<BoardMember[]>(props.members)

const sessions = useSessionStore()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()
async function deleteMember(member_id: number, brd_id: number) {
  try {
    if (!sessions.sid) return

    const res = await api.deleteMembers(brd_id, member_id, sessions.sid)
    if (res) {
      localBoardMembers.value = localBoardMembers.value.filter((m) => m.id !== member_id)

      emit('deleted')
    }
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
    <div
      class="w-full max-w-md max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl"
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <h2 class="text-xl font-semibold text-white">Board Members</h2>
          <p class="text-sm text-white/40 mt-1">{{ members.length }} members</p>
        </div>
        <button
          @click="emit('cancel')"
          class="text-white/40 hover:text-white transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- LIST -->
      <div class="overflow-y-auto max-h-[65vh] p-4 space-y-2">
        <div
          v-for="member in localBoardMembers"
          :key="member.id"
          class="flex relative items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.03]"
        >
          <div
            class="w-9 h-9 rounded-full bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center text-indigo-300 text-sm font-semibold flex-shrink-0"
          >
            {{ member.username.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-white/80 text-sm font-medium">{{ member.fullname }}</p>
            <p class="text-white/30 text-xs">{{ member.username }}</p>
          </div>
          <button
            class="w-7 h-7 rounded-lg flex items-center justify-center text-red-400/60 hover:bg-red-500/10 hover:text-red-400/80 transition-all duration-150"
            @click.stop="deleteMember(member.id, member.brd_id)"
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
    </div>
  </div>
</template>
