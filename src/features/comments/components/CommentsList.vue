<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CommentsComp from './CommentsComp.vue'
import { useCommentsStore } from '../stores/commentsStore'
import { useRoute } from 'vue-router'
import { useSessionStore } from '@/stores/usersSessionStore.ts'
import { useMessageStore } from '@/stores/messageStore'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useConfirmStore } from '@/stores/confirmStore.ts'
import { useAsyncAction } from '@/services/functions/useAsyncAction.ts'

const session = useSessionStore()
const store = useCommentsStore()

const { loading: isCommentLoading, run } = useAsyncAction()
const confirmStore = useConfirmStore()

const route = useRoute()

const taskId = Number(route.params.id)

const messageStore = useMessageStore()

const newComment = ref('')

async function handlePost() {
  if (!newComment.value.trim() || !session.sid) return

  try {
    isCommentLoading.value = true

    const payload = {
      tsk_id: taskId,
      com_text: newComment.value.trim(),
    }

    await store.postComment(payload, session.sid)

    newComment.value = ''

    await store.fetchComments(taskId, session.sid)

    messageStore.success('Comment added successfully')
  } catch (err) {
    console.log(err)

    messageStore.fail('Failed to add comment')
  } finally {
    isCommentLoading.value = false
  }
}

async function handleDelete(id: number) {
  const confirmed = await confirmStore.ask({
    title: 'Delete comment',
    message: 'Are you sure you want to delete this comment?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  })

  if (!confirmed) return

  await run(
    async () => {
      await store.eraseComment(id, session.sid!)
      await store.fetchComments(taskId, session.sid!)
    },
    {
      success: 'Comment deleted successfully',
      error: 'Failed to delete comment',
    },
  )
}
const currentPage = ref(1)
const commentsPerPage = 7

const totalPages = computed(() => {
  return Math.ceil(store.filteredComments.length / commentsPerPage)
})

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * commentsPerPage
  const end = start + commentsPerPage
  return store.filteredComments.slice(start, end)
})

watch(
  () => store.searchText, // gleda direktno u store
  () => {
    currentPage.value = 1
  },
)
watch(
  () => totalPages.value,
  (newTotal) => {
    if (currentPage.value > newTotal) {
      currentPage.value = Math.max(1, newTotal) // ne da page 3 of2 , nego te vraca na 2of2
    }
  },
)
</script>

<template>
  <div class="bg-bg-card border border-border-default rounded-2xl p-5">
    <!-- Header + Search -->
    <div class="flex items-center justify-between gap-3 mb-4 flex-wrap">
      <p class="text-text-muted text-[11px] uppercase tracking-widest font-medium">
        Comments · {{ store.commentsList.length }}
      </p>

      <!-- Search -->
      <div class="relative">
        <svg
          class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          v-model="store.searchText"
          type="text"
          placeholder="Search comments..."
          class="app-input pl-8 w-52 h-auto py-1.5 text-sm"
        />
      </div>
    </div>

    <!-- Lista -->
    <CommentsComp v-for="c in paginatedComments" :key="c.id" :comment="c" @delete="handleDelete" />

    <p v-if="!store.commentsList.length" class="text-text-muted text-sm py-3">No comments.</p>

    <p v-else-if="!store.filteredComments.length" class="text-text-muted text-sm py-3">
      No results for"{{ store.searchText }}".
    </p>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-end gap-2 pt-3 border-t border-border-divider mt-3"
    >
      <button
        class="w-7 h-7 flex items-center justify-center rounded-lg border border-border-default text-text-subtle hover:text-text-title hover:border-border-hover transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <span class="text-text-accent text-xs tabular-nums">
        {{ currentPage }} / {{ totalPages }}
      </span>

      <button
        class="w-7 h-7 flex items-center justify-center rounded-lg border border-border-default text-text-subtle hover:text-text-title hover:border-border-hover transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Add comment -->
    <div class="flex gap-2 items-end pt-4 border-t border-border-divider mt-2">
      <textarea
        v-model="newComment"
        rows="1"
        placeholder="Write comment..."
        class="flex-1 px-3 py-2 rounded-xl bg-bg-input border border-border-default text-text-title placeholder:text-text-muted resize-none outline-none transition focus:border-border-accent"
        @keydown.enter.exact.prevent="handlePost"
      />

      <BaseButton
        variant="primary"
        :loading="isCommentLoading"
        :disabled="!newComment.trim()"
        @click="handlePost"
      >
        Send
      </BaseButton>
    </div>
  </div>
</template>
