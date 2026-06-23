<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import { ref } from 'vue'

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', label: { name: string; color: string }): void
  (e: 'cancel'): void
}>()

const form = ref({
  name: '',
  color: '',
})

function add() {
  emit('save', {
    name: form.value.name,
    color: form.value.color,
  })
}
</script>

<template>
  <div class="modal-overlay" @click="emit('cancel')">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title text-center">Add Label</h2>
        <p class="modal-subtitle">Create a new label for your tasks</p>
      </div>

      <!-- Name -->
      <div class="modal-field">
        <label class="modal-label">Label name</label>

        <input v-model="form.name" class="modal-input" placeholder="Enter label name" />
      </div>

      <!-- Color -->
      <div class="modal-field">
        <label class="modal-label">Label color</label>

        <div class="flex items-center gap-3">
          <input
            v-model="form.color"
            type="color"
            class="w-10 h-10 rounded-lg border border-border-default bg-transparent cursor-pointer"
          />

          <input v-model="form.color" class="modal-input flex-1" placeholder="#6366f1" />
        </div>
      </div>

      <!-- Preview -->
      <div class="modal-field">
        <label class="modal-label px-2">Preview</label>

        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm"
          :style="{
            borderColor: form.color,
            color: form.color,
          }"
        >
          <span class="w-2 h-2 ml-2 rounded-full" :style="{ backgroundColor: form.color }" />

          {{ form.name || 'New Label' }}
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="modal-cancel" @click="emit('cancel')">Cancel</button>

        <BaseButton
          variant="primary"
          :loading="props.loading"
          :disabled="!form.name.trim() || !form.color"
          @click="add"
        >
          Save
        </BaseButton>
      </div>
    </div>
  </div>
</template>
