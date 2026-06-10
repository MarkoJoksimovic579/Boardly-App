<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'

import type { Task } from '@/features/tasks/data/tasksTypes'
import { useSessionStore } from '@/stores/usersSessionStore'
import dayjs from 'dayjs'
import CommentsList from '@/features/comments/components/CommentsList.vue'
import { useCommentsStore } from '@/features/comments/stores/commentsStore'
import { useTasksStore } from '../store/tasksStore'

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
  <div class="p-8 text-white max-w-5xl flex flex-col gap-5">
    <h1 class="text-2xl font-semibold text-white/90 mb-4">
      {{ task?.title }}
    </h1>

    <!-- LABELS -->
    <div v-if="task?.labels?.length" class="flex gap-2 flex-wrap mb-6">
      <span
        v-for="label in task.labels"
        :key="label.name"
        class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border border-white/10"
        :style="{ backgroundColor: label.color + '22', color: label.color }"
      >
        <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: label.color }"></span>
        {{ label.name }}
      </span>
    </div>

    <!-- CONTENT GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- OPIS -->
      <div class="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <p class="text-white/30 text-[11px] uppercase tracking-widest font-medium mb-2">Opis</p>
        <p class="text-white/70 text-sm leading-relaxed">
          {{ task?.description || 'Nema opisa.' }}
        </p>
      </div>

      <!-- METAPODACI -->
      <div class="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <p class="text-white/30 text-[11px] uppercase tracking-widest font-medium mb-3">Detalji</p>

        <div class="space-y-3">
          <div class="flex justify-between text-sm border-b border-white/[0.05] pb-3">
            <span class="text-white/40">Kreirao</span>
            <span class="text-white/70">{{ task?.created_by.username }}</span>
          </div>

          <div class="flex justify-between text-sm border-b border-white/[0.05] pb-3">
            <span class="text-white/40">Kreirano</span>
            <span class="text-white/70">{{ formattedDate(task?.created_at) }}</span>
          </div>

          <div
            v-if="task?.updated_at"
            class="flex justify-between text-sm border-b border-white/[0.05] pb-3"
          >
            <span class="text-white/40">Izmenjeno</span>
            <span class="text-white/70">{{ formattedDate(task?.updated_at) }}</span>
          </div>

          <div
            v-if="task?.due_date"
            class="flex justify-between text-sm border-b border-white/[0.05] pb-3"
          >
            <span class="text-white/40">Rok</span>
            <span :class="isDueOverdue ? 'text-red-400 font-medium' : 'text-white/70'">
              {{ formattedDate(task?.due_date) }}
              <span v-if="isDueOverdue" class="text-xs ml-1">(isteklo)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <CommentsList></CommentsList>
  </div>
</template>
