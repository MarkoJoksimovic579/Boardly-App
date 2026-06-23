<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '@/features/users/data/usersMockData'
import { useUsersStore } from '@/features/users/stores/usersStore'
import { useSessionStore } from '@/stores/usersSessionStore'
import { useMessageStore } from '@/stores/messageStore'

const session = useSessionStore()
const userStore = useUsersStore()
const messageStore = useMessageStore()

const user = ref<User>()
const editUser = ref<User>()
const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)

async function loadUser() {
  try {
    if (!session.user?.usr_id) return

    isLoading.value = true
    user.value = await userStore.fetchUserById(session.user.usr_id)
  } catch (err) {
    console.error(err)
    messageStore.fail('Failed to load profile')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadUser)

function startEdit() {
  if (!user.value) return

  editUser.value = { ...user.value }
  isEditing.value = true
}

function cancel() {
  editUser.value = undefined
  isEditing.value = false
}

async function save() {
  if (!editUser.value) return

  try {
    isSaving.value = true

    await userStore.updateUsers(editUser.value)

    user.value = { ...editUser.value }
    isEditing.value = false

    messageStore.success('Profile updated successfully')
  } catch (err) {
    console.error(err)
    messageStore.fail('Failed to update profile')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="p-4 md:p-10 flex flex-col gap-7">
    <div v-if="isLoading" class="text-text-muted text-sm">Loading profile...</div>

    <template v-else>
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div class="flex items-center gap-4 md:gap-5">
          <div
            class="w-16 h-16 rounded-full bg-bg-accent border-2 border-bg-default flex items-center justify-center text-2xl font-medium text-text-accent shrink-0"
          >
            {{ user?.usr_fullname?.charAt(0).toUpperCase() }}
          </div>

          <div class="flex flex-col gap-1 min-w-0">
            <h1 class="text-xl font-medium text-text-title leading-tight truncate">
              {{ user?.usr_fullname }}
            </h1>

            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm text-text-muted font-mono">@{{ user?.usr_username }}</span>

              <span
                v-if="session.isAdmin"
                class="inline-flex items-center gap-1 bg-bg-accent border border-border-accent text-text-accent text-xs font-medium px-2 py-0.5 rounded-full"
              >
                Admin
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 flex-wrap">
          <template v-if="!isEditing">
            <button
              @click="startEdit"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border-default text-text-title text-sm font-medium hover:bg-bg-secondary transition"
            >
              Edit
            </button>
          </template>

          <template v-else>
            <button
              @click="cancel"
              :disabled="isSaving"
              class="inline-flex items-center px-3.5 py-2 rounded-lg border border-border-default text-text-muted text-sm font-medium hover:bg-bg-secondary transition disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              @click="save"
              :disabled="isSaving"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-bg-btn-primary text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
            >
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
          </template>

          <button
            @click="session.logout()"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border-danger text-text-danger text-sm font-medium hover:bg-bg-danger-hover transition"
          >
            Log out
          </button>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-bg-secondary rounded-lg p-4 flex flex-col gap-1">
          <span class="text-xs text-text-muted">Status</span>
          <span class="text-sm md:text-base font-medium text-text-title flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            Active
          </span>
        </div>

        <div class="bg-bg-secondary rounded-lg p-4 flex flex-col gap-1">
          <span class="text-xs text-text-muted">Username</span>
          <span class="text-sm font-medium text-text-title font-mono truncate">
            {{ user?.usr_username }}
          </span>
        </div>

        <div class="bg-bg-secondary rounded-lg p-4 flex flex-col gap-1">
          <span class="text-xs text-text-muted">Roles count</span>
          <span class="text-sm md:text-base font-medium text-text-title">
            {{ user?.roles?.length ?? 0 }}
          </span>
        </div>
      </div>

      <!-- Account info card -->
      <div class="bg-bg-card rounded-xl border border-border-default overflow-hidden">
        <div
          class="flex items-center justify-between px-4 md:px-5 py-4 border-b border-border-divider"
        >
          <span class="text-xs font-medium text-text-muted uppercase tracking-wide">
            Account info
          </span>

          <span
            v-if="isEditing"
            class="text-xs text-text-muted bg-bg-secondary px-2.5 py-1 rounded-full border border-border-default"
          >
            Editing
          </span>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 md:px-5 py-3.5 border-b border-border-divider"
        >
          <span class="text-sm text-text-muted">Full name</span>

          <input
            v-if="isEditing && editUser"
            v-model="editUser.usr_fullname"
            class="w-full sm:w-64 text-sm font-medium text-text-title bg-bg-secondary border border-border-default rounded-lg px-3 py-2 outline-none focus:border-border-accent"
          />

          <span v-else class="text-sm font-medium text-text-title">
            {{ user?.usr_fullname }}
          </span>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 md:px-5 py-3.5 border-b border-border-divider"
        >
          <span class="text-sm text-text-muted">Username</span>

          <input
            v-if="isEditing && editUser"
            v-model="editUser.usr_username"
            class="w-full sm:w-64 text-sm font-medium text-text-title bg-bg-secondary border border-border-default rounded-lg px-3 py-2 font-mono outline-none focus:border-border-accent"
          />

          <span v-else class="text-sm font-medium text-text-title font-mono">
            {{ user?.usr_username }}
          </span>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 md:px-5 py-3.5 border-b border-border-divider"
        >
          <span class="text-sm text-text-muted">Email</span>

          <input
            v-if="isEditing && editUser"
            v-model="editUser.usr_email"
            type="email"
            class="w-full sm:w-64 text-sm font-medium text-text-title bg-bg-secondary border border-border-default rounded-lg px-3 py-2 font-mono outline-none focus:border-border-accent"
          />

          <span v-else class="text-sm font-medium text-text-title font-mono break-all">
            {{ user?.usr_email }}
          </span>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 md:px-5 py-3.5"
        >
          <span class="text-sm text-text-muted">Roles</span>

          <div class="flex gap-1.5 flex-wrap sm:justify-end">
            <span
              v-for="role in user?.roles"
              :key="role.rol_id"
              class="inline-flex items-center gap-1 bg-bg-accent border border-border-accent text-text-accent text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {{ role.rol_name }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
