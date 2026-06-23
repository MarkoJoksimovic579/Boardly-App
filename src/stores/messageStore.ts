import { defineStore } from 'pinia'
import { ref } from 'vue'

type MessageType = 'success' | 'fail'

export const useMessageStore = defineStore('messageStore', () => {
  const text = ref('')
  const type = ref<MessageType | null>(null)
  const visible = ref(false)

  let timeout: ReturnType<typeof setTimeout> | null = null

  function show(message: string, messageType: MessageType) {
    text.value = message
    type.value = messageType
    visible.value = true

    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      clear()
    }, 2000)
  }

  function success(message: string) {
    show(message, 'success')
  }

  function fail(message: string) {
    show(message, 'fail')
  }

  function clear() {
    text.value = ''
    type.value = null
    visible.value = false
  }

  return {
    text,
    type,
    visible,
    success,
    fail,
    clear,
  }
})
