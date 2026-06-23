<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'

import type { Task } from '@/features/tasks/data/tasksTypes'
import { useSessionStore } from '@/stores/usersSessionStore'
import dayjs from 'dayjs'
import CommentsList from '@/features/comments/components/CommentsList.vue'
import { useCommentsStore } from '@/features/comments/stores/commentsStore'
import { useTasksStore } from '../stores/tasksStore'

const route = useRoute()
const commentStore = useCommentsStore()
const taskId = Number(route.params.id)
const session = useSessionStore()
const taskStore = useTasksStore()
dayjs.locale('sr')

const task = ref<Task>()

const formattedDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return dayjs(dateStr).format('D. MMMM YYYY.')
}

const isDueOverdue = computed(() => {
  if (!task.value?.due_date) return false

  return dayjs(task.value.due_date).isBefore(dayjs())
})

console.log('task:', task.value)
onMounted(async () => {
  task.value = await taskStore.fetchTaskById(taskId)
  commentStore.fetchComments(taskId, session.sid!)
})
</script>

<template>
  <div class="p-8 max-w-5xl flex flex-col gap-5">
    <h1 class="text-2xl font-semibold text-text-title mb-4">
      {{ task?.title }}
    </h1>

    <!-- LABELS -->
    <div v-if="task?.labels?.length" class="flex gap-2 flex-wrap mb-6">
      <span
        v-for="label in task.labels"
        :key="label.name"
        class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border border-border-default"
        :style="{ backgroundColor: label.color + '22', color: label.color }"
      >
        <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: label.color }"></span>
        {{ label.name }}
      </span>
    </div>

    <!-- CONTENT GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- OPIS -->
      <div class="bg-bg-card border border-border-default rounded-2xl p-5">
        <p class="text-text-muted text-[11px] uppercase tracking-widest font-medium mb-2">
          Description
        </p>

        <p class="text-text-body text-sm leading-relaxed">
          {{ task?.description || 'No description' }}
        </p>
      </div>

      <!-- DETALJI -->
      <div class="bg-bg-card border border-border-default rounded-2xl p-5">
        <p class="text-text-muted text-[11px] uppercase tracking-widest font-medium mb-3">
          Details
        </p>

        <div class="space-y-3">
          <div class="flex justify-between text-sm border-b border-border-divider pb-3">
            <span class="text-text-subtle">Created by</span>

            <span class="text-text-title">
              {{ task?.created_by.username }}
            </span>
          </div>

          <div class="flex justify-between text-sm border-b border-border-divider pb-3">
            <span class="text-text-subtle">Created at</span>

            <span class="text-text-title">
              {{ formattedDate(task?.created_at) }}
            </span>
          </div>

          <div
            v-if="task?.updated_at"
            class="flex justify-between text-sm border-b border-border-divider pb-3"
          >
            <span class="text-text-subtle">Updated</span>

            <span class="text-text-title">
              {{ formattedDate(task?.updated_at) }}
            </span>
          </div>

          <div
            v-if="task?.due_date"
            class="flex justify-between text-sm border-b border-border-divider pb-3"
          >
            <span class="text-text-subtle">Deadline</span>

            <span :class="isDueOverdue ? 'text-text-danger font-medium' : 'text-text-title'">
              {{ formattedDate(task?.due_date) }}

              <span v-if="isDueOverdue" class="text-xs ml-1 text-text-danger"> (Expired) </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <CommentsList />
  </div>
</template>
