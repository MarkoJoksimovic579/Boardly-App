import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type Label } from '@/features/tasks/data/tasksTypes'
import { useSessionStore } from '@/stores/usersSessionStore'
import api from '@/api'

export const useLabelStore = defineStore('labels', () => {
  const session = useSessionStore()

  const labelsList = ref<Label[]>([])

  async function fetchLabels() {
    if (!session.sid) return
    try {
      const res = await api.getLabels(session.sid)
      labelsList.value = res.data.data
    } catch (err) {
      console.log(err)
    }
  }
  async function addLabels(newLabel: { name: string; color: string }) {
    try {
      if (!session.sid) return
      const res = await api.postLabels(newLabel.name, newLabel.color, session.sid)

      if (res.data.success) {
        fetchLabels()
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function editLabels(newLabel: Label) {
    try {
      if (!session.sid) return
      const res = await api.putLabels(newLabel.id, newLabel.name, newLabel.color, session.sid)

      if (res.data.success) {
        fetchLabels()
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function eraseLabels(id: number) {
    if (!session.sid) return
    try {
      const res = await api.deleteLabels(id, session.sid)
      if (res.data.success) {
        fetchLabels()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const nameSearch = ref('')
  const filteredLabels = computed(() => {
    let result = labelsList.value
    if (nameSearch.value !== '') {
      result = result.filter((label) =>
        label.name.toLocaleLowerCase().trim().includes(nameSearch.value.toLocaleLowerCase().trim()),
      )
    }

    return result
  })

  return { fetchLabels, filteredLabels, labelsList, nameSearch, addLabels, eraseLabels, editLabels }
})
