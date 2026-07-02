<script setup lang="ts">
import { useConfirmStore } from '@/stores/confirmStore'

const confirmStore = useConfirmStore()
</script>

<template>
  <div
    v-if="confirmStore.isOpen"
    class="fixed inset-0 z-999 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
  >
    <div class="w-full max-w-md rounded-2xl border border-border-default bg-bg-card p-6 shadow-2xl">
      <h2 class="text-lg font-semibold text-text-title mb-2">
        {{ confirmStore.title }}
      </h2>

      <p class="text-sm text-text-muted mb-6 leading-relaxed">
        {{ confirmStore.message }}
      </p>

      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 rounded-xl border border-border-default text-text-muted hover:bg-bg-subtle hover:text-text-title transition"
          @click="confirmStore.cancel"
        >
          {{ confirmStore.cancelText }}
        </button>

        <button
          class="px-4 py-2 rounded-xl text-white transition"
          :class="
            confirmStore.variant === 'danger'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          "
          @click="confirmStore.confirm"
        >
          {{ confirmStore.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
