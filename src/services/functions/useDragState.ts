import { ref } from 'vue'

const isDraggingTask = ref(false)

export function useDragState() {
  return { isDraggingTask }
}
