<script setup lang="ts">
import { ref } from 'vue'
import type { BoardPayload } from '../data/boardsTypes'

const emit = defineEmits<{
  (e: 'save', newBoard: BoardPayload): void
  (e: 'cancel'): void
}>()

const props = defineProps<{
  loading?: boolean
}>()

const form = ref({
  title: '',
  description: '',
})

function save() {
  if (!form.value.title.trim()) return
  const newBoard = {
    title: form.value.title,
    description: form.value.description,
  }

  emit('save', newBoard)
}
</script>

<template>
  <div class="modal-overlay" @click="$emit('cancel')">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title text-center">Add Board</h2>
        <p class="modal-subtitle">Create a new board for your tasks</p>
      </div>

      <!-- Title -->
      <div class="modal-field">
        <label class="modal-label">Board title</label>

        <input v-model="form.title" class="modal-input" placeholder="Enter board title" />
      </div>

      <!-- Description -->
      <div class="modal-field">
        <label class="modal-label">Board description</label>

        <textarea
          v-model="form.description"
          rows="4"
          class="modal-textarea"
          placeholder="Enter board description"
        />
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="modal-cancel" @click="$emit('cancel')">Cancel</button>

        <button class="modal-primary" type="button" :disabled="props.loading" @click="save">
          <span v-if="loading" class="spinner spinner-sm"></span>
          <span>{{ loading ? 'Saving...' : 'Save' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
