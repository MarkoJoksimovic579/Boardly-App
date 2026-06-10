<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Task, TaskEditPayload, Label } from '../data/tasksTypes'
import api from '@/api'
import { useSessionStore } from '@/stores/usersSessionStore'
import dayjs from 'dayjs'

const session = useSessionStore()

const dbLabels = ref<Label[]>([])

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'save', task: TaskEditPayload): void
  (e: 'cancel'): void
}>()

const localTask = ref<TaskEditPayload>({
  id: 0,
  title: '',
  description: '',
  due_date: '',
  brd_id: 0,
  list_id: 0,
  labels: [],
})

watch(
  () => props.task,
  (t) => {
    if (!t) return

    localTask.value = {
      id: t.id,
      title: t.title,
      description: t.description ?? '',

      due_date: t.due_date ? dayjs(t.due_date).format('YYYY-MM-DD') : '',

      brd_id: t.brd_id,
      list_id: t.list_id,

      labels: (t.labels || []).map((l) => l.id).filter((id) => id != null),
    }
  },
  { immediate: true },
)

async function fetchLabels() {
  if (!session.sid) return

  try {
    const res = await api.getLabels(session.sid)
    dbLabels.value = res.data.data
  } catch (err) {
    console.log(err)
  }
}

function save() {
  emit('save', { ...localTask.value })
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
        <h2 class="modal-title text-center">Edit Task</h2>
        <p class="modal-subtitle">Update task information</p>
      </div>

      <!-- Title -->
      <div class="modal-field">
        <label class="modal-label">Task title</label>

        <input v-model="localTask.title" class="modal-input" placeholder="Enter task title" />
      </div>

      <!-- Description -->
      <div class="modal-field">
        <label class="modal-label">Description</label>

        <textarea
          v-model="localTask.description"
          rows="4"
          class="modal-textarea resize-none"
          placeholder="Enter task description"
        />
      </div>

      <!-- Due Date -->
      <div class="modal-field">
        <label class="modal-label">Due date</label>

        <input v-model="localTask.due_date" type="date" class="modal-input [color-scheme:dark]" />
      </div>

      <!-- Labels -->
      <div v-if="dbLabels.length" class="modal-field">
        <label class="modal-title">Labels</label>

        <div class="flex flex-wrap gap-2 mt-2">
          <label
            v-for="label in dbLabels"
            :key="label.id"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition"
            :style="{
              borderColor: label.color,
              color: label.color,
              opacity: localTask.labels.includes(label.id) ? 1 : 0.35,
            }"
          >
            <input v-model="localTask.labels" type="checkbox" :value="label.id" class="hidden" />

            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: label.color }" />

            {{ label.name }}
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button @click="emit('cancel')" class="modal-cancel">Cancel</button>

        <button @click="save" class="modal-primary">Save</button>
      </div>
    </div>
  </div>
</template>
