<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api'
import { useSessionStore } from '@/stores/usersSessionStore'
import BaseButton from '@/components/ui/BaseButton.vue'

export type UserAddPayload = {
  usr_fullname: string
  usr_username: string
  usr_email: string
  usr_password: string
  roles: number[]
}

type Role = {
  rol_id: number
  rol_name: string
}
const session = useSessionStore()
const roles = ref<Role[]>([])

async function fetchRoles() {
  if (!session.sid) return
  const res = await api.getRoles(session.sid)
  roles.value = res.data.data
}

const props = defineProps<{
  loading?: boolean
}>()

onMounted(fetchRoles)

const emit = defineEmits<{
  (e: 'save', payload: UserAddPayload): void
  (e: 'cancel'): void
}>()

const form = ref<UserAddPayload>({
  usr_fullname: '',
  usr_username: '',
  usr_email: '',
  usr_password: '',
  roles: [1],
})

const isFormValid = computed(() => {
  return (
    form.value.usr_fullname.trim() &&
    form.value.usr_username.trim() &&
    form.value.usr_email.trim() &&
    form.value.usr_password.trim() &&
    form.value.roles.length > 0
  )
})
function save() {
  emit('save', {
    usr_fullname: form.value.usr_fullname.trim(),
    usr_username: form.value.usr_username.trim(),
    usr_email: form.value.usr_email.trim(),
    usr_password: form.value.usr_password,
    roles: form.value.roles,
  })
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal-container max-w-125 w-full">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Add User</h2>
        <p class="modal-subtitle">Create a new user account</p>
      </div>

      <!-- Full Name -->
      <div class="modal-field">
        <label class="modal-label">Full name</label>

        <input v-model="form.usr_fullname" placeholder="Enter full name" class="modal-input" />
      </div>

      <!-- Username -->
      <div class="modal-field">
        <label class="modal-label">Username</label>

        <input
          v-model="form.usr_username"
          autocomplete="off"
          placeholder="Enter username"
          class="modal-input"
        />
      </div>

      <!-- Email -->
      <div class="modal-field">
        <label class="modal-label">Email</label>

        <input
          v-model="form.usr_email"
          type="email"
          placeholder="Enter email address"
          class="modal-input"
        />
      </div>

      <!-- Password -->
      <div class="modal-field">
        <label class="modal-label">Password</label>

        <input
          v-model="form.usr_password"
          type="password"
          autocomplete="off"
          placeholder="Enter password"
          class="modal-input"
        />
      </div>

      <!-- Roles -->
      <div class="modal-field">
        <label class="modal-label">Roles</label>

        <div class="flex flex-wrap gap-2">
          <label
            v-for="role in roles"
            :key="role.rol_id"
            class="flex items-center gap-1.5 px-3 py-1 rounded-full border cursor-pointer text-sm transition"
            :class="
              form.roles.includes(role.rol_id)
                ? 'border-indigo-500 text-indigo-400 opacity-100'
                : 'border-white/10 text-white/50 opacity-50'
            "
          >
            <input v-model="form.roles" type="checkbox" :value="role.rol_id" class="hidden" />

            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400" />

            {{ role.rol_name }}
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button @click="emit('cancel')" class="modal-cancel">Cancel</button>

        <BaseButton
          variant="primary"
          :loading="props.loading"
          :disabled="!isFormValid"
          @click="save"
        >
          Save
        </BaseButton>
      </div>
    </div>
  </div>
</template>
