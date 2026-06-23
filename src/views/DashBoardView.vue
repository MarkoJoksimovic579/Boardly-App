<script setup lang="ts">
import { useBoardStore } from '@/features/boards/stores/boardsStore'
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
  <div class="p-4 sm:p-8 max-w-6xl">
    <!-- HEADER -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-semibold text-text-title tracking-tight">Dashboard</h1>
      <p class="text-text-body text-sm mt-1">
        Welcome back, <span class="text-text-subtle">{{ session.user.usr_username }}</span>
      </p>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-3 gap-2 sm:gap-3 mb-8 sm:mb-10">
      <div class="bg-bg-subtle border border-border-default rounded-xl p-3 sm:p-4">
        <div class="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <div
            class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-bg-accent border border-border-accent flex items-center justify-center shrink-0"
          >
            <svg
              width="12"
              height="12"
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
          <p class="text-text-muted text-[10px] sm:text-xs leading-tight">Total boards</p>
        </div>
        <p class="text-text-title text-xl sm:text-2xl font-semibold">{{ totalBoards }}</p>
      </div>

      <div class="bg-bg-subtle border border-border-default rounded-xl p-3 sm:p-4">
        <div class="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <div
            class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-bg-avatar-favorite border border-border-avatar-favorite flex items-center justify-center shrink-0"
          >
            <svg
              width="12"
              height="12"
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
          <p class="text-text-muted text-[10px] sm:text-xs leading-tight">Favorites</p>
        </div>
        <p class="text-text-title text-xl sm:text-2xl font-semibold">{{ favoriteBoards.length }}</p>
      </div>

      <div class="bg-bg-subtle border border-border-default rounded-xl p-3 sm:p-4">
        <div class="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <div
            class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-bg-accent border border-border-accent flex items-center justify-center shrink-0"
          >
            <svg
              width="12"
              height="12"
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
          <p class="text-text-muted text-[10px] sm:text-xs leading-tight">You own</p>
        </div>
        <p class="text-text-title text-xl sm:text-2xl font-semibold">{{ ownedBoards.length }}</p>
      </div>
    </div>

    <!-- BOARDS GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
      <!-- FAVORITES -->
      <div>
        <p class="text-[11px] uppercase tracking-[0.15em] text-text-muted mb-3 sm:mb-4">
          Favorites
        </p>
        <div class="flex flex-col gap-2">
          <div
            v-for="board in favoriteBoards"
            :key="board.id"
            @click="openBoard(board.id)"
            class="cursor-pointer flex items-center gap-3 bg-bg-subtle border border-border-default rounded-xl px-3 sm:px-4 py-3 hover:bg-bg-avatar-favorite hover:border-border-avatar-favorite transition-all"
          >
            <div
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-bg-avatar-favorite border border-border-avatar-favorite flex items-center justify-center text-text-avatar-favorite text-xs font-semibold shrink-0"
            >
              {{ board.title.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-text-title text-sm font-medium truncate">{{ board.title }}</p>
              <p class="text-text-muted text-xs">{{ board.members_count }} members</p>
            </div>
            <svg
              class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-text-favorite-icon shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </div>
          <p v-if="favoriteBoards.length === 0" class="text-text-muted text-sm px-1">
            No favorites yet
          </p>
        </div>
      </div>

      <!-- ALL BOARDS -->
      <div>
        <p class="text-[11px] uppercase tracking-[0.15em] text-text-muted mb-3 sm:mb-4">
          All boards
        </p>
        <div class="flex flex-col gap-2">
          <div
            v-for="board in boardStore.boardsList"
            :key="board.id"
            @click="openBoard(board.id)"
            class="cursor-pointer flex items-center gap-3 bg-bg-subtle border border-border-default rounded-xl px-3 sm:px-4 py-3 hover:bg-bg-card-hover hover:border-border-hover transition-all"
          >
            <div
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-bg-accent border border-border-accent flex items-center justify-center text-text-accent text-xs font-semibold shrink-0"
            >
              {{ board.title.charAt(0).toUpperCase() }}
            </div>
            <span class="text-text-title text-sm flex-1 truncate">{{ board.title }}</span>
            <span
              class="text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-medium shrink-0"
              :class="
                board.can_edit
                  ? 'bg-bg-accent border border-border-accent text-text-accent'
                  : 'bg-bg-subtle border border-border-default text-text-muted'
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
