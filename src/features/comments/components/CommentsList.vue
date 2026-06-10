<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CommentsComp from './CommentsComp.vue'
import { useCommentsStore } from '../stores/commentsStore'
import { useRoute } from 'vue-router'
import { useSessionStore } from '@/stores/usersSessionStore.ts'

const session = useSessionStore()
const store = useCommentsStore()

const route = useRoute()

const taskId = Number(route.params.id)

const newComment = ref('')

async function handlePost() {
  if (!newComment.value.trim() || !session.sid) return
  const payload: import('../data/commentTypes.ts').CommentPayload = {
    tsk_id: taskId,
    com_text: newComment.value.trim(),
  }

  await store.postComment(payload, session.sid)
  newComment.value = ''
  store.fetchComments(taskId, session.sid)
}
function handleDelete(id: number) {
  store.eraseComment(id, session.sid!)
  alert('komentar obrisan')

  store.fetchComments(taskId, session.sid!)
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
  <div class="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
    <!-- Header + Search -->
    <div class="flex items-center justify-between gap-3 mb-4 flex-wrap">
      <p class="text-white/30 text-[11px] uppercase tracking-widest font-medium">
        Komentari · {{ store.commentsList.length }}
      </p>

      <!-- Search -->
      <div class="relative">
        <svg
          class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none"
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
          placeholder="Pretraži komentare..."
          class="bg-white/[0.05] border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-sm text-white/70 placeholder:text-white/20 w-52 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>
    </div>

    <!-- Lista -->
    <CommentsComp v-for="c in paginatedComments" :key="c.id" :comment="c" @delete="handleDelete" />

    <p v-if="!store.commentsList.length" class="text-white/30 text-sm py-3">Nema komentara.</p>
    <p v-else-if="!store.filteredComments.length" class="text-white/30 text-sm py-3">
      Nema rezultata za "{{ store.searchText }}".
    </p>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.05] mt-3"
    >
      <button
        class="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/20 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
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

      <span class="text-red-400 text-xs tabular-nums"> {{ currentPage }} / {{ totalPages }} </span>

      <button
        class="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/20 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
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
    <div class="flex gap-2 items-end pt-4 border-t border-white/[0.05] mt-2">
      <textarea
        v-model="newComment"
        rows="1"
        placeholder="Napiši komentar..."
        class="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white/70 placeholder:text-white/20 resize-none focus:outline-none focus:border-white/20"
        @keydown.enter.exact.prevent="handlePost"
      />
      <button
        class="flex items-center gap-1.5 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!newComment.trim()"
        @click="handlePost"
      >
        Pošalji
      </button>
    </div>
  </div>
</template>
