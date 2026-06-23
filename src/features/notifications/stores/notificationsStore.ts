import api from '@/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Notification } from '../data/notificationTypes'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)

  const unreadCount = computed(() => notifications.value.filter((n) => n.is_read === 0).length)

  async function fetchNotifications() {
    try {
      loading.value = true

      const res = await api.getNotifications()

      notifications.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  function markAsRead(id: number) {
    const notification = notifications.value.find((n) => n.id === id)

    if (notification) {
      notification.is_read = 1
    }
  }

  async function markAllAsRead() {
    await api.putNotificationsRead()

    notifications.value.forEach((n) => {
      n.is_read = 1
    })
  }

  async function clearAll() {
    await api.deleteNotifications()

    notifications.value = []
  }

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearAll,
  }
})
