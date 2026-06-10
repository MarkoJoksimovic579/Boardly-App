<script setup lang="ts"></script>

<template>
  <div class="min-h-screen flex flex-col font-[system-ui] bg-[#0a0a0a] overflow-hidden">
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
      class="fixed top-[-120px] left-[-120px] w-[600px] h-[600px] rounded-full opacity-[0.15] pointer-events-none"
      style="background: radial-gradient(circle, #6366f1 0%, transparent 70%)"
    ></div>
    <div
      class="fixed bottom-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none"
      style="background: radial-gradient(circle, #a78bfa 0%, transparent 70%)"
    ></div>
    <div
      class="fixed top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-[0.06] pointer-events-none"
      style="background: radial-gradient(circle, #818cf8 0%, transparent 70%)"
    ></div>

    <!-- ── NAVBAR ── -->
    <nav
      class="relative z-20 flex items-center justify-between px-8 py-5 border-b border-white/[0.05]"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center"
        >
          <svg viewBox="0 0 16 16" fill="none" class="w-4 h-4">
            <rect x="2" y="2" width="5" height="10" rx="1.5" fill="rgba(255,255,255,0.7)" />
            <rect x="9" y="2" width="5" height="6" rx="1.5" fill="rgba(255,255,255,0.4)" />
          </svg>
        </div>
        <span class="text-white/85 text-sm font-medium tracking-tight">Boardly</span>
      </div>

      <div class="hidden md:flex items-center gap-8">
        <a href="#" class="text-white/40 text-sm hover:text-white/70 transition-colors">Features</a>
        <a href="#" class="text-white/40 text-sm hover:text-white/70 transition-colors">Pricing</a>
        <a href="#" class="text-white/40 text-sm hover:text-white/70 transition-colors"
          >Changelog</a
        >
      </div>

      <div class="flex items-center gap-3">
        <a
          href="/login"
          class="text-white/40 text-sm hover:text-white/70 transition-colors px-4 py-2"
        >
          Sign in
        </a>
        <a
          href="/register"
          class="px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
          style="background: linear-gradient(135deg, #6366f1, #a78bfa)"
        >
          Get started
        </a>
      </div>
    </nav>

    <!-- ── HERO ── -->
    <section
      class="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16"
    >
      <!-- Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 mb-8"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
        <span class="text-white/45 text-[11px] tracking-widest uppercase"
          >Free to start · No credit card</span
        >
      </div>

      <!-- Heading -->
      <h1
        class="text-5xl md:text-7xl font-bold text-white leading-[1.08] tracking-tight max-w-3xl mb-6"
      >
        Your tasks,<br />
        <span
          class="text-transparent bg-clip-text"
          style="background-image: linear-gradient(135deg, #a78bfa 0%, #6366f1 50%, #818cf8 100%)"
        >
          your flow.
        </span>
      </h1>

      <p class="text-white/38 text-lg leading-relaxed max-w-md mb-10">
        Boards, lists, and cards that move with your team. From backlog to shipped — without the
        noise.
      </p>

      <!-- CTA buttons -->
      <div class="flex items-center gap-3 mb-20">
        <a
          href="/register"
          class="px-6 py-3 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 hover:scale-[1.02]"
          style="background: linear-gradient(135deg, #6366f1, #a78bfa)"
        >
          Start for free
        </a>
        <a
          href="#demo"
          class="px-6 py-3 rounded-lg text-white/50 text-sm font-medium bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white/70 transition-all"
        >
          See how it works →
        </a>
      </div>

      <!-- ── KANBAN PREVIEW ── -->
      <div class="w-full max-w-4xl mx-auto">
        <!-- Window chrome -->
        <div class="bg-[#111] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
          <!-- Titlebar -->
          <div
            class="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]"
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
          <div class="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
            <div class="flex items-center gap-3">
              <span class="text-white/70 text-sm font-medium">My Project</span>
              <span
                class="px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-400/20 text-indigo-300/70 text-[11px]"
              >
                Sprint 3
              </span>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="w-6 h-6 rounded-full bg-indigo-400/30 border border-indigo-400/20 text-[10px] text-indigo-300/60 flex items-center justify-center"
              >
                A
              </div>
              <div
                class="w-6 h-6 rounded-full bg-violet-400/30 border border-violet-400/20 text-[10px] text-violet-300/60 flex items-center justify-center"
              >
                M
              </div>
              <div
                class="w-6 h-6 rounded-full bg-emerald-400/30 border border-emerald-400/20 text-[10px] text-emerald-300/60 flex items-center justify-center"
              >
                J
              </div>
            </div>
          </div>

          <!-- Columns -->
          <div class="flex gap-3 p-5 overflow-x-auto">
            <!-- TODO -->
            <div
              class="flex-1 min-w-[200px] bg-white/[0.02] border border-white/[0.06] rounded-xl p-3"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-[11px] text-white/30 uppercase tracking-wider">Todo</span>
                <span class="text-[10px] text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded-md"
                  >3</span
                >
              </div>
              <div class="space-y-2">
                <div
                  class="animate-[float_4s_ease-in-out_infinite] bg-white/[0.05] border border-white/[0.08] rounded-lg p-3"
                >
                  <p class="text-[12px] text-white/60 leading-snug mb-2">Design system tokens</p>
                  <div class="flex items-center justify-between">
                    <div class="w-10 h-[3px] bg-indigo-500/60 rounded-full"></div>
                    <div
                      class="w-5 h-5 rounded-full bg-indigo-400/20 text-[9px] text-indigo-300/50 flex items-center justify-center"
                    >
                      A
                    </div>
                  </div>
                </div>
                <div
                  class="animate-[float_4s_ease-in-out_infinite_0.6s] bg-white/[0.05] border border-white/[0.08] rounded-lg p-3"
                >
                  <p class="text-[12px] text-white/60 leading-snug mb-2">Write API docs</p>
                  <div class="flex items-center justify-between">
                    <div class="w-7 h-[3px] bg-violet-500/50 rounded-full"></div>
                    <div
                      class="w-5 h-5 rounded-full bg-violet-400/20 text-[9px] text-violet-300/50 flex items-center justify-center"
                    >
                      M
                    </div>
                  </div>
                </div>
                <div
                  class="animate-[float_4s_ease-in-out_infinite_1.2s] bg-white/[0.05] border border-white/[0.08] rounded-lg p-3"
                >
                  <p class="text-[12px] text-white/60 leading-snug mb-2">Mobile responsiveness</p>
                  <div class="flex items-center justify-between">
                    <div class="w-14 h-[3px] bg-pink-500/40 rounded-full"></div>
                    <div
                      class="w-5 h-5 rounded-full bg-emerald-400/20 text-[9px] text-emerald-300/50 flex items-center justify-center"
                    >
                      J
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- DOING -->
            <div
              class="flex-1 min-w-[200px] bg-white/[0.02] border border-white/[0.06] rounded-xl p-3"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-[11px] text-white/30 uppercase tracking-wider">Doing</span>
                <span class="text-[10px] text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded-md"
                  >2</span
                >
              </div>
              <div class="space-y-2">
                <div
                  class="animate-[float_4s_ease-in-out_infinite_1.8s] bg-indigo-500/[0.08] border border-indigo-400/[0.18] rounded-lg p-3"
                >
                  <div class="flex items-center gap-1.5 mb-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                    <p class="text-[12px] text-white/70 leading-snug">Auth flow & JWT</p>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="w-16 h-[3px] bg-indigo-400/70 rounded-full"></div>
                    <div
                      class="w-5 h-5 rounded-full bg-indigo-400/20 text-[9px] text-indigo-300/50 flex items-center justify-center"
                    >
                      A
                    </div>
                  </div>
                </div>
                <div
                  class="animate-[float_4s_ease-in-out_infinite_2.4s] bg-violet-500/[0.06] border border-violet-400/[0.15] rounded-lg p-3"
                >
                  <div class="flex items-center gap-1.5 mb-2">
                    <div
                      class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"
                      style="animation-delay: 0.4s"
                    ></div>
                    <p class="text-[12px] text-white/70 leading-snug">Drag & drop engine</p>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="w-12 h-[3px] bg-violet-400/60 rounded-full"></div>
                    <div
                      class="w-5 h-5 rounded-full bg-violet-400/20 text-[9px] text-violet-300/50 flex items-center justify-center"
                    >
                      M
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- FINISHED -->
            <div
              class="flex-1 min-w-[200px] bg-white/[0.02] border border-white/[0.06] rounded-xl p-3"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-[11px] text-white/30 uppercase tracking-wider">Finished</span>
                <span class="text-[10px] text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded-md"
                  >4</span
                >
              </div>
              <div class="space-y-2">
                <div
                  v-for="task in ['Onboarding flow', 'DB schema', 'CI/CD pipeline', 'Landing page']"
                  :key="task"
                  class="bg-emerald-400/[0.04] border border-emerald-400/[0.10] rounded-lg p-3"
                >
                  <div class="flex items-center gap-2 mb-1.5">
                    <svg viewBox="0 0 10 10" fill="none" class="w-3 h-3 flex-shrink-0">
                      <circle
                        cx="5"
                        cy="5"
                        r="4.5"
                        fill="rgba(52,211,153,0.15)"
                        stroke="rgba(52,211,153,0.3)"
                      />
                      <path
                        d="M3 5L4.5 6.5L7 3.5"
                        stroke="rgba(52,211,153,0.7)"
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p class="text-[12px] text-white/30 leading-snug line-through">{{ task }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Subtle reflection -->
        <div
          class="h-16 w-full rounded-b-2xl opacity-10 blur-sm -mt-2"
          style="background: linear-gradient(to bottom, rgba(99, 102, 241, 0.3), transparent)"
        ></div>
      </div>
    </section>

    <!-- ── STATS ── -->
    <section class="relative z-10 flex justify-center gap-12 pb-20 pt-4">
      <div
        v-for="stat in [
          { n: '12k+', label: 'Active users' },
          { n: '480k', label: 'Tasks completed' },
          { n: '99.9%', label: 'Uptime' },
        ]"
        :key="stat.label"
        class="text-center"
      >
        <p class="text-2xl font-bold text-white/80 tracking-tight">{{ stat.n }}</p>
        <p class="text-xs text-white/30 mt-1">{{ stat.label }}</p>
      </div>
    </section>

    <!-- ── FEATURES ── -->
    <section class="relative z-10 max-w-4xl mx-auto px-6 pb-28">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          class="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all"
        >
          <div class="text-2xl mb-3 opacity-60">{{ feat.icon }}</div>
          <h3 class="text-white/70 text-sm font-semibold mb-2">{{ feat.title }}</h3>
          <p class="text-white/30 text-xs leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer
      class="relative z-10 border-t border-white/[0.05] px-8 py-6 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <span class="text-white/20 text-xs">© 2025 Boardly</span>
      </div>
      <p class="text-white/15 text-xs italic">
        "Finally a board tool that doesn't get in my way." — Marko P.
      </p>
    </footer>
  </div>
</template>
