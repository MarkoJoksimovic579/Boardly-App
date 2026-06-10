<script setup lang="ts"></script>

<template>
  <div class="min-h-screen flex flex-col font-[system-ui] bg-[#0a0a0a] overflow-x-hidden">
    <!-- Grid texture -->
    <div
      class="fixed inset-0 opacity-[0.04] pointer-events-none"
      style="
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
        background-size: 40px 40px;
      "
    ></div>

    <!-- Glow blobs -->
    <div
      class="fixed top-30 -left-30 w-175 h-175 rounded-full opacity-[0.15] pointer-events-none"
      style="background: radial-gradient(circle, #6366f1 0%, transparent 70%)"
    ></div>

    <div
      class="fixed -bottom-20 -right-20 w-150 h-150 rounded-full opacity-[0.08] pointer-events-none"
      style="background: radial-gradient(circle, #a78bfa 0%, transparent 70%)"
    ></div>

    <!-- NAVBAR -->

    <!-- HERO -->
    <section
      class="relative z-10 flex flex-col items-center justify-center text-center px-8 xl:px-16 pt-24 pb-20"
    >
      <!-- Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 mb-8"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>

        <span class="text-white/45 text-[11px] tracking-widest uppercase">
          Free to start · No credit card
        </span>
      </div>

      <!-- Heading -->
      <h1
        class="text-5xl md:text-7xl xl:text-8xl font-bold text-white leading-[1.02] tracking-tight max-w-6xl mb-8"
      >
        Your tasks,
        <br />

        <span
          class="text-transparent bg-clip-text"
          style="background-image: linear-gradient(135deg, #a78bfa 0%, #6366f1 50%, #818cf8 100%)"
        >
          your flow.
        </span>
      </h1>

      <p class="text-white/38 text-xl leading-relaxed max-w-2xl mb-12">
        Boards, lists, and cards that move with your team. From backlog to shipped — without the
        noise.
      </p>

      <!-- CTA -->
      <div class="flex items-center gap-3 mb-24">
        <a
          href="/register"
          class="px-7 py-3.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 hover:scale-[1.02]"
          style="background: linear-gradient(135deg, #6366f1, #a78bfa)"
        >
          Start for free
        </a>

        <a
          href="#demo"
          class="px-7 py-3.5 rounded-xl text-white/50 text-sm font-medium bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white/70 transition-all"
        >
          See how it works →
        </a>
      </div>

      <!-- BOARD PREVIEW -->
      <div class="w-full max-w-7xl mx-auto">
        <div
          class="bg-[#111] border border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.08)]"
        >
          <!-- Window bar -->
          <div
            class="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]"
          >
            <div class="w-3 h-3 rounded-full bg-white/10"></div>
            <div class="w-3 h-3 rounded-full bg-white/10"></div>
            <div class="w-3 h-3 rounded-full bg-white/10"></div>

            <div class="flex-1 flex justify-center">
              <div
                class="px-4 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/20 text-xs"
              >
                boardly.app / my-project
              </div>
            </div>
          </div>

          <!-- Board header -->
          <div class="flex items-center justify-between px-8 py-5 border-b border-white/[0.05]">
            <div class="flex items-center gap-3">
              <span class="text-white/70 text-sm font-medium"> My Project </span>

              <span
                class="px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-400/20 text-indigo-300/70 text-[11px]"
              >
                Sprint 3
              </span>
            </div>

            <div class="flex items-center gap-2">
              <div
                class="w-7 h-7 rounded-full bg-indigo-400/30 border border-indigo-400/20 text-[10px] text-indigo-300/60 flex items-center justify-center"
              >
                A
              </div>

              <div
                class="w-7 h-7 rounded-full bg-violet-400/30 border border-violet-400/20 text-[10px] text-violet-300/60 flex items-center justify-center"
              >
                M
              </div>

              <div
                class="w-7 h-7 rounded-full bg-emerald-400/30 border border-emerald-400/20 text-[10px] text-emerald-300/60 flex items-center justify-center"
              >
                J
              </div>
            </div>
          </div>

          <!-- Columns -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
            <!-- TODO -->
            <div class="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
              <div class="flex items-center justify-between mb-4">
                <span class="text-[11px] text-white/30 uppercase tracking-wider"> Todo </span>

                <span class="text-[10px] text-white/20 bg-white/[0.04] px-2 py-1 rounded-md">
                  3
                </span>
              </div>

              <div class="space-y-3">
                <div class="bg-white/[0.05] border border-white/[0.08] rounded-xl p-4">
                  <p class="text-[13px] text-white/70 mb-3">Design system tokens</p>

                  <div class="flex items-center justify-between">
                    <div class="w-16 h-[3px] bg-indigo-500/60 rounded-full"></div>

                    <div
                      class="w-6 h-6 rounded-full bg-indigo-400/20 text-[10px] text-indigo-300/50 flex items-center justify-center"
                    >
                      A
                    </div>
                  </div>
                </div>

                <div class="bg-white/[0.05] border border-white/[0.08] rounded-xl p-4">
                  <p class="text-[13px] text-white/70 mb-3">Write API docs</p>

                  <div class="flex items-center justify-between">
                    <div class="w-10 h-[3px] bg-violet-500/50 rounded-full"></div>

                    <div
                      class="w-6 h-6 rounded-full bg-violet-400/20 text-[10px] text-violet-300/50 flex items-center justify-center"
                    >
                      M
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- DOING -->
            <div class="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
              <div class="flex items-center justify-between mb-4">
                <span class="text-[11px] text-white/30 uppercase tracking-wider"> Doing </span>

                <span class="text-[10px] text-white/20 bg-white/[0.04] px-2 py-1 rounded-md">
                  2
                </span>
              </div>

              <div class="space-y-3">
                <div class="bg-indigo-500/[0.08] border border-indigo-400/[0.18] rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>

                    <p class="text-[13px] text-white/80">Auth flow & JWT</p>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="w-20 h-[3px] bg-indigo-400/70 rounded-full"></div>

                    <div
                      class="w-6 h-6 rounded-full bg-indigo-400/20 text-[10px] text-indigo-300/50 flex items-center justify-center"
                    ></div>
                  </div>
                </div>

                <div class="bg-violet-500/[0.06] border border-violet-400/[0.15] rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>

                    <p class="text-[13px] text-white/80">Drag & drop engine</p>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="w-14 h-[3px] bg-violet-400/60 rounded-full"></div>

                    <div
                      class="w-6 h-6 rounded-full bg-violet-400/20 text-[10px] text-violet-300/50 flex items-center justify-center"
                    >
                      M
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- DONE -->
            <div class="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
              <div class="flex items-center justify-between mb-4">
                <span class="text-[11px] text-white/30 uppercase tracking-wider"> Finished </span>

                <span class="text-[10px] text-white/20 bg-white/[0.04] px-2 py-1 rounded-md">
                  4
                </span>
              </div>

              <div class="space-y-3">
                <div
                  v-for="task in ['Onboarding flow', 'DB schema', 'CI/CD pipeline', 'Landing page']"
                  :key="task"
                  class="bg-emerald-400/[0.04] border border-emerald-400/[0.10] rounded-xl p-4"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-5 h-5 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center"
                    >
                      <div class="w-2 h-2 rounded-full bg-emerald-400/60"></div>
                    </div>

                    <p class="text-[13px] text-white/35 line-through">
                      {{ task }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="relative z-10 flex justify-center gap-16 pb-24 pt-6 flex-wrap">
      <div
        v-for="stat in [
          { n: '12k+', label: 'Active users' },
          { n: '480k', label: 'Tasks completed' },
          { n: '99.9%', label: 'Uptime' },
        ]"
        :key="stat.label"
        class="text-center"
      >
        <p class="text-3xl font-bold text-white/80 tracking-tight">
          {{ stat.n }}
        </p>

        <p class="text-sm text-white/30 mt-1">
          {{ stat.label }}
        </p>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="relative z-10 max-w-7xl mx-auto px-8 xl:px-16 pb-28 w-full">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          v-for="feat in [
            {
              icon: '▦',
              title: 'Boards & lists',
              desc: 'Organize any project into visual boards with unlimited lists and cards.',
            },
            {
              icon: '⇄',
              title: 'Drag & drop',
              desc: 'Move tasks between columns with smooth drag-and-drop. No friction.',
            },
            {
              icon: '◎',
              title: 'Team workspaces',
              desc: 'Invite your team, assign tasks, and collaborate in real time.',
            },
          ]"
          :key="feat.title"
          class="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all"
        >
          <div class="text-3xl mb-4 opacity-60">
            {{ feat.icon }}
          </div>

          <h3 class="text-white/75 text-base font-semibold mb-3">
            {{ feat.title }}
          </h3>

          <p class="text-white/35 text-sm leading-relaxed">
            {{ feat.desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer
      class="relative z-10 border-t border-white/[0.05] px-8 xl:px-16 py-6 flex items-center justify-between"
    >
      <span class="text-white/20 text-xs"> © 2025 Boardly </span>

      <p class="text-white/15 text-xs italic hidden md:block">
        "Finally a board tool that doesn't get in my way." — Marko P.
      </p>
    </footer>
  </div>
</template>
