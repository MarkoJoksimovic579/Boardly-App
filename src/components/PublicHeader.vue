<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a]">
    <!-- PUBLIC HEADER -->
    <header
      class="h-[68px] border-b border-white/[0.06] flex items-center justify-between px-8 xl:px-16"
    >
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 no-underline">
        <div
          class="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a5b4fc"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <span class="text-white/85 text-sm font-semibold tracking-tight">Boardly</span>
      </RouterLink>

      <!-- Nav links + CTA -->
      <div class="flex items-center gap-2">
        <RouterLink
          to="/login"
          class="h-9 px-4 rounded-xl text-sm text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all no-underline flex items-center"
        >
          Sign in
        </RouterLink>

        <RouterLink
          to="/register"
          class="h-9 px-4 rounded-xl text-sm font-medium text-white no-underline flex items-center transition-all hover:opacity-90"
          style="background: linear-gradient(135deg, #6366f1, #8b5cf6)"
        >
          Get started
        </RouterLink>
      </div>
    </header>

    <RouterView />
  </div>
</template>
