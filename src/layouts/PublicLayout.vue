<script setup lang="ts">
import PublicHeader from '@/components/PublicHeader.vue'
</script>

<!-- layouts/PublicLayout.vue -->
<template>
  <div class="h-screen flex flex-col bg-[#0a0a0a]">
    <PublicHeader />

    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>
