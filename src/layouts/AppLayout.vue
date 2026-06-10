<script setup lang="ts">
import HeaderComp from '@/components/HeaderComp.vue'
import SideBarComp from '@/components/SideBarComp.vue'
</script>

<!-- layouts/AppLayout.vue -->
<template>
  <div class="h-screen flex bg-bg-page overflow-hidden scrollbar-custom">
    <SideBarComp />
    <div class="flex-1 flex flex-col min-w-0">
      <HeaderComp />
      <main class="flex-1 overflow-y-auto scrollbar-custom pt-0 md:pt-0">
        <RouterView />
      </main>
    </div>
  </div>
</template>
