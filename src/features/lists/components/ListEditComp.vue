<script setup lang="ts">
import { ref } from 'vue'
import type { ListPayload } from '../data/listsTypes'

const props = defineProps<{
  list: ListPayload
}>()

const localList = ref({ ...props.list })

const emit = defineEmits<{
  (e: 'edit', list: ListPayload): void
  (e: 'cancel'): void
}>()

function handleSubmit() {
  emit('edit', localList.value)
}
</script>

<template>
  <div class="modal-overlay" @click="emit('cancel')">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title text-center">Edit List</h2>
        <p class="modal-subtitle">Update list information</p>
      </div>

      <!-- Title -->
      <div class="modal-field">
        <label class="modal-label">List title</label>

        <input
          v-model="localList.title"
          type="text"
          maxlength="64"
          placeholder="Enter list title"
          class="modal-input"
        />
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button @click="emit('cancel')" class="modal-cancel">Cancel</button>

        <button @click="handleSubmit" class="modal-primary">Save</button>
      </div>
    </div>
  </div>
</template>
