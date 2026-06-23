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
const repeatPassword = ref('')

const isLoading = ref(false)
const registerFailed = ref(false)

const errors = ref<Record<string, string>>({})

const passwordMismatch = computed(() => {
  return repeatPassword.value.length > 0 && password.value !== repeatPassword.value
})

const emailValid = computed(() => {
  return email.value.trim() === '' || email.value.includes('@')
})

function validate() {
  const e: Record<string, string> = {}

  if (!fullname.value.trim()) e.fullname = 'Required'
  if (!email.value.trim()) {
    e.email = 'Required'
  } else if (!email.value.includes('@')) {
    e.email = 'Invalid email address'
  }
  if (!password.value.trim()) e.password = 'Required'
  if (password.value !== repeatPassword.value) e.repeatPassword = 'Passwords do not match'

  errors.value = e
  return Object.keys(e).length === 0
}

const isFormValid = computed(() => {
  return (
    fullname.value.trim() &&
    email.value.trim() &&
    email.value.includes('@') &&
    password.value.trim() &&
    repeatPassword.value.trim() &&
    password.value === repeatPassword.value
  )
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
      class="hidden lg:flex lg:w-[50%] relative flex-col justify-between p-12 overflow-hidden bg-[#0a0a0a] border-r border-white/[0.06]"
    >
      <div
        class="absolute inset-0 opacity-[0.04]"
        style="
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
          background-size: 40px 40px;
        "
      ></div>
      <div
        class="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-[0.18]"
        style="background: radial-gradient(circle, #6366f1 0%, transparent 70%)"
      ></div>
      <div
        class="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-10"
        style="background: radial-gradient(circle, #a78bfa 0%, transparent 70%)"
      ></div>

      <!-- Logo -->
      <div class="relative z-10 flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center"
        >
          <svg viewBox="0 0 16 16" fill="none" class="w-4 h-4 text-white">
            <path
              d="M3 8L6.5 11.5L13 4.5"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="text-white/90 text-sm font-medium tracking-tight">YourBrand</span>
      </div>

      <!-- Center content -->
      <div class="relative z-10 space-y-6">
        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/50 text-xs tracking-wider uppercase"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
          Free to start
        </div>
        <div class="space-y-3">
          <h2 class="text-[32px] font-bold text-white leading-[1.18] tracking-tight">
            Your tasks,<br />your boards,<br />
            <span
              class="text-transparent bg-clip-text"
              style="background-image: linear-gradient(135deg, #a78bfa, #6366f1)"
              >your flow.</span
            >
          </h2>
          <p class="text-white/40 text-sm leading-relaxed max-w-[260px]">
            Organize work across boards, lists, and cards — from backlog to done.
          </p>
        </div>
        <div class="space-y-3">
          <div
            v-for="feat in ['Boards, lists & cards', 'Drag-and-drop tasks', 'Team collaboration']"
            :key="feat"
            class="flex items-center gap-3 text-white/60 text-sm"
          >
            <div
              class="w-5 h-5 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0"
            >
              <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3 text-indigo-400">
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
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
      <div class="relative z-10 border-t border-white/[0.07] pt-6">
        <p class="text-white/30 text-xs leading-relaxed italic">
          "Finally a board tool that doesn't get in my way."
        </p>
        <p class="text-white/20 text-xs mt-1">— Marko P., product lead</p>
      </div>
    </div>

    <!-- ── RIGHT PANEL ── -->
    <div
      class="flex-1 flex items-center justify-center px-6 py-12 bg-[#0a0a0a] relative overflow-hidden"
    >
      <div
        class="absolute inset-0 opacity-[0.02]"
        style="
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
          background-size: 40px 40px;
        "
      ></div>
      <div
        class="absolute top-[-100px] right-[-100px] w-[450px] h-[450px] rounded-full opacity-[0.08]"
        style="background: radial-gradient(circle, #6366f1 0%, transparent 70%)"
      ></div>

      <div class="w-full max-w-[380px] space-y-7 relative z-10">
        <div class="space-y-1.5">
          <h1 class="text-2xl font-bold text-white tracking-tight">Create your account</h1>
          <p class="text-sm text-white/35">Start organizing in minutes.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-white/40 tracking-wide">Full name</label>
            <input
              v-model="fullname"
              type="text"
              placeholder="Your name"
              class="w-full h-11 px-3.5 text-sm rounded-xl border outline-none transition-all duration-150 bg-white/[0.06] text-white placeholder:text-white/20 border-white/[0.09] focus:border-indigo-400/50 focus:bg-white/[0.08]"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-white/40 tracking-wide">Username</label>
            <input
              v-model="username"
              type="text"
              placeholder="Your username"
              class="w-full h-11 px-3.5 text-sm rounded-xl border outline-none transition-all duration-150 bg-white/[0.06] text-white placeholder:text-white/20 border-white/[0.09] focus:border-indigo-400/50 focus:bg-white/[0.08]"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-white/40 tracking-wide">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              :class="[
                'w-full h-11 px-3.5 text-sm rounded-xl border outline-none transition-all duration-150 bg-white/[0.06] text-white placeholder:text-white/20',
                !emailValid
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-white/[0.09] focus:border-indigo-400/50 focus:bg-white/[0.08]',
              ]"
            />
            <p v-if="!emailValid" class="text-xs text-red-400 mt-1">Invalid email address</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-white/40 tracking-wide">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full h-11 px-3.5 text-sm rounded-xl border outline-none transition-all duration-150 bg-white/[0.06] text-white placeholder:text-white/20 border-white/[0.09] focus:border-indigo-400/50 focus:bg-white/[0.08]"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-white/40 tracking-wide">Repeat password</label>
            <input
              v-model="repeatPassword"
              type="password"
              placeholder="••••••••"
              :class="[
                'w-full h-11 px-3.5 text-sm rounded-xl border outline-none transition-all duration-150 bg-white/[0.06] text-white placeholder:text-white/20',
                passwordMismatch
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-white/[0.09] focus:border-indigo-400/50 focus:bg-white/[0.08]',
              ]"
            />
            <p v-if="passwordMismatch" class="text-xs text-red-400 mt-1">Passwords do not match</p>
          </div>

          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full h-11 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
            :class="
              !isLoading && isFormValid ? 'hover:opacity-90 active:scale-[0.98] cursor-pointer' : ''
            "
            style="
              background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
              box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
            "
          >
            <template v-if="!isLoading">Create account</template>
            <svg v-else class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" stroke-width="3" />
              <path
                d="M12 2a10 10 0 0110 10"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </form>

        <p class="text-center text-xs text-white/30 pt-1">
          Already have an account?
          <a href="/login" class="text-white/60 font-medium hover:text-indigo-400 transition-colors"
            >Sign in</a
          >
        </p>
      </div>
    </div>
  </div>
</template>
