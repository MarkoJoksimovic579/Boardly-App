<script setup lang="ts">
import { useSessionStore } from '@/stores/usersSessionStore'
import { useBoardStore } from '@/features/boards/stores/boardsStore.ts'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardUiStore } from '@/features/boards/stores/boardUiStore.ts'
import SettingsComp from './SettingsComp.vue'
import ThemeSelectorComp from './ThemeSelectorComp.vue'

const showTheme = ref(false)
const showSettings = ref(false)
const showAdmin = ref(false)
const isOpen = ref(false)

const router = useRouter()
const session = useSessionStore()
const boardStore = useBoardStore()
const ui = useBoardUiStore()

const userIsAdmin = session.isAdmin
const userIsOwner = session.isOwner
const username = session.user.usr_username

const userInitial = computed(() => {
  return session.user?.usr_username?.charAt(0)?.toUpperCase() || '?'
})

const favoriteBoards = computed(() => boardStore.boardsList.filter((b) => b.is_favorite))

const newBoards = computed(() => {
  const now = Date.now()
  const tenDays = 10 * 24 * 60 * 60 * 1000

  return boardStore.boardsList
    .filter((board) => {
      if (!board.created_at) return false
      return now - new Date(board.created_at).getTime() <= tenDays
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

function closeSidebar() {
  isOpen.value = false
}

function openCreateBoard() {
  router.push('/app/boards')
  ui.openAddBoard()
  closeSidebar()
}

function navigate(fn: () => void) {
  fn()
  closeSidebar()
}

function goToAbout() {
  router.push('/app/about')
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
function goToUsers() {
  router.push('/app/admin/users')
}

watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  if (!boardStore.boardsList.length) {
    boardStore.fetchBoards()
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- HAMBURGER dugme — samo na mobilnom -->
  <button
    v-if="!isOpen"
    @click="isOpen = true"
    class="md:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl bg-bg-card border border-border-default flex items-center justify-center text-text-subtle hover:text-text-nav-active transition"
  >
    <svg
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
  </button>

  <!-- OVERLAY -->
  <div v-if="isOpen" @click="closeSidebar" class="md:hidden fixed inset-0 bg-black/50 z-30" />

  <!-- SIDEBAR -->
  <aside
    class="fixed md:relative z-40 w-70 h-dvh md:h-screen bg-bg-page border-r border-border-divider flex flex-col overflow-hidden transition-transform duration-300"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- LOGO -->
    <div
      class="h-18 px-6 flex items-center justify-between border-b border-border-divider shrink-0"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="w-9 h-9 rounded-xl bg-bg-accent border border-border-accent flex items-center justify-center shrink-0"
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

        <div class="min-w-0">
          <p class="text-text-title text-sm font-semibold tracking-tight truncate">Boardly</p>
          <p class="text-text-body text-[11px] truncate">Productivity Workspace</p>
        </div>
      </div>

      <!-- CLOSE strelica na telefonu -->
      <button
        type="button"
        @click="closeSidebar"
        class="md:hidden w-8 h-8 rounded-xl border border-border-default bg-bg-card flex items-center justify-center text-text-muted hover:text-text-title hover:bg-bg-nav-hover transition"
        title="Close sidebar"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </div>

    <!-- CREATE -->
    <div class="p-4 shrink-0">
      <button
        @click="openCreateBoard"
        class="w-full h-11 rounded-xl modal-primary cursor-pointer text-sm font-medium text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
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
    <div class="px-3 space-y-0.5 shrink-0">
      <button
        @click="navigate(goToDashBoard)"
        class="w-full flex cursor-pointer items-center gap-3 px-3 h-10 rounded-xl transition-colors text-left"
        :class="
          $route.path === '/app/dashboard'
            ? 'bg-bg-nav-active text-text-nav-active'
            : 'hover:bg-bg-nav-hover text-text-nav-inactive'
        "
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
        <span class="text-sm">Favorites</span>
      </button>

      <button
        @click="showSettings = !showSettings"
        class="w-full cursor-pointer flex items-center justify-between px-3 h-10 rounded-xl transition-colors text-left"
        :class="
          showSettings
            ? 'bg-bg-nav-active text-text-nav-active'
            : 'hover:bg-bg-nav-hover text-text-nav-inactive'
        "
      >
        <span class="text-sm">Settings</span>
        <span :class="showSettings ? 'rotate-180' : ''" class="transition-transform">⌄</span>
      </button>

      <SettingsComp
        v-if="showSettings"
        @theme="showTheme = true"
        @pushAccount="navigate(() => router.push('/app/profile'))"
      />

      <button
        @click="navigate(goToAbout)"
        class="w-full cursor-pointer flex items-center gap-3 px-3 h-10 rounded-xl hover:bg-bg-nav-hover transition-colors text-left text-text-nav-inactive"
      >
        <span class="text-sm">About</span>
      </button>

      <ThemeSelectorComp v-if="showTheme" @close="showTheme = false" />
    </div>

    <!-- ADMIN -->
    <div v-if="userIsAdmin || userIsOwner" class="mt-2 px-3 shrink-0">
      <button
        @click="showAdmin = !showAdmin"
        class="w-full cursor-pointer flex items-center justify-between px-3 h-10 rounded-xl transition-colors"
        :class="
          showAdmin
            ? 'bg-bg-nav-active text-text-nav-active'
            : 'hover:bg-bg-nav-hover text-text-nav-inactive'
        "
      >
        <span class="text-sm">Admin</span>
        <span :class="showAdmin ? 'rotate-180' : ''" class="transition-transform">⌄</span>
      </button>

      <button
        v-if="showAdmin"
        @click="navigate(goToUsers)"
        class="w-full cursor-pointer flex items-center gap-3 px-3 h-10 rounded-xl hover:bg-bg-nav-hover transition-colors text-left text-text-nav-inactive"
      >
        <span class="text-sm">Users</span>
      </button>
    </div>

    <!-- BOARDS AREA -->
    <div class="mt-4 flex-1 min-h-0 px-5 pb-2 md:pb-4 overflow-hidden">
      <div class="h-full flex flex-col gap-4 min-h-0">
        <!-- NEW BOARDS -->
        <div class="flex flex-col min-h-0 flex-1">
          <p class="text-[11px] uppercase tracking-[0.2em] text-text-muted mb-2 shrink-0">
            New Boards
          </p>

          <div class="space-y-0.5 overflow-y-auto scrollbar-custom pr-1 flex-1 min-h-0">
            <button
              v-for="board in newBoards"
              :key="board.id"
              @click="navigate(() => goToBoard(board.id))"
              class="w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-bg-nav-hover transition-colors text-left"
            >
              <div
                class="w-6 h-6 rounded-md bg-bg-accent border border-border-accent flex items-center justify-center text-text-accent text-[11px] font-semibold shrink-0"
              >
                {{ board.title.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm text-text-board-item truncate">{{ board.title }}</span>
            </button>

            <p v-if="newBoards.length === 0" class="text-[12px] text-text-muted px-3 py-2">
              No new boards
            </p>
          </div>
        </div>

        <!-- FAVORITES -->
        <div class="flex flex-col min-h-0 flex-1">
          <p class="text-[11px] uppercase tracking-[0.2em] text-text-muted mb-2 shrink-0">
            Favorites
          </p>

          <div class="space-y-0.5 overflow-y-auto scrollbar-custom pr-1 flex-1 min-h-0">
            <button
              v-for="board in favoriteBoards"
              :key="board.id"
              @click="navigate(() => goToBoard(board.id))"
              class="w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-bg-nav-hover transition-colors text-left"
            >
              <div
                class="w-6 h-6 rounded-md bg-bg-avatar-favorite border border-border-avatar-favorite flex items-center justify-center text-text-avatar-favorite text-[11px] font-semibold shrink-0"
              >
                {{ board.title.charAt(0).toUpperCase() }}
              </div>

              <span class="text-sm text-text-board-item truncate">{{ board.title }}</span>

              <svg
                class="w-3 h-3 text-text-favorite-icon shrink-0 ml-auto"
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
    </div>

    <!-- USER (sakriven na mobilnom) -->
    <div class="hidden md:flex p-2 md:p-4 border-t border-border-divider shrink-0">
      <div
        class="flex items-center gap-3 px-3 py-2 md:py-3 rounded-xl bg-bg-user-panel border border-border-user-panel w-full"
      >
        <div
          class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-bg-accent border border-border-accent flex items-center justify-center text-text-accent text-sm font-semibold shrink-0"
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
