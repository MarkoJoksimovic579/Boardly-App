<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ListPayload } from '../data/listsTypes'

import BaseButton from '@/components/ui/BaseButton.vue'

const emit = defineEmits<{
  (e: 'add', list: ListPayload): void
  (e: 'cancel'): void
}>()

const props = defineProps<{
  loading?: boolean
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

        <BaseButton
          variant="primary"
          :loading="props.loading"
          :disabled="!inputForm.title?.trim()"
          @click="handleSubmit"
        >
          Create list
        </BaseButton>
      </div>
    </div>
  </div>
</template>
