import { ref } from 'vue'
import { useMessageStore } from '@/stores/messageStore'
import axios from 'axios'

export function useAsyncAction() {
  const loading = ref(false)
  const messageStore = useMessageStore()

  async function run(
    action: () => Promise<void>,
    options?: {
      success?: string
      error?: string
    },
  ) {
    try {
      loading.value = true

      await action()

      if (options?.success) {
        messageStore.success(options.success)
      }
    } catch (err) {
      let backendMessage = ''

      if (axios.isAxiosError(err)) {
        backendMessage =
          err.response?.data?.message || err.response?.data?.error || err.response?.data?.err || ''
      } else if (err instanceof Error) {
        backendMessage = err.message
      }

      const finalMessage = backendMessage || options?.error || 'Something went wrong'

      messageStore.fail(finalMessage)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    run,
  }
}
