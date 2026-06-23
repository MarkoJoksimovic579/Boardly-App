import { defineStore } from 'pinia'
import { ref } from 'vue'

type ConfirmOptions = {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
}

export const useConfirmStore = defineStore('confirm', () => {
  const isOpen = ref(false)
  const title = ref('')
  const message = ref('')
  const confirmText = ref('Confirm')
  const cancelText = ref('Cancel')
  const variant = ref<'danger' | 'primary'>('danger')

  let resolver: ((value: boolean) => void) | null = null

  function ask(options: ConfirmOptions) {
    title.value = options.title ?? 'Are you sure?'
    message.value = options.message
    confirmText.value = options.confirmText ?? 'Confirm'
    cancelText.value = options.cancelText ?? 'Cancel'
    variant.value = options.variant ?? 'danger'

    isOpen.value = true

    return new Promise<boolean>((resolve) => {
      resolver = resolve
    })
  }

  function confirm() {
    isOpen.value = false
    resolver?.(true)
    resolver = null
  }

  function cancel() {
    isOpen.value = false
    resolver?.(false)
    resolver = null
  }

  return {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    variant,
    ask,
    confirm,
    cancel,
  }
})
