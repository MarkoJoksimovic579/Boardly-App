<script setup lang="ts">
import { useSessionStore } from '@/stores/usersSessionStore'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncAction } from '@/services/functions/useAsyncAction'

const session = useSessionStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const errors = ref<Record<string, string>>({})
const loginFailed = ref(false)

const { loading: isLoading, run } = useAsyncAction()

function validate() {
  const e: Record<string, string> = {}

  if (!username.value.trim()) e.username = 'Required'
  if (!password.value.trim()) e.password = 'Required'

  errors.value = e

  return Object.keys(e).length === 0
}

const isFormValid = computed(() => {
  return username.value.trim() && password.value.trim()
})

async function handleSubmit() {
  loginFailed.value = false

  if (!validate()) return

  await run(
    async () => {
      await session.login(username.value.trim(), password.value)

      router.push('/app/dashboard')
    },
    {
      error: 'Invalid username or password',
    },
  )
}
</script>

<template>
  <div class="min-h-screen flex font-[system-ui] bg-[#0a0a0a]">
    <!-- ── LEFT PANEL ── -->
    <div
      class="hidden lg:flex lg:w-[50%] relative flex-col justify-between p-12 overflow-hidden bg-[#0a0a0a] border-r border-white/6"
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
        class="absolute -top-20 -left-20 w-100 h-100 rounded-full opacity-[0.18]"
        style="background: radial-gradient(circle, #6366f1 0%, transparent 70%)"
      ></div>
      <div
        class="absolute -bottom-15 -right-15 w-75 h-75 rounded-full opacity-10"
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
      <div class="relative z-10 space-y-8">
        <div class="space-y-4">
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/6 border border-white/10 text-white/50 text-xs tracking-wider uppercase"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            Welcome back
          </div>
          <h2 class="text-4xl font-bold text-white leading-[1.15] tracking-tight">
            Good to see<br />you again,<br />
            <span
              class="text-transparent bg-clip-text"
              style="background-image: linear-gradient(135deg, #a78bfa, #6366f1)"
              >let's go.</span
            >
          </h2>
          <p class="text-white/40 text-sm leading-relaxed max-w-65">
            Sign in to access your boards, tasks, and team workspace.
          </p>
        </div>

        <div class="space-y-3">
          <div
            v-for="feat in [
              'Instant access to your boards',
              'Collaborate with your team',
              'Track tasks in real time',
            ]"
            :key="feat"
            class="flex items-center gap-3 text-white/60 text-sm"
          >
            <div
              class="w-5 h-5 rounded-full bg-white/6 border border-white/10 flex items-center justify-center shrink-0"
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
          "Everything I need is right there when I log in."
        </p>
        <p class="text-white/20 text-xs mt-1">— Marko T., verified member</p>
      </div>
    </div>

    <!-- ── RIGHT PANEL ── -->
    <div
      class="flex-1 flex items-center justify-center px-6 py-12 bg-[#0a0a0a] relative overflow-hidden"
    >
      <!-- Background effects -->
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
        class="absolute -top-25 -right-25 w-112.5 h-112.5 rounded-full opacity-[0.08]"
        style="background: radial-gradient(circle, #6366f1 0%, transparent 70%)"
      ></div>

      <div class="w-full max-w-95 space-y-7 relative z-10">
        <!-- Header -->
        <div class="space-y-1.5">
          <h1 class="text-2xl font-bold text-white tracking-tight">Sign in to your account</h1>
          <p class="text-sm text-white/35">Enter your credentials to continue.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
          <!-- Login failed banner -->
          <div
            v-if="loginFailed"
            class="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
          >
            <svg viewBox="0 0 16 16" fill="none" class="w-4 h-4 shrink-0">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3" />
              <path
                d="M8 5v3.5M8 10.5h.01"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
              />
            </svg>
            Invalid username or password. Please try again.
          </div>

          <!-- Username -->
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-white/40 tracking-wide">Username</label>
            <input
              v-model="username"
              type="text"
              autocomplete="username"
              class="w-full h-11 px-3.5 text-sm rounded-xl border outline-none transition-all duration-150 bg-white/6 text-white placeholder:text-white/20"
              :class="
                errors.username
                  ? 'border-red-500/40 focus:border-red-400/60 focus:bg-white/8'
                  : 'border-white/9 focus:border-indigo-400/50 focus:bg-white/8'
              "
            />
            <p v-if="errors.username" class="text-[11px] text-red-400/80 flex items-center gap-1">
              <svg viewBox="0 0 12 12" fill="none" class="w-2.5 h-2.5 shrink-0">
                <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2" />
                <path
                  d="M6 3.5V6.5M6 8H6.01"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>
              {{ errors.username }}
            </p>
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-medium text-white/40 tracking-wide">Password</label>

              <a
                href="/forgot-password"
                class="text-xs text-indigo-400/80 hover:text-indigo-300 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                class="w-full h-11 pl-3.5 pr-10 text-sm rounded-xl border outline-none transition-all duration-150 bg-white/6 text-white placeholder:text-white/20"
                :class="
                  errors.password
                    ? 'border-red-500/40 focus:border-red-400/60 focus:bg-white/8'
                    : 'border-white/9 focus:border-indigo-400/50 focus:bg-white/8'
                "
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
              >
                <svg v-if="!showPassword" viewBox="0 0 20 20" fill="none" class="w-4 h-4">
                  <path
                    d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"
                    stroke="currentColor"
                    stroke-width="1.4"
                  />
                  <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.4" />
                </svg>
                <svg v-else viewBox="0 0 20 20" fill="none" class="w-4 h-4">
                  <path
                    d="M3 3l14 14M8.5 8.7A2.5 2.5 0 0012.3 12M4.5 5.6C3 7 2 10 2 10s3 6 8 6c1.5 0 2.9-.4 4.1-1.1M7 4.2A9 9 0 0118 10s-.8 2-2.2 3.6"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="text-[11px] text-red-400/80 flex items-center gap-1">
              <svg viewBox="0 0 12 12" fill="none" class="w-2.5 h-2.5 shrink-0">
                <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2" />
                <path
                  d="M6 3.5V6.5M6 8H6.01"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>
              {{ errors.password }}
            </p>
          </div>

          <!-- Submit -->
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
            <template v-if="!isLoading"> Sign In </template>
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

        <!-- Register link -->
        <p class="text-center text-xs text-white/30 pt-1">
          Don't have an account?

          <a
            href="/register"
            class="text-white/60 font-medium hover:text-indigo-400 transition-colors"
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
