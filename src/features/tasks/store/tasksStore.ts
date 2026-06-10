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
import api from '@/api'

export const useTasksStore = defineStore('tasks', () => {
  /**
   * =========================
   * STATE
   * =========================
   */
  const session = useSessionStore()
  const tasks = ref<Task[]>([])
  const titleSearch = ref('')

  const filteredTasks = computed(() => {
    let result = tasks.value
    if (titleSearch.value !== '') {
      result = result.filter((task) =>
        task.title.toLocaleLowerCase().includes(titleSearch.value.toLocaleLowerCase()),
      )
    }

    return result
  })

  async function fetchTasks() {
    try {
      if (!session.sid) return
      const res = await api.getTasks(session.sid)
      const data = res.data.data

      if (data) {
        tasks.value = data
        console.log('answer:', 'tasks fetched')
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function fetchTaskById(id: number) {
    try {
      if (!session.sid) return
      const res = await api.getTaskById(id, session.sid)
      return res.data.data as Task
    } catch (err) {
      console.log(err)
    }
  }

  async function postTask(task: TaskPayload) {
    try {
      if (!session.sid) return
      const res = await api.postTasks(task, session.sid)
      if (res) console.log('msg:', 'success')
    } catch (err) {
      console.log(err)
    }
  }

  async function eraseTask(payload: TaskDeletePayload) {
    try {
      if (!session.sid) return
      const tsk_id = payload.tsk_id
      const brd_id = payload.brd_id

      const res = await api.deleteTasks(tsk_id, brd_id, session.sid)
      if (res) console.log('msg:', 'success')
    } catch (err) {
      console.log(err)
    }
  }

  async function putTask(payload: TaskEditPayload) {
    try {
      if (!session.sid) return

      const res = await api.editTasks(payload, session.sid)
      if (res) console.log('msg:', 'success')
    } catch (err) {
      console.log(err)
    }
  }

  async function moveTask(payload: DragTaskPayload[]) {
    try {
      if (!session.sid) return

      const res = await api.reorderTasks(payload, session.sid)
      if (res) console.log('msg:', 'success')
    } catch (err) {
      console.log(err)
    }
  }

  return {
    // state
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
