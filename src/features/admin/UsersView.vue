<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '../users/data/usersMockData'
import UsersListModal from '../users/components/UsersListModal.vue'
import { useUsersStore } from '../users/stores/usersStore'
import UsersAddComp, { type UserAddPayload } from './UsersAddComp.vue'
import UsersEditModal from './UsersEditModal.vue'
import { useAsyncAction } from '@/services/functions/useAsyncAction.ts'
import { useConfirmStore } from '@/stores/confirmStore.ts'

const userStore = useUsersStore()
const showEditUser = ref(false)
const editingUser = ref<User>()
const showAddUserModal = ref(false)
const confirmStore = useConfirmStore()

const { loading: isUserLoading, run } = useAsyncAction()

function handleEdit(user: User) {
  editingUser.value = { ...user }
  showEditUser.value = true
}

async function handleDelete(id: number) {
  const confirmed = await confirmStore.ask({
    title: 'Delete user',
    message: 'Are you sure you want to delete this user?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  })

  if (!confirmed) return
  await run(
    async () => {
      await userStore.eraseUsers(id)
      await userStore.fetchUsers()
    },
    {
      success: 'User deleted successfully',
      error: 'Failed to delete user',
    },
  )
}

async function handleSaveAdd(newUser: UserAddPayload) {
  await run(
    async () => {
      await userStore.addUsers(newUser)
      await userStore.fetchUsers()

      showAddUserModal.value = false
    },
    {
      success: 'User updated successfully',
      error: 'Failed to update user',
    },
  )
}

async function handleSaveEdit(updatedUser: User) {
  await run(
    async () => {
      await userStore.adminUpdateUsers(updatedUser)
      await userStore.fetchUsers()

      showEditUser.value = false
      editingUser.value = undefined
    },
    {
      success: 'User updated successfully',
      error: 'Failed to update user',
    },
  )
}
</script>

<template>
  <div class="min-h-screen p-8 space-y-8Only owner can edit own">
    <input
      type="text"
      name="fake_username"
      autocomplete="username"
      style="position: absolute; left: -9999px; height: 0; width: 0"
    />

    <input
      type="password"
      name="fake_password"
      autocomplete="new-password"
      style="position: absolute; left: -9999px; height: 0; width: 0"
    />

    <!-- HEADER -->
    <div class="flex items-start justify-between">
      <div>
        <p class="text-[11px] uppercase tracking-[0.25em] text-text-muted mb-2 font-medium">
          Admin Panel
        </p>
        <h1 class="text-3xl font-semibold text-text-title tracking-tight">Users</h1>
        <p class="text-text-body text-sm mt-1.5">Manage user accounts and permissions</p>
      </div>

      <button
        @click="showAddUserModal = true"
        class="base-button base-button-primary mt-0 h-10 px-4"
      >
        <span class="text-lg leading-none">+</span>
        New User
      </button>
    </div>

    <!-- SEARCH + STATS -->
    <div class="flex items-center gap-3">
      <div class="relative flex-1 max-w-sm">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-model="userStore.nameSearch"
          type="text"
          name="app_users_search_field"
          autocomplete="off"
          placeholder="Search users..."
          class="app-input pl-9 pr-9"
        />
        <button
          v-if="userStore.nameSearch"
          @click="userStore.nameSearch = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-title transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div
        class="rounded-xl border border-border-default bg-bg-subtle px-4 h-10 flex items-center gap-2.5 shrink-0"
      >
        <span class="text-text-muted text-[10px] uppercase tracking-[0.2em] font-medium"
          >Total</span
        >
        <span class="text-text-title font-semibold tabular-nums">{{
          userStore.usersList.length
        }}</span>
      </div>
    </div>

    <!-- LIST -->
    <UsersListModal @edit="handleEdit" @delete="handleDelete" />
    <UsersAddComp
      v-if="showAddUserModal"
      :loading="isUserLoading"
      @cancel="showAddUserModal = false"
      @save="handleSaveAdd"
    />

    <UsersEditModal
      v-if="showEditUser && editingUser"
      :user="editingUser"
      :loading="isUserLoading"
      @save="handleSaveEdit"
      @cancel="showEditUser = false"
    />
  </div>
</template>
