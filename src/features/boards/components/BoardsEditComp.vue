<script setup lang="ts">
import { ref } from 'vue'
import type { BoardPayload } from '../data/boardsTypes'

const props = defineProps<{
  board: BoardPayload
}>()
console.log('props board', props.board)
const localBoard = ref<BoardPayload>({ ...props.board })

const emit = defineEmits<{
  (e: 'save', board: BoardPayload): void
  (e: 'cancel'): void
}>()

function handleSave() {
  emit('save', localBoard.value)
}
</script>
<template>
  <div class="modal-overlay" @click="emit('cancel')">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title text-center">Edit Board</h2>
        <p class="modal-subtitle">Update board information</p>
      </div>

      <!-- Title -->
      <div class="modal-field">
        <label class="modal-title">Board title</label>

        <input v-model="localBoard.title" class="modal-input" placeholder="Enter board title" />
      </div>

      <!-- Description -->
      <div class="modal-field">
        <label class="modal-title">Board description</label>

        <textarea
          v-model="localBoard.description"
          rows="4"
          class="modal-textarea"
          placeholder="Enter board description"
        />
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="modal-cancel" @click="emit('cancel')">Cancel</button>

        <button class="modal-primary" @click="handleSave">Save</button>
      </div>
    </div>
  </div>
</template>
