<script setup lang="ts">
const emit = defineEmits<{
  (e: 'theme'): void
  (e: 'pushAccount'): void
}>()
</script>

<template>
  <div class="mt-0.5 space-y-0.5 pl-2">
    <button
      @click="emit('theme')"
      class="w-full cursor-pointer flex items-center gap-3 px-3 h-10 rounded-xl hover:bg-bg-nav-hover transition-colors text-left text-text-nav-inactive"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 0 20" />
        <path d="M12 2v20M2 12h20" opacity="0.3" />
      </svg>
      <span class="text-sm">Change theme</span>
    </button>

    <button
      class="w-full cursor-pointer flex items-center gap-3 px-3 h-10 rounded-xl hover:bg-bg-nav-hover transition-colors text-left text-text-nav-inactive"
      @click="emit('pushAccount')"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span class="text-sm">Account</span>
    </button>

    <button
      class="w-full cursor-pointer flex items-center gap-3 px-3 h-10 rounded-xl hover:bg-bg-nav-hover transition-colors text-left text-text-nav-inactive"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span class="text-sm">About</span>
    </button>
  </div>
</template>
