<script setup lang="ts">
import { useSessionStore } from '@/stores/usersSessionStore'
import { useBoardStore } from '@/features/boards/store/boardsStore'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardUiStore } from '@/features/boards/store/boardUiStore'

const router = useRouter()
const session = useSessionStore()
const boardStore = useBoardStore()

const userIsAdmin = session.isAdmin
const showAdmin = ref(false)
const username = session.user.usr_username
const isOpen = ref(false)

const userInitial = computed(() => {
  return session.user?.usr_username?.charAt(0)?.toUpperCase() || '?'
})

const favoriteBoards = computed(() => boardStore.boardsList.filter((b) => b.is_favorite))
const ui = useBoardUiStore()

function openCreateBoard() {
  router.push('/app/boards')
  ui.openAddBoard()
  isOpen.value = false
}

const showSettings = ref(false)

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

function navigate(fn: () => void) {
  fn()
  isOpen.value = false
}

function goToBoards() {
  router.push('/app/boards')
}
function goToFavorites() {
  router.push('/app/favorites')
}
function goToDashBoard() {
  router.push('/app/dashboard')
}
function goToBoard(id: number) {
  router.push(`/app/boards/${id}`)
}
function goToLabels() {
  router.push('/app/admin/labels')
}
function goToUsers() {
  router.push('/app/admin/users')
}

onMounted(() => {
  if (!boardStore.boardsList.length) {
    boardStore.fetchBoards()
  }
})
</script>

