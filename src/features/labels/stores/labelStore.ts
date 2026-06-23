import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type Label } from '@/features/tasks/data/tasksTypes'
import { useSessionStore } from '@/stores/usersSessionStore'
import api from '@/api'
import { ensureSuccess } from '@/services/functions/ensureSuccess'

export const useLabelStore = defineStore('labels', () => {
  const session = useSessionStore()

  const labelsList = ref<Label[]>([])
  const nameSearch = ref('')
  const loading = ref(false)

  async function fetchLabels(brd_id: number) {
    if (!session.sid) throw new Error('No session')
    if (!brd_id) throw new Error('No board id')

    loading.value = true
    try {
      const res = await api.getLabels(brd_id)
      ensureSuccess(res)
      labelsList.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  async function addLabels(brd_id: number, newLabel: { name: string; color: string }) {
    if (!session.sid) return

    const res = await api.postLabels(brd_id, newLabel.name, newLabel.color)
    ensureSuccess(res)

    await fetchLabels(brd_id)
  }

  async function editLabels(brd_id: number, newLabel: Label) {
    if (!session.sid) return

    const res = await api.putLabels(brd_id, newLabel.id, newLabel.name, newLabel.color)
    ensureSuccess(res)

    await fetchLabels(brd_id)
  }

  async function eraseLabels(brd_id: number, id: number) {
    if (!session.sid) return

    const res = await api.deleteLabels(brd_id, id)
    ensureSuccess(res)

    await fetchLabels(brd_id)
  }

  const filteredLabels = computed(() => {
    const search = nameSearch.value.toLowerCase().trim()

    if (!search) return labelsList.value

    return labelsList.value.filter((label) => label.name.toLowerCase().trim().includes(search))
  })

  return {
    fetchLabels,
    filteredLabels,
    labelsList,
    nameSearch,
    loading,
    addLabels,
    eraseLabels,
    editLabels,
  }
})
