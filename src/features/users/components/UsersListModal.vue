<script setup lang="ts">
import UserRowComp from './UserRow.vue'
import type { User } from '../data/usersMockData'
import { useUsersStore } from '../stores/usersStore'
import { computed, onMounted, ref, watch } from 'vue'

const userStore = useUsersStore()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'edit', user: User): void
  (e: 'delete', id: number): void
}>()

const currentPage = ref(1)

const usersPerPage = 7

const totalPages = computed(() => {
  return Math.ceil(userStore.filteredUsers.length / usersPerPage)
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage
  const end = start + usersPerPage

  return userStore.filteredUsers.slice(start, end)
})

watch(
  () => userStore.nameSearch, // gleda direktno u store
  () => {
    currentPage.value = 1
  },
)
watch(
  () => totalPages.value,
  (newTotal) => {
    if (currentPage.value > newTotal) {
      currentPage.value = Math.max(1, newTotal) // ne da page 3 of2 , nego te vraca na 2of2
    }
  },
)

onMounted(() => userStore.fetchUsers())
</script>

<template>
  <div class="overflow-y-auto max-h-[70vh]">
    <div class="flex min-h-[465px]">
      <table class="w-full h-full">
        <thead class="sticky top-0 bg-bg-card border-b border-border-divider">
          <tr class="text-left text-text-muted text-sm">
            <th class="hidden md:table-cell px-5 py-4 w-[30%]">Full Name</th>
            <th class="hidden md:table-cell px-5 py-4 w-[20%]">Username</th>
            <th class="hidden md:table-cell px-5 py-4 w-[35%]">Email</th>
            <th class="hidden md:table-cell px-5 py-4 w-[15%] text-right">Actions</th>
            <th class="md:hidden px-4 py-4">Users</th>
          </tr>
        </thead>

        <tbody>
          <UserRowComp
            v-for="user in paginatedUsers"
            :key="user.usr_id"
            :user="user"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-center gap-2 pt-3 border-t border-border-divider mt-3">
      <button
        class="w-7 h-7 flex items-center justify-center rounded-lg border border-border-default text-text-muted hover:text-text-nav-active hover:border-border-hover transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <span class="text-text-danger text-xs tabular-nums"
        >{{ currentPage }} / {{ totalPages }}</span
      >

      <button
        class="w-7 h-7 flex items-center justify-center rounded-lg border border-border-default text-text-muted hover:text-text-nav-active hover:border-border-hover transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
