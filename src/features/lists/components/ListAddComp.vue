<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ListPayload } from '../data/listsTypes'

const emit = defineEmits<{
  (e: 'add', list: ListPayload): void
  (e: 'cancel'): void
}>()

const inputForm = ref<ListPayload>({
  title: '',
})

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})

function handleSubmit() {
  const trimmed = inputForm.value.title?.trim()
  if (!trimmed) return

  emit('add', {
    title: trimmed,
  })

  inputForm.value.title = ''
}
</script>

<template>
  <div class="modal-overlay" @click="emit('cancel')">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title text-center">Add List</h2>
        <p class="modal-subtitle">Create a new list for your board</p>
      </div>

      <!-- Title -->
      <div class="modal-field">
        <label class="modal-label">List title</label>

        <input
          ref="inputRef"
          v-model="inputForm.title"
          type="text"
          maxlength="64"
          placeholder="Enter list title"
          class="modal-input"
        />
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button @click="emit('cancel')" class="modal-cancel">Cancel</button>

        <button
          @click="handleSubmit"
          :disabled="!inputForm.title?.trim()"
          class="modal-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>
