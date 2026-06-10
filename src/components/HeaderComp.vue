<script setup lang="ts">
import { useBoardStore } from '@/features/boards/store/boardsStore'
import { useSessionStore } from '@/stores/usersSessionStore'
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const session = useSessionStore()
const boardStore = useBoardStore()
const showMobileSearch = ref(false)

const userInitial = computed(() => {
  return session.user?.usr_username?.charAt(0)?.toUpperCase() || '?'
})

function onSearchInput() {
  if (route.path !== '/app/boards') {
    router.push('/app/boards')
  }
}

watch(
  () => route.path,
  (path) => {
    if (!path.startsWith('/app/boards')) {
      boardStore.titleSearch = ''
      showMobileSearch.value = false
    }
  },
)
</script>

<template>
  <nav class="relative z-20 border-b border-border-divider bg-bg-page">
    <div class="flex items-center justify-between px-4 md:px-8 xl:px-16 py-4">
      <!-- LEVO — spacer na desktopu, mesta za hamburger na mobilnom -->
      <div class="w-9 md:hidden" />

      <!-- CENTER — search na desktopu -->
      <div class="hidden md:flex flex-1 justify-center">
        <div class="relative w-[420px]">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            v-model="boardStore.titleSearch"
            @input="onSearchInput"
            placeholder="Search boards..."
            class="app-input h-10 pl-9 pr-4"
          />
        </div>
      </div>

      <!-- DESNO -->
      <div class="flex items-center gap-2">
        <!-- Search dugme — samo mobilno -->
        <button
          @click="showMobileSearch = !showMobileSearch"
          class="md:hidden relative w-9 h-9 rounded-xl hover:bg-bg-nav-hover border border-transparent hover:border-border-default flex items-center justify-center text-text-subtle hover:text-text-board-item transition-all"
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        <!-- Notifications -->
        <button
          class="relative w-9 h-9 rounded-xl hover:bg-bg-nav-hover border border-transparent hover:border-border-default flex items-center justify-center text-text-subtle hover:text-text-board-item transition-all"
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
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-bg-btn-primary"></span>
        </button>

        <!-- Divider -->
        <div class="w-px h-5 bg-border-default"></div>

        <!-- User -->
        <div
          @click="router.push('/app/profile')"
          class="flex items-center gap-2.5 pl-1 cursor-pointer group"
        >
          <div
            class="w-8 h-8 rounded-full bg-bg-accent border border-border-accent flex items-center justify-center text-text-accent text-xs font-semibold"
          >
            {{ userInitial }}
          </div>
          <svg
            class="hidden md:block w-3.5 h-3.5 text-text-muted group-hover:text-text-board-item transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>

    <!-- MOBILE SEARCH — razvlači se ispod -->
    <div v-if="showMobileSearch" class="md:hidden px-4 pb-3">
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-model="boardStore.titleSearch"
          @input="onSearchInput"
          placeholder="Search boards..."
          autofocus
          class="w-full h-10 pl-9 pr-4 rounded-xl bg-bg-nav-hover border border-border-default text-text-nav-active placeholder:text-text-muted text-sm outline-none focus:border-border-hover focus:bg-bg-nav-active transition-all"
        />
      </div>
    </div>
  </nav>
</template>
