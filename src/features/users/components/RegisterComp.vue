<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/api'

export type RegisterPayload = {
  fullname: string
  username: string
  email: string
  password: string
}

const router = useRouter()

const fullname = ref('')
const email = ref('')
const username = ref('')
const password = ref('')

const isLoading = ref(false)
const registerFailed = ref(false)

const errors = ref<Record<string, string>>({})

function validate() {
  const e: Record<string, string> = {}

  if (!fullname.value.trim()) {
    e.fullname = 'Required'
  }

  if (!email.value.trim()) {
    e.email = 'Required'
  }

  if (!password.value.trim()) {
    e.password = 'Required'
  }

  errors.value = e

  return Object.keys(e).length === 0
}

const isFormValid = computed(() => {
  return fullname.value.trim() && email.value.trim() && password.value.trim()
})

async function handleSubmit() {
  registerFailed.value = false

  if (!validate()) return

  try {
    isLoading.value = true

    const payload: RegisterPayload = {
      fullname: fullname.value,
      username: username.value,
      email: email.value,
      password: password.value,
    }

    await api.registerUser(payload)

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err) {
    registerFailed.value = true
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex font-[system-ui] bg-[#0a0a0a]">
    <!-- ── LEFT PANEL ── -->
    <div
      class="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-10 overflow-hidden bg-[#0a0a0a]"
    >
      <!-- Grid texture -->
      <div
        class="absolute inset-0 opacity-[0.04]"
        style="
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
          background-size: 40px 40px;
        "
      ></div>

      <!-- Glow blobs -->
      <div
        class="absolute top-[-80px] left-[-80px] w-[360px] h-[360px] rounded-full opacity-20"
        style="background: radial-gradient(circle, #6366f1 0%, transparent 70%)"
      ></div>
      <div
        class="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full opacity-10"
        style="background: radial-gradient(circle, #a78bfa 0%, transparent 70%)"
      ></div>

      <!-- Center content -->
      <div class="relative z-10 space-y-7">
        <!-- Badge -->
        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
          <span class="text-white/45 text-[11px] tracking-widest uppercase">Free to start</span>
        </div>

        <!-- Heading -->
        <div class="space-y-3">
          <h2 class="text-[32px] font-bold text-white leading-[1.18] tracking-tight">
            Your tasks,<br />your boards,<br />
            <span
              class="text-transparent bg-clip-text"
              style="background-image: linear-gradient(135deg, #a78bfa, #6366f1)"
              >your flow.</span
            >
          </h2>
          <p class="text-white/38 text-sm leading-relaxed max-w-[230px]">
            Organize work across boards, lists, and cards — from backlog to done.
          </p>
        </div>

        <!-- Mini kanban preview -->
        <div class="flex gap-2">
          <!-- Todo -->
          <div class="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg p-2.5">
            <p class="text-[10px] text-white/30 uppercase tracking-wider mb-2">Todo</p>
            <div
              class="bg-white/[0.07] border border-white/10 rounded-md p-2 mb-1.5 animate-[float_4s_ease-in-out_infinite]"
            >
              <p class="text-[11px] text-white/60 leading-snug">Design system</p>
              <div class="w-6 h-[3px] bg-indigo-500 rounded-full mt-1.5 opacity-70"></div>
            </div>
            <div
              class="bg-white/[0.05] border border-white/[0.07] rounded-md p-2 animate-[float_4s_ease-in-out_infinite_0.8s]"
            >
              <p class="text-[11px] text-white/40 leading-snug">API docs</p>
              <div class="w-4 h-[3px] bg-violet-400 rounded-full mt-1.5 opacity-50"></div>
            </div>
          </div>

          <!-- Doing -->
          <div class="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg p-2.5">
            <p class="text-[10px] text-white/30 uppercase tracking-wider mb-2">Doing</p>
            <div
              class="bg-indigo-500/15 border border-indigo-400/25 rounded-md p-2 animate-[float_4s_ease-in-out_infinite_1.6s]"
            >
              <p class="text-[11px] text-white/70 leading-snug">Auth flow</p>
              <div class="w-8 h-[3px] bg-indigo-400 rounded-full mt-1.5 opacity-80"></div>
            </div>
          </div>

          <!-- Done -->
          <div class="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg p-2.5">
            <p class="text-[10px] text-white/30 uppercase tracking-wider mb-2">Done</p>
            <div class="bg-emerald-400/[0.08] border border-emerald-400/15 rounded-md p-2">
              <p class="text-[11px] text-white/45 leading-snug line-through">Onboarding</p>
              <div class="w-5 h-[3px] bg-emerald-400 rounded-full mt-1.5 opacity-50"></div>
            </div>
          </div>
        </div>

        <!-- Feature list -->
        <div class="space-y-3">
          <div
            v-for="feat in ['Boards, lists & cards', 'Drag-and-drop tasks', 'Team collaboration']"
            :key="feat"
            class="flex items-center gap-3 text-white/55 text-sm"
          >
            <div
              class="w-5 h-5 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0"
            >
              <svg viewBox="0 0 12 12" fill="none" class="w-2.5 h-2.5">
                <path
                  d="M2 6L5 9L10 3"
                  stroke="#818cf8"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            {{ feat }}
          </div>
        </div>
      </div>

      <!-- Bottom quote -->
      <div class="relative z-10 border-t border-white/[0.07] pt-5">
        <p class="text-white/28 text-xs leading-relaxed italic">
          "Finally a board tool that doesn't get in my way."
        </p>
        <p class="text-white/18 text-xs mt-1">— Marko P., product lead</p>
      </div>
    </div>

    <!-- ── RIGHT PANEL ── -->
    <div class="flex-1 flex items-center justify-center bg-[#111] p-10">
      <div class="w-full max-w-sm space-y-6">
        <div class="space-y-1.5">
          <h3 class="text-white/70 text-xl font-semibold">Create your account</h3>
          <p class="text-white/30 text-sm">Start organizing in minutes.</p>
        </div>

        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-white/40 text-xs tracking-wide">Full name</label>
            <input
              v-model="fullname"
              type="text"
              placeholder="Your name"
              class="w-full bg-white/[0.05] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-white/40 text-xs tracking-wide">Username</label>
            <input
              v-model="username"
              type="text"
              placeholder="Your username"
              class="w-full bg-white/[0.05] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-white/40 text-xs tracking-wide">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full bg-white/[0.05] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-white/40 text-xs tracking-wide">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full bg-white/[0.05] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <button
            @click="handleSubmit"
            :disabled="!isFormValid || isLoading"
            class="w-full py-2.5 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            style="background: linear-gradient(135deg, #6366f1, #a78bfa)"
          >
            {{ isLoading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>

        <p class="text-white/25 text-xs text-center">
          Already have an account?
          <a href="/login" class="text-indigo-400 hover:text-indigo-300 transition-colors"
            >Sign in</a
          >
        </p>
      </div>
    </div>
  </div>
</template>
