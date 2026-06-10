<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '@/features/users/data/usersMockData'
import { useUsersStore } from '@/features/users/stores/usersStore'
import { useSessionStore } from '@/stores/usersSessionStore'

const session = useSessionStore()
const userStore = useUsersStore()
const id = session.user?.usr_id

const user = ref<User>()
const editUser = ref<User>()
const isEditing = ref(false)

onMounted(async () => {
  user.value = await userStore.fetchUserById(id)
})

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
  await userStore.updateUsers(editUser.value)
  user.value = { ...editUser.value }
  isEditing.value = false
}
</script>

<template>
  <div class="p-10 flex flex-col gap-7">
    <!-- Header — uvek read-only -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-5">
        <div
          class="w-[68px] h-[68px] rounded-full bg-bg-accent border-2 border-bg-default flex items-center justify-center text-[24px] font-medium text-text-accent flex-shrink-0"
        >
          {{ user?.usr_fullname?.charAt(0).toUpperCase() }}
        </div>

        <div class="flex flex-col gap-1">
          <h1 class="text-[20px] font-medium text-text-title leading-tight">
            {{ user?.usr_fullname }}
          </h1>
          <div class="flex items-center gap-2">
            <span class="text-[13px] text-text-muted font-mono">@{{ user?.usr_username }}</span>
            <span
              v-if="session.isAdmin"
              class="inline-flex items-center gap-1 bg-bg-accent border border-border-accent text-text-accent text-[11px] font-medium px-2 py-0.5 rounded-full"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Admin
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <template v-if="!isEditing">
          <button
            @click="startEdit"
            class="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-[8px] border border-border-default text-text-title text-[13px] font-medium hover:bg-bg-secondary transition-all duration-150"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
        </template>

        <template v-else>
          <button
            @click="cancel"
            class="inline-flex items-center px-3.5 py-[7px] rounded-[8px] border border-border-default text-text-muted text-[13px] font-medium hover:bg-bg-secondary transition-all duration-150"
          >
            Cancel
          </button>
          <button
            @click="save"
            class="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-[8px] bg-bg-btn-primary text-white text-[13px] font-medium hover:opacity-90 transition-all duration-150"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Save
          </button>
        </template>

        <button
          @click="session.logout()"
          class="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-[8px] border border-border-danger text-text-danger text-[13px] font-medium hover:bg-bg-danger-hover transition-all duration-150"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out
        </button>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-3 gap-2.5">
      <div class="bg-bg-secondary rounded-[8px] p-4 flex flex-col gap-1">
        <span class="text-[11px] text-text-muted">Status</span>
        <span class="text-[15px] font-medium text-text-title flex items-center gap-1.5">
          <span class="w-[7px] h-[7px] rounded-full bg-green-500 inline-block"></span>
          Active
        </span>
      </div>
      <div class="bg-bg-secondary rounded-[8px] p-4 flex flex-col gap-1">
        <span class="text-[11px] text-text-muted">Username</span>
        <span class="text-[13px] font-medium text-text-title font-mono">{{
          user?.usr_username
        }}</span>
      </div>
      <div class="bg-bg-secondary rounded-[8px] p-4 flex flex-col gap-1">
        <span class="text-[11px] text-text-muted">Roles count</span>
        <span class="text-[15px] font-medium text-text-title">{{ user?.roles?.length ?? 0 }}</span>
      </div>
    </div>

    <!-- Account info card -->
    <div class="bg-bg-card rounded-[12px] border border-border-default overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-border-divider">
        <span class="text-[11px] font-medium text-text-muted uppercase tracking-[0.05em]">
          Account info
        </span>
        <span
          v-if="isEditing"
          class="text-[11px] text-text-muted bg-bg-secondary px-2.5 py-1 rounded-full border border-border-default"
        >
          Editing
        </span>
      </div>

      <div class="flex items-center justify-between px-5 py-3.5 border-b border-border-divider">
        <span class="text-[12px] text-text-muted flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="opacity-50"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
          Full name
        </span>
        <input
          v-if="isEditing"
          v-model="editUser!.usr_fullname"
          class="text-[13px] font-medium text-text-title bg-bg-secondary border border-border-default rounded-[6px] px-2.5 py-1.5 outline-none focus:border-border-accent min-w-[200px]"
        />
        <span v-else class="text-[13px] font-medium text-text-title">{{ user?.usr_fullname }}</span>
      </div>

      <div class="flex items-center justify-between px-5 py-3.5 border-b border-border-divider">
        <span class="text-[12px] text-text-muted flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="opacity-50"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
          Username
        </span>
        <input
          v-if="isEditing"
          v-model="editUser!.usr_username"
          class="text-[12px] font-medium text-text-title bg-bg-secondary border border-border-default rounded-[6px] px-2.5 py-1.5 font-mono outline-none focus:border-border-accent min-w-[200px]"
        />
        <span v-else class="text-[12px] font-medium text-text-title font-mono">{{
          user?.usr_username
        }}</span>
      </div>

      <div class="flex items-center justify-between px-5 py-3.5 border-b border-border-divider">
        <span class="text-[12px] text-text-muted flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="opacity-50"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Email
        </span>
        <input
          v-if="isEditing"
          v-model="editUser!.usr_email"
          type="email"
          class="text-[12px] font-medium text-text-title bg-bg-secondary border border-border-default rounded-[6px] px-2.5 py-1.5 font-mono outline-none focus:border-border-accent min-w-[200px]"
        />
        <span v-else class="text-[12px] font-medium text-text-title font-mono">{{
          user?.usr_email
        }}</span>
      </div>

      <div class="flex items-center justify-between px-5 py-3.5">
        <span class="text-[12px] text-text-muted flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="opacity-50"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Roles
        </span>
        <div class="flex gap-1.5 flex-wrap justify-end">
          <span
            v-for="role in user?.roles"
            :key="role.rol_id"
            class="inline-flex items-center gap-1 bg-bg-accent border border-border-accent text-text-accent text-[11px] font-medium px-2 py-0.5 rounded-full"
          >
            {{ role.rol_name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
