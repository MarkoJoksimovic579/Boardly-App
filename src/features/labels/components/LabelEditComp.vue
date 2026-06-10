<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Label } from '@/features/tasks/data/tasksTypes'

const props = defineProps<{
  label: Label
}>()

const emit = defineEmits<{
  (e: 'save', label: Label): void
  (e: 'cancel'): void
}>()

// 🔥 local copy of props
const localLabel = ref<Label>({ ...props.label })

// ako se props promene dok je modal otvoren
watch(
  () => props.label,
  (newVal) => {
    localLabel.value = { ...newVal }
  },
)

function save() {
  emit('save', localLabel.value)
}
</script>

<template>
  <div class="modal-overlay" @click="emit('cancel')">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title text-center">Edit Label</h2>
        <p class="modal-subtitle">Update label details</p>
      </div>

      <!-- Name -->
      <div class="modal-field">
        <label class="modal-title">Label name</label>

        <input v-model="localLabel.name" class="modal-input" />
      </div>

      <!-- Color -->
      <div class="modal-field">
        <label class="modal-title">Label color</label>

        <div class="flex items-center gap-3">
          <input
            v-model="localLabel.color"
            type="color"
            class="w-10 h-10 rounded-lg border border-border-default bg-transparent cursor-pointer"
          />

          <input v-model="localLabel.color" class="modal-input flex-1" />
        </div>
      </div>

      <!-- Preview -->
      <div class="modal-field">
        <label class="modal-title px-2">Preview</label>

        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm"
          :style="{
            borderColor: localLabel.color,
            color: localLabel.color,
          }"
        >
          <span class="w-2 h-2 ml-2 rounded-full" :style="{ backgroundColor: localLabel.color }" />
          {{ localLabel.name }}
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="modal-cancel" @click="emit('cancel')">Cancel</button>

        <button class="modal-primary" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>
