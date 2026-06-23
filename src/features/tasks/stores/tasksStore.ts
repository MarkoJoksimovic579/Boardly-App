import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type {
  DragTaskPayload,
  Task,
  TaskDeletePayload,
  TaskEditPayload,
  TaskPayload,
} from '../data/tasksTypes'

import { useSessionStore } from '@/stores/usersSessionStore'
import { ensureSuccess } from '@/services/functions/ensureSuccess'

import api from '@/api'

export const useTasksStore = defineStore('tasks', () => {
  const session = useSessionStore()

  const tasks = ref<Task[]>([])
  const titleSearch = ref('')

  const filteredTasks = computed(() => {
    let result = tasks.value

    if (titleSearch.value !== '') {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(titleSearch.value.toLowerCase()),
      )
    }

    return result
  })

  async function fetchTasks() {
    if (!session.sid) throw new Error('No session')

    const res = await api.getTasks(session.sid)

    ensureSuccess(res)

    tasks.value = res.data.data
  }

  async function fetchTaskById(id: number) {
    if (!session.sid) throw new Error('No session')

    const res = await api.getTaskById(id, session.sid)

    ensureSuccess(res)

    return res.data.data as Task
  }

  async function postTask(task: TaskPayload) {
    if (!session.sid) throw new Error('No session')

    const res = await api.postTasks(task, session.sid)

    ensureSuccess(res)

    return res.data.data
  }

  async function eraseTask(payload: TaskDeletePayload) {
    if (!session.sid) throw new Error('No session')

    const res = await api.deleteTasks(payload.tsk_id, payload.brd_id, session.sid)

    ensureSuccess(res)

    return res.data.data
  }

  async function putTask(payload: TaskEditPayload) {
    if (!session.sid) throw new Error('No session')

    const res = await api.editTasks(payload, session.sid)

    ensureSuccess(res)

    return res.data.data
  }

  async function moveTask(payload: DragTaskPayload[]) {
    if (!session.sid) throw new Error('No session')

    const res = await api.reorderTasks(payload, session.sid)

    ensureSuccess(res)

    return res.data.data
  }

  return {
    tasks,
    titleSearch,
    filteredTasks,

    fetchTasks,
    fetchTaskById,
    postTask,
    eraseTask,
    putTask,
    moveTask,
  }
})
