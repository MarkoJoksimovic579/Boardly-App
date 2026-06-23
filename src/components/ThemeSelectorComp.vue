<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const currentTheme = ref(localStorage.getItem('theme') || 'dark')

function setTheme(theme: string) {
  currentTheme.value = theme

  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
    <div class="w-full max-w-md rounded-2xl bg-bg-modal border border-border-modal p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-semibold text-text-title">Choose Theme</h2>
        <button @click="emit('close')" class="text-text-muted hover:text-text-title transition">
          ✕
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <button
          @click="setTheme('dark')"
          class="p-4 rounded-xl border bg-black transition text-left text-white text-sm font-medium"
          :class="
            currentTheme === 'dark'
              ? 'border-indigo-500 ring-2 ring-indigo-500/30'
              : 'border-border-default'
          "
        >
          🌙 Dark
        </button>

        <button
          @click="setTheme('light')"
          class="p-4 rounded-xl border bg-white text-black transition text-left text-sm font-medium"
          :class="
            currentTheme === 'light'
              ? 'border-indigo-500 ring-2 ring-indigo-500/30'
              : 'border-border-default'
          "
        >
          ☀️ Light
        </button>

        <button
          @click="setTheme('coffee')"
          class="p-4 rounded-xl border bg-[#3a2a23] text-[#f5e6d3] transition text-left text-sm font-medium"
          :class="
            currentTheme === 'coffee'
              ? 'border-amber-600 ring-2 ring-amber-600/30'
              : 'border-border-default'
          "
        >
          ☕ Coffee
        </button>

        <button
          @click="setTheme('blue')"
          class="p-4 rounded-xl border bg-[#07111f] text-[#e0f2fe] transition text-left text-sm font-medium"
          :class="
            currentTheme === 'blue'
              ? 'border-blue-500 ring-2 ring-blue-500/30'
              : 'border-border-default'
          "
        >
          🌊 Blue
        </button>

        <button
          @click="setTheme('midnight-rose')"
          class="p-4 rounded-xl border bg-[#0f0810] text-[#fce7f3] transition text-left text-sm font-medium"
          :class="
            currentTheme === 'midnight-rose'
              ? 'border-pink-500 ring-2 ring-pink-500/30'
              : 'border-border-default'
          "
        >
          🌸 Midnight Rose
        </button>

        <button
          @click="setTheme('obsidian')"
          class="p-4 rounded-xl border bg-[#0a0a0a] text-[#fef3c7] transition text-left text-sm font-medium"
          :class="
            currentTheme === 'obsidian'
              ? 'border-amber-500 ring-2 ring-amber-500/30'
              : 'border-border-default'
          "
        >
          ✦ Obsidian
        </button>
        <button
          @click="setTheme('matrix')"
          class="p-4 rounded-xl border bg-[#000000] text-[#00ff88] transition text-left text-sm font-medium"
          :class="
            currentTheme === 'matrix'
              ? 'border-[#00ff88] ring-2 ring-[#00ff88]/30'
              : 'border-border-default'
          "
        >
          ⌨️ Matrix
        </button>
      </div>
    </div>
  </div>
</template>
