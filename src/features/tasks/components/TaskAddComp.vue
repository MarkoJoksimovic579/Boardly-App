<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type Label, type TaskPayload } from '../data/tasksTypes'
import { useSessionStore } from '@/stores/usersSessionStore'
import api from '@/api'

const session = useSessionStore()

const emit = defineEmits<{
  (e: 'save', task: TaskPayload): void
  (e: 'cancel'): void
}>()

const form = ref({
  title: '',
  description: '',
  labels: [] as number[],
  due_date: '',
  brd_id: '',
})

const dbLabels = ref<Label[]>([])

async function fetchLabels() {
  if (!session.sid) return
  try {
    const res = await api.getLabels(session.sid)
    const data = res.data.data
    dbLabels.value = data
  } catch (err) {
    console.log(err)
  }
}

function add() {
  const newTask: TaskPayload = {
    title: form.value.title,
    description: form.value.description,
    labels: form.value.labels,
    due_date: form.value.due_date,
    brd_id: Number(form.value.brd_id),
  }
  emit('save', newTask)
}

onMounted(() => {
  fetchLabels()
})
</script>

<template>
  <div class="modal-overlay" @click="emit('cancel')">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Add Task</h2>
        <p class="modal-subtitle">Create a new task in this list</p>
      </div>

      <!-- Title -->
      <div class="modal-field">
        <label class="modal-label">Title</label>
        <input v-model="form.title" placeholder="Task title" class="modal-input" />
      </div>

      <!-- Description -->
      <div class="modal-field">
        <label class="modal-label">Description</label>
        <textarea
          v-model="form.description"
          placeholder="Task description"
          rows="3"
          class="modal-textarea"
        />
      </div>

      <!-- Due date -->
      <div class="modal-field">
        <label class="modal-label">Due date</label>
        <input v-model="form.due_date" type="date" class="modal-input [color-scheme:dark]" />
      </div>

      <!-- Labels -->
      <div v-if="dbLabels.length" class="modal-field">
        <label class="modal-label">Labels</label>

        <div class="flex flex-wrap gap-2">
          <label
            v-for="label in dbLabels"
            :key="label.id"
            class="flex items-center gap-1.5 px-3 py-1 rounded-full border cursor-pointer text-sm transition"
            :style="{
              borderColor: label.color,
              color: label.color,
              opacity: form.labels.includes(label.id) ? 1 : 0.45,
            }"
          >
            <input type="checkbox" :value="label.id" v-model="form.labels" class="hidden" />

            <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: label.color }" />

            {{ label.name }}
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="modal-cancel" @click="emit('cancel')">Cancel</button>

        <button class="modal-primary" @click="add">Save</button>
      </div>
    </div>
  </div>
</template>
