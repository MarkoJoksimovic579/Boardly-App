<script setup lang="ts">
import { useBoardStore } from '@/features/boards/store/boardsStore'
import { useSessionStore } from '@/stores/usersSessionStore'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const boardStore = useBoardStore()
const session = useSessionStore()
const router = useRouter()

const totalBoards = computed(() => boardStore.boardsList.length)
const favoriteBoards = computed(() => boardStore.boardsList.filter((b) => b.is_favorite))
const ownedBoards = computed(() => boardStore.boardsList.filter((b) => b.can_edit))

function openBoard(id: number) {
  router.push(`/app/boards/${id}`)
}

onMounted(() => {
  if (!boardStore.boardsList.length) boardStore.fetchBoards()
})
</script>

<template>
  <div class="p-8 max-w-6xl">
    <!-- HEADER -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-white/80 tracking-tight">Dashboard</h1>
      <p class="text-white/30 text-sm mt-1">
        Welcome back, <span class="text-white/50">{{ session.user.usr_username }}</span>
      </p>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
      <div class="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <div class="flex items-center gap-2 mb-3">
          <div
            class="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-400/15 flex items-center justify-center"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#a5b4fc"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <p class="text-white/30 text-xs">Total boards</p>
        </div>
        <p class="text-white/80 text-2xl font-semibold">{{ totalBoards }}</p>
      </div>

      <div class="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <div class="flex items-center gap-2 mb-3">
          <div
            class="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-400/15 flex items-center justify-center"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="#fbbf24"
              stroke="#fbbf24"
              stroke-width="1.5"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </div>
          <p class="text-white/30 text-xs">Favorites</p>
        </div>
        <p class="text-white/80 text-2xl font-semibold">{{ favoriteBoards.length }}</p>
      </div>

      <div class="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <div class="flex items-center gap-2 mb-3">
          <div
            class="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-400/15 flex items-center justify-center"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6ee7b7"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <p class="text-white/30 text-xs">You own</p>
        </div>
        <p class="text-white/80 text-2xl font-semibold">{{ ownedBoards.length }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- FAVORITES -->
      <div>
        <p class="text-[11px] uppercase tracking-[0.15em] text-white/25 mb-4">Favorites</p>
        <div class="flex flex-col gap-2">
          <div
            v-for="board in favoriteBoards"
            :key="board.id"
            @click="openBoard(board.id)"
            class="cursor-pointer flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 hover:bg-amber-500/[0.04] hover:border-amber-400/[0.12] transition-all"
          >
            <div
              class="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-400/20 flex items-center justify-center text-amber-300 text-xs font-semibold flex-shrink-0"
            >
              {{ board.title.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white/70 text-sm font-medium truncate">{{ board.title }}</p>
              <p class="text-white/25 text-xs">{{ board.members_count }} members</p>
            </div>
            <svg
              class="w-3.5 h-3.5 text-red-400/50 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </div>
          <p v-if="favoriteBoards.length === 0" class="text-white/20 text-sm px-1">
            No favorites yet
          </p>
        </div>
      </div>

      <!-- ALL BOARDS -->
      <div>
        <p class="text-[11px] uppercase tracking-[0.15em] text-white/25 mb-4">All boards</p>
        <div class="flex flex-col gap-2">
          <div
            v-for="board in boardStore.boardsList"
            :key="board.id"
            @click="openBoard(board.id)"
            class="cursor-pointer flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 hover:bg-white/[0.05] hover:border-white/[0.09] transition-all"
          >
            <div
              class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-400/15 flex items-center justify-center text-indigo-300/80 text-xs font-semibold flex-shrink-0"
            >
              {{ board.title.charAt(0).toUpperCase() }}
            </div>
            <span class="text-white/60 text-sm flex-1 truncate">{{ board.title }}</span>
            <span
              class="text-[11px] px-2.5 py-1 rounded-lg font-medium flex-shrink-0"
              :class="
                board.can_edit
                  ? 'bg-indigo-500/10 border border-indigo-400/15 text-indigo-300/80'
                  : 'bg-white/[0.04] border border-white/[0.07] text-white/30'
              "
            >
              {{ board.can_edit ? 'admin' : 'member' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
