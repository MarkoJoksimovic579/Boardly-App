<script setup lang="ts">
import { useMessageStore } from '@/stores/messageStore'

const messageStore = useMessageStore()
</script>

<template>
  <Transition name="toast">
    <div
      v-if="messageStore.visible"
      class="fixed top-5 right-5 z-9999 rounded-xl px-5 py-3 shadow-xl text-sm font-medium"
      :class="messageStore.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
    >
      {{ messageStore.text }}
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
