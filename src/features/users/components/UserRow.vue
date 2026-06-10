<script setup lang="ts">
import type { User } from '../data/usersMockData'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  (e: 'edit', user: User): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <!-- DESKTOP — table row -->
  <tr class="hidden md:table-row border-b border-border-divider hover:bg-bg-nav-hover transition">
    <td class="px-5 py-3 text-text-body">
      {{ props.user.usr_fullname }}
    </td>
    <td class="px-5 py-3 text-text-nav-active">
      {{ props.user.usr_username }}
    </td>
    <td class="px-5 py-3 text-text-body">
      {{ props.user.usr_email }}
    </td>
    <td class="px-5 py-3">
      <div class="flex gap-2 justify-end">
        <button
          @click="emit('edit', user)"
          class="px-3 py-1 rounded-lg bg-bg-btn-edit text-text-btn-edit hover:bg-bg-btn-edit-hover transition"
        >
          Edit
        </button>
        <button
          @click="emit('delete', user.usr_id)"
          class="px-3 py-1 rounded-lg bg-bg-danger-hover text-text-danger hover:bg-red-500/20 transition"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>

  <!-- MOBILE — card -->
  <tr class="md:hidden">
    <td colspan="4" class="px-4 py-2">
      <div class="rounded-xl border border-border-default bg-bg-card p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-text-nav-active text-sm font-medium">{{
            props.user.usr_username
          }}</span>
          <div class="flex gap-2">
            <button
              @click="emit('edit', user)"
              class="px-3 py-1 rounded-lg bg-bg-btn-edit text-text-btn-edit hover:bg-bg-btn-edit-hover text-sm transition"
            >
              Edit
            </button>

            <button
              @click="emit('delete', user.usr_id)"
              class="px-3 py-1 rounded-lg bg-bg-danger-hover text-text-danger hover:bg-red-500/20 text-sm transition"
            >
              Delete
            </button>
          </div>
        </div>
        <span class="text-text-body text-xs">{{ props.user.usr_fullname }}</span>
        <span class="text-text-muted text-xs">{{ props.user.usr_email }}</span>
      </div>
    </td>
  </tr>
</template>
