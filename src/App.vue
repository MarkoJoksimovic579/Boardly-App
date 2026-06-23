<script setup lang="ts">
import { RouterView } from 'vue-router'
import MessageToast from './components/MessageToast.vue'
import ConfirmComp from './components/ConfirmComp.vue'

import { onMounted, onUnmounted } from 'vue'
import { useSessionStore } from '@/stores/usersSessionStore'
import { connectSocket, disconnectSocket } from '@/services/notificationsSocket.ts'

const session = useSessionStore()

onMounted(() => {
  if (!session.sid) return
  connectSocket(session.sid)
})

onUnmounted(() => {
  disconnectSocket()
})
</script>

<template>
  <RouterView />
  <MessageToast />
  <ConfirmComp />
</template>
