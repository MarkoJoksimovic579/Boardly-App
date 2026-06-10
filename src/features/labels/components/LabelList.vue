<script setup lang="ts">
import type { Label } from '@/features/tasks/data/tasksTypes'
import { useLabelStore } from '../stores/labelStore'
import LabelComp from './LabelComp.vue'

const labelStore = useLabelStore()

const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'edit', label: Label): void
}>()
</script>

<template>
  <div
    v-if="labelStore.filteredLabels.length"
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
  >
    <LabelComp
      v-for="label in labelStore.filteredLabels"
      :key="label.id"
      :label="label"
      @delete="emit('delete', $event)"
      @edit="emit('edit', $event)"
    />
  </div>

  <div
    v-else
    class="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center"
  >
    <p class="text-white/30">No labels created yet</p>
  </div>
</template>
