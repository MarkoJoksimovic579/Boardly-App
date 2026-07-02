<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type Label } from '../../tasks/data/tasksTypes.ts'
import { useSessionStore } from '@/stores/usersSessionStore'

import { useLabelStore } from '../stores/labelStore.ts'

import { useAsyncAction } from '@/services/functions/useAsyncAction.ts'
import { useConfirmStore } from '@/stores/confirmStore.ts'
import { useRoute } from 'vue-router'
import LabelAddComp from './LabelAddComp.vue'
import LabelEditComp from './LabelEditComp.vue'
import LabelList from './LabelList.vue'
import { useBoardStore } from '@/features/boards/stores/boardsStore.ts'

const route = useRoute()
const brdId = Number(route.params.brd_id)

const session = useSessionStore()
const labelStore = useLabelStore()
const confirmStore = useConfirmStore()
const boardStore = useBoardStore()
const showAddLabel = ref(false)
const showEditLabel = ref(false)
const loading = ref(true)
const updatedLabel = ref<Label | null>(null)

const { loading: isLabelLoading, run } = useAsyncAction()

function handleEdit(label: Label) {
  updatedLabel.value = { ...label }
  showEditLabel.value = true
}

async function handleDelete(id: number) {
  const confirmed = await confirmStore.ask({
    title: 'Delete label',
    message: 'Are you sure you want to delete this label?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  })

  if (!confirmed) return

  await run(
    async () => {
      await labelStore.eraseLabels(brdId, id)
      await labelStore.fetchLabels(brdId)
    },
    {
      success: 'Label deleted successfully',
      error: 'Failed to delete label',
    },
  )
}

async function saveEdit(updated: Label) {
  await run(
    async () => {
      await labelStore.editLabels(brdId, updated)
      await labelStore.fetchLabels(brdId)

      showEditLabel.value = false
    },
    {
      success: 'Label updated successfully',
      error: 'Failed to update label',
    },
  )
}

async function handleAddLabel(label: { name: string; color: string }) {
  await run(
    async () => {
      await labelStore.addLabels(brdId, label)
      await labelStore.fetchLabels(brdId)

      showAddLabel.value = false
    },
    {
      success: 'Label created successfully',
      error: 'Failed to create label',
    },
  )
}

const selectedBoard = computed(() => boardStore.boardsList.find((board) => board.id === brdId))

onMounted(async () => {
  try {
    if (!boardStore.boardsList.length) {
      await boardStore.fetchBoards()
    }

    console.log('boardsList:', boardStore.boardsList)
    console.log('brdId:', brdId)
    console.log('selectedBoard:', selectedBoard.value)

    await labelStore.fetchLabels(brdId)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div
    v-if="session.isAdmin || session.isOwner || selectedBoard?.can_edit"
    class="min-h-screen p-8 space-y-8"
  >
    <!-- HEADER -->
    <div class="flex items-start justify-between">
      <div>
        <p class="text-[11px] uppercase tracking-[0.25em] text-text-muted mb-2 font-medium">
          Admin Panel
        </p>
        <h1 class="text-3xl font-semibold text-text-title tracking-tight">Labels</h1>
        <p class="text-text-body text-sm mt-1.5">Manage labels used across boards and tasks</p>
      </div>

      <button
        @click="showAddLabel = true"
        class="flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium text-text-white btn-primary transition-all duration-200 hover:brightness-110 active:scale-95"
        style="box-shadow: 0 0 20px rgba(99, 102, 241, 0.3)"
      >
        <span class="text-lg leading-none">+</span>
        New Label
      </button>
    </div>

    <!-- SEARCH + STATS ROW -->
    <div class="flex items-center gap-3">
      <!-- SEARCH -->
      <div class="relative flex-1 max-w-sm">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-model="labelStore.nameSearch"
          type="text"
          placeholder="Search labels..."
          class="app-input pl-9 pr-9"
        />
        <button
          v-if="labelStore.nameSearch"
          @click="labelStore.nameSearch = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-subtle transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      <!-- TOTAL BADGE -->
      <div
        class="rounded-xl border border-border-divider bg-bg-subtle px-4 h-10 flex items-center gap-2.5 shrink-0"
      >
        <span class="text-text-muted text-[10px] uppercase tracking-[0.2em] font-medium"
          >Total</span
        >
        <span class="text-text-title font-semibold tabular-nums">{{
          labelStore.labelsList.length
        }}</span>
      </div>
    </div>

    <!-- LOADING SKELETONS -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="rounded-2xl border border-border-divider bg-bg-subtle overflow-hidden animate-pulse"
      >
        <div class="h-1.5 w-full bg-bg-subtle"></div>
        <div class="p-4 space-y-3">
          <div class="h-4 w-2/3 rounded-lg bg-bg-subtle"></div>
          <div class="h-3 w-1/3 rounded-lg bg-bg-subtle"></div>
        </div>
      </div>
    </div>

    <!-- LABELS LIST -->
    <template v-else>
      <LabelList v-if="labelStore.labelsList.length" @delete="handleDelete" @edit="handleEdit" />

      <!-- NO SEARCH RESULTS -->
      <div
        v-else-if="labelStore.nameSearch"
        class="rounded-2xl border border-dashed border-border-hover bg-bg-subtle p-12 text-center space-y-2"
      >
        <p class="text-text-subtle font-medium">No results for "{{ labelStore.nameSearch }}"</p>
        <p class="text-text-muted text-sm">Try a different search term</p>
        <button
          @click="labelStore.nameSearch = ''"
          class="mt-2 text-xs text-text-accent hover:brightness-110 transition-colors"
        >
          Clear search
        </button>
      </div>

      <!-- TRULY EMPTY -->
      <div
        v-else
        class="rounded-2xl border border-dashed border-border-hover bg-bg-subtle p-16 text-center space-y-3"
      >
        <div
          class="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center mx-auto text-2xl"
        >
          🏷️
        </div>
        <p class="text-text-subtle font-medium">No labels yet</p>
        <p class="text-text-muted text-sm">Create your first label to organize tasks and boards</p>
        <button
          @click="showAddLabel = true"
          class="btn-primary mt-1 h-9 px-5 rounded-xl text-sm font-medium text-text-white transition-all hover:brightness-110"
        >
          + Create Label
        </button>
      </div>
    </template>

    <!-- MODALS -->
    <LabelAddComp
      v-if="showAddLabel"
      :loading="isLabelLoading"
      @save="handleAddLabel"
      @cancel="showAddLabel = false"
    />
    <LabelEditComp
      v-if="showEditLabel && updatedLabel"
      :label="updatedLabel"
      :loading="isLabelLoading"
      @save="saveEdit"
      @cancel="showEditLabel = false"
    />
  </div>
</template>
