<template>
  <div class="p-8 max-w-5xl mx-auto text-text-body">
    <h1 class="text-3xl font-bold text-text-title mb-2">About Boardly</h1>
    <p class="text-text-muted mb-8">Trello-inspired project management application.</p>

    <section class="bg-bg-card border border-border-default rounded-2xl p-6 mb-6">
      <h2 class="text-xl font-semibold text-text-title mb-3">What is Boardly?</h2>
      <p>
        Boardly is a full-stack project management app for organizing boards, lists, tasks,
        comments, labels and team members.
      </p>
    </section>

    <section class="bg-bg-card border border-border-default rounded-2xl p-6 mb-6">
      <h2 class="text-xl font-semibold text-text-title mb-3">Features</h2>

      <ul class="list-disc list-inside space-y-1">
        <li>Authentication and session handling</li>
        <li>Boards, lists and tasks management</li>
        <li>Drag and drop task organization</li>
        <li>Labels and comments</li>
        <li>Favorites and dashboard overview</li>
        <li>Role-based permissions</li>
        <li>Realtime notifications with WebSockets</li>
        <li>Theme customization</li>
      </ul>
    </section>

    <section class="bg-bg-card border border-border-default rounded-2xl p-6">
      <h2 class="text-xl font-semibold text-text-title mb-3">Tech Stack</h2>

      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 rounded-full bg-bg-subtle border border-border-default">Vue 3</span>
        <span class="px-3 py-1 rounded-full bg-bg-subtle border border-border-default">Pinia</span>
        <span class="px-3 py-1 rounded-full bg-bg-subtle border border-border-default"
          >Vue Router</span
        >
        <span class="px-3 py-1 rounded-full bg-bg-subtle border border-border-default"
          >Tailwind CSS</span
        >
        <span class="px-3 py-1 rounded-full bg-bg-subtle border border-border-default"
          >MARS Engine</span
        >
        <span class="px-3 py-1 rounded-full bg-bg-subtle border border-border-default"
          >WebSockets</span
        >
        <span class="px-3 py-1 rounded-full bg-bg-subtle border border-border-default"
          >MariaDB</span
        >
      </div>
    </section>
  </div>
</template>
