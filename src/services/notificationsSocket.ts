// notificationSocket.ts

import { useBoardStore } from '@/features/boards/stores/boardsStore'
import { useNotificationsStore } from '@/features/notifications/stores/notificationsStore'

let socket: WebSocket | null = null

export function connectSocket(sid: string) {
  if (socket) return

  socket = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}/ws/notifications?sid=${sid}`)

  socket.onopen = () => console.log('WS OPEN')

  socket.onmessage = async (e) => {
    const data = JSON.parse(e.data)
    const notificationsStore = useNotificationsStore()
    const boardStore = useBoardStore()

    if (data.type === 'notification:new') {
      await notificationsStore.fetchNotifications()
      await boardStore.fetchBoards()
    }
  }

  socket.onerror = (e) => console.error('WS ERROR', e)

  socket.onclose = () => {
    console.log('WS CLOSE')
    socket = null
  }
}

export function disconnectSocket() {
  socket?.close()
  socket = null
}
