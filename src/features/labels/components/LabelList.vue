<script setup lang="ts">
import type { Label } from '@/features/tasks/data/tasksTypes'
import { useLabelStore } from '../stores/labelStore'
import LabelComp from './LabelComp.vue'
import { computed, ref, watch } from 'vue'

const labelStore = useLabelStore()

const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'edit', label: Label): void
}>()

const currentPage = ref(1)
const labelsPerPage = 9

const totalPages = computed(() => {
  return Math.ceil(labelStore.filteredLabels.length / labelsPerPage) || 1
})

const paginatedLabels = computed(() => {
  const start = (currentPage.value - 1) * labelsPerPage
  const end = start + labelsPerPage

  return labelStore.filteredLabels.slice(start, end)
})

watch(
  () => labelStore.nameSearch,
  () => {
    currentPage.value = 1
  },
)

watch(
  () => totalPages.value,
  (newTotal) => {
    if (currentPage.value > newTotal) {
      currentPage.value = Math.max(1, newTotal)
    }
  },
)
</script>

<template>
  <div v-if="labelStore.filteredLabels.length" class="space-y-4">
    <div class="min-h-[430px]">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <LabelComp
          v-for="label in paginatedLabels"
          :key="label.id"
          :label="label"
          @delete="emit('delete', $event)"
          @edit="emit('edit', $event)"
        />
      </div>
    </div>

    <div
      v-if="labelStore.labelsList.length > 9"
      class="flex items-center justify-center gap-2 pt-3 border-t border-border-divider"
    >
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

      <span class="text-text-danger text-xs tabular-nums">
        {{ currentPage }} / {{ totalPages }}
      </span>

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

  <div
    v-else
    class="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center"
  >
    <p class="text-white/30">No labels created yet</p>
  </div>
</template>
