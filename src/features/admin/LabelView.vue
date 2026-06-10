<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type Label } from '../tasks/data/tasksTypes'
import { useSessionStore } from '@/stores/usersSessionStore'

import LabelList from '../labels/components/LabelList.vue'
import { useLabelStore } from '../labels/stores/labelStore.ts'
import LabelAddComp from '../labels/components/LabelAddComp.vue'
import LabelEditComp from '../labels/components/LabelEditComp.vue'

const session = useSessionStore()
const labelStore = useLabelStore()

const showAddLabel = ref(false)
const showEditLabel = ref(false)
const loading = ref(true)
const updatedLabel = ref<Label | null>(null)

function handleDelete(id: number) {
  labelStore.eraseLabels(id)
}

function handleEdit(label: Label) {
  showEditLabel.value = true
  updatedLabel.value = label
}

function saveEdit(updated: Label) {
  labelStore.editLabels(updated)
  showEditLabel.value = false
}

function handleAddLabel(label: { name: string; color: string }) {
  labelStore.addLabels(label)
  showAddLabel.value = false
}

onMounted(async () => {
  try {
    await labelStore.fetchLabels()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="session.isAdmin" class="min-h-screen p-8 space-y-8">
    <!-- HEADER -->
    <div class="flex items-start justify-between">
      <div>
        <p class="text-[11px] uppercase tracking-[0.25em] text-white/25 mb-2 font-medium">
          Admin Panel
        </p>
        <h1 class="text-3xl font-semibold text-white tracking-tight">Labels</h1>
        <p class="text-white/35 text-sm mt-1.5">Manage labels used across boards and tasks</p>
      </div>

      <button
        @click="showAddLabel = true"
        class="flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-95"
        style="
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        "
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
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none"
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
          class="w-full h-10 pl-9 pr-9 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all duration-200"
        />
        <button
          v-if="labelStore.nameSearch"
          @click="labelStore.nameSearch = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      <!-- TOTAL BADGE -->
      <div
        class="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 h-10 flex items-center gap-2.5 shrink-0"
      >
        <span class="text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium">Total</span>
        <span class="text-white font-semibold tabular-nums">{{
          labelStore.labelsList.length
        }}</span>
      </div>
    </div>

    <!-- LOADING SKELETONS -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden animate-pulse"
      >
        <div class="h-1.5 w-full bg-white/[0.06]"></div>
        <div class="p-4 space-y-3">
          <div class="h-4 w-2/3 rounded-lg bg-white/[0.06]"></div>
          <div class="h-3 w-1/3 rounded-lg bg-white/[0.04]"></div>
        </div>
      </div>
    </div>

    <!-- LABELS LIST -->
    <template v-else>
      <LabelList v-if="labelStore.labelsList.length" @delete="handleDelete" @edit="handleEdit" />

      <!-- NO SEARCH RESULTS -->
      <div
        v-else-if="labelStore.nameSearch"
        class="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center space-y-2"
      >
        <p class="text-white/40 font-medium">No results for "{{ labelStore.nameSearch }}"</p>
        <p class="text-white/20 text-sm">Try a different search term</p>
        <button
          @click="labelStore.nameSearch = ''"
          class="mt-2 text-xs text-indigo-400/70 hover:text-indigo-400 transition-colors"
        >
          Clear search
        </button>
      </div>

      <!-- TRULY EMPTY -->
      <div
        v-else
        class="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center space-y-3"
      >
        <div
          class="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto text-2xl"
        >
          🏷️
        </div>
        <p class="text-white/40 font-medium">No labels yet</p>
        <p class="text-white/20 text-sm">Create your first label to organize tasks and boards</p>
        <button
          @click="showAddLabel = true"
          class="mt-1 h-9 px-5 rounded-xl text-sm font-medium text-white transition-all hover:brightness-110"
          style="background: linear-gradient(135deg, #6366f1, #8b5cf6)"
        >
          + Create Label
        </button>
      </div>
    </template>

    <!-- MODALS -->
    <LabelAddComp v-if="showAddLabel" @save="handleAddLabel" @cancel="showAddLabel = false" />

    <LabelEditComp
      v-if="showEditLabel && updatedLabel"
      :label="updatedLabel"
      @save="saveEdit"
      @cancel="showEditLabel = false"
    />
  </div>
</template>