<template>
  <!-- HAMBURGER dugme — samo na mobilnom -->
  <button
    @click="isOpen = !isOpen"
    class="md:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl bg-bg-card border border-border-default flex items-center justify-center text-text-subtle hover:text-text-nav-active transition"
  >
    <svg
      v-if="!isOpen"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
    <svg
      v-else
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>

  <!-- OVERLAY — samo na mobilnom kad je open -->
  <div v-if="isOpen" @click="isOpen = false" class="md:hidden fixed inset-0 bg-black/50 z-30" />

  <!-- SIDEBAR -->
  <aside
    class="fixed md:relative z-40 w-[280px] min-h-screen bg-bg-page border-r border-border-divider flex flex-col transition-transform duration-300"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- LOGO -->
    <div class="h-[72px] px-6 flex items-center border-b border-border-divider flex-shrink-0">
      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-xl bg-bg-accent border border-border-accent flex items-center justify-center"
        >
          <svg
            width="18"
            height="18"
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
        <div>
          <p class="text-text-title text-sm font-semibold tracking-tight">Boardly</p>
          <p class="text-text-body text-[11px]">Productivity Workspace</p>
        </div>
      </div>
    </div>

    <!-- CREATE -->
    <div class="p-4 flex-shrink-0">
      <button
        @click="openCreateBoard"
        class="w-full h-11 rounded-xl cursor-pointer text-sm font-medium text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style="background: linear-gradient(135deg, #6366f1, #8b5cf6)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Create board
      </button>
    </div>

    <!-- NAV -->
    <div class="px-3 space-y-0.5 flex-shrink-0">
      <button
        @click="navigate(goToDashBoard)"
        class="w-full flex cursor-pointer items-center gap-3 px-3 h-10 rounded-xl transition-colors text-left"
        :class="
          $route.path === '/app/dashboard'
            ? 'bg-bg-nav-active text-text-nav-active'
            : 'hover:bg-bg-nav-hover text-text-nav-inactive'
        "
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
        <span class="text-sm">Dashboard</span>
      </button>

      <button
        @click="navigate(goToBoards)"
        class="w-full cursor-pointer flex items-center gap-3 px-3 h-10 rounded-xl transition-colors text-left"
        :class="
          $route.path === '/app/boards'
            ? 'bg-bg-nav-active text-text-nav-active'
            : 'hover:bg-bg-nav-hover text-text-nav-inactive'
        "
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"
          />
        </svg>
        <span class="text-sm">All boards</span>
      </button>

      <button
        @click="navigate(goToFavorites)"
        class="w-full cursor-pointer flex items-center gap-3 px-3 h-10 rounded-xl transition-colors text-left"
        :class="
          $route.path === '/app/favorites'
            ? 'bg-bg-nav-active text-text-nav-active'
            : 'hover:bg-bg-nav-hover text-text-nav-inactive'
        "
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          />
        </svg>
        <span class="text-sm">Favorites</span>
      </button>

      <button
        @click="showSettings = !showSettings"
        class="w-full cursor-pointer flex items-center gap-3 px-3 h-10 rounded-xl transition-colors text-left"
        :class="
          showSettings
            ? 'bg-bg-nav-active text-text-nav-active'
            : 'hover:bg-bg-nav-hover text-text-nav-inactive'
        "
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
          />
        </svg>
        <span class="text-sm">Settings</span>
      </button>

      <div v-if="showSettings" class="ml-8 mt-1 mb-2">
        <button
          @click="toggleTheme"
          class="text-xs cursor-pointer text-text-muted hover:text-text-title transition-colors"
        >
          🌗 Toggle theme
        </button>
      </div>
    </div>

    <!-- ADMIN DROPDOWN -->
    <div v-if="userIsAdmin" class="mt-2 px-3 flex-shrink-0">
      <button
        @click="showAdmin = !showAdmin"
        class="w-full cursor-pointer flex items-center justify-between px-3 h-10 rounded-xl transition-colors"
        :class="
          showAdmin
            ? 'bg-bg-nav-active text-text-nav-active'
            : 'hover:bg-bg-nav-hover text-text-nav-inactive'
        "
      >
        <div class="flex items-center gap-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            />
          </svg>
          <span class="text-sm">Admin</span>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          class="transition-transform duration-200"
          :style="showAdmin ? 'transform: rotate(180deg)' : ''"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div v-if="showAdmin" class="mt-0.5 space-y-0.5 pl-2">
        <button
          @click="navigate(goToLabels)"
          class="w-full cursor-pointer flex items-center gap-3 px-3 h-10 rounded-xl hover:bg-bg-nav-hover transition-colors text-left text-text-nav-inactive"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
            />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span class="text-sm">Labels</span>
        </button>

        <button
          @click="navigate(goToUsers)"
          class="w-full cursor-pointer flex items-center gap-3 px-3 h-10 rounded-xl hover:bg-bg-nav-hover transition-colors text-left text-text-nav-inactive"
        >
          <svg
            width="15"
            height="15"
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
          <span class="text-sm">Users</span>
        </button>
      </div>
    </div>

    <!-- Scrollable middle -->
    <div class="mt-6 flex-1 overflow-y-auto px-5 space-y-6 pb-4">
      <!-- NEW BOARDS -->
      <div>
        <p class="text-[11px] uppercase tracking-[0.2em] text-text-muted mb-2">New Boards</p>
        <div class="space-y-0.5">
          <button
            v-for="board in boardStore.latestBoards"
            :key="board.id"
            @click="navigate(() => goToBoard(board.id))"
            class="w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-bg-nav-hover transition-colors text-left"
          >
            <div
              class="w-6 h-6 rounded-md bg-bg-accent border border-border-accent flex items-center justify-center text-text-accent text-[11px] font-semibold flex-shrink-0"
            >
              {{ board.title.charAt(0).toUpperCase() }}
            </div>
            <span class="text-sm text-text-board-item truncate">{{ board.title }}</span>
          </button>
        </div>
      </div>

      <!-- FAVORITES -->
      <div>
        <p class="text-[11px] uppercase tracking-[0.2em] text-text-muted mb-2">Favorites</p>
        <div class="space-y-0.5">
          <button
            v-for="board in favoriteBoards"
            :key="board.id"
            @click="navigate(() => goToBoard(board.id))"
            class="w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-bg-nav-hover transition-colors text-left"
          >
            <div
              class="w-6 h-6 rounded-md bg-bg-avatar-favorite border border-border-avatar-favorite flex items-center justify-center text-text-avatar-favorite text-[11px] font-semibold flex-shrink-0"
            >
              {{ board.title.charAt(0).toUpperCase() }}
            </div>
            <span class="text-sm text-text-board-item truncate">{{ board.title }}</span>
            <svg
              class="w-3 h-3 text-text-favorite-icon flex-shrink-0 ml-auto"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </button>
          <p v-if="favoriteBoards.length === 0" class="text-[12px] text-text-muted px-3 py-2">
            No favorites yet
          </p>
        </div>
      </div>
    </div>

    <!-- USER -->
    <div class="p-4 border-t border-border-divider flex-shrink-0">
      <div
        class="flex items-center gap-3 px-3 py-3 rounded-xl bg-bg-user-panel border border-border-user-panel"
      >
        <div
          class="w-8 h-8 rounded-full bg-bg-accent border border-border-accent flex items-center justify-center text-text-accent text-sm font-semibold flex-shrink-0"
        >
          {{ userInitial }}
        </div>
        <div class="min-w-0">
          <p class="text-sm text-text-username font-medium truncate">{{ username }}</p>
          <p @click="session.logout" class="text-[11px] text-text-danger cursor-pointer">Log out</p>
        </div>
      </div>
    </div>
  </aside>
</template>
