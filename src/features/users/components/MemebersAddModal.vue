<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsersStore } from '../stores/usersStore'

const userStore = useUsersStore()

const selectedUserIds = ref<number[]>([])

function toggleUser(id: number) {
  if (selectedUserIds.value.includes(id)) {
    selectedUserIds.value = selectedUserIds.value.filter((i) => i !== id)
  } else {
    selectedUserIds.value.push(id)
  }
}
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'add', ids: number[]): void
}>()
onMounted(() => userStore.fetchUsers())
</script>
<template>
  <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
    <div
      class="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl"
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <h2 class="text-xl font-semibold text-white">Add Board Members</h2>
          <p class="text-sm text-white/40 mt-1">Select users you want to add to this board</p>
        </div>

        <button @click="emit('cancel')" class="text-white/40 hover:text-white transition">✕</button>
      </div>

      <!-- LIST -->
      <div class="overflow-y-auto max-h-[65vh] p-4 space-y-2">
        <div
          v-for="user in userStore.usersList"
          :key="user.usr_id"
          @click="toggleUser(user.usr_id)"
          class="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition"
        >
          <div class="flex flex-col">
            <span class="text-white font-medium">
              {{ user.usr_fullname }}
            </span>
            <span class="text-white/40 text-sm">
              {{ user.usr_username }} • {{ user.usr_email }}
            </span>
          </div>

          <!-- checkbox -->
          <div
            class="w-5 h-5 rounded border flex items-center justify-center"
            :class="
              selectedUserIds.includes(user.usr_id)
                ? 'bg-blue-500 border-blue-500'
                : 'border-white/30'
            "
          >
            <span v-if="selectedUserIds.includes(user.usr_id)" class="text-xs text-white"> ✓ </span>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="p-4 border-t border-white/10 flex justify-end gap-2">
        <button @click="emit('cancel')" class="px-4 py-2 text-white/60 hover:text-white">
          Cancel
        </button>

        <button
          @click="emit('add', selectedUserIds)"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
        >
          Add selected ({{ selectedUserIds.length }})
        </button>
      </div>
    </div>
  </div>
</template>
