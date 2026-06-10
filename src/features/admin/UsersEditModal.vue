<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'
import type { Role, User } from '../users/data/usersMockData'
import { useSessionStore } from '@/stores/usersSessionStore'

const session = useSessionStore()

const roles = ref<Role[]>([])
const selectedRoles = ref<Role[]>([]) // ← sada čuva pune Role objekte

const emit = defineEmits<{
  (e: 'save', payload: User): void
  (e: 'cancel'): void
}>()

const props = defineProps<{
  user: User
}>()

// Local user copy
const localUser = ref<User>({
  usr_id: props.user.usr_id,
  usr_fullname: props.user.usr_fullname,
  usr_username: props.user.usr_username, // ← popravljeno
  usr_email: props.user.usr_email,
  roles: [],
})

// Inicijalizuj selektovane role (pune objekte)
function initSelectedRoles() {
  if (!props.user.roles || !Array.isArray(props.user.roles)) return

  selectedRoles.value = props.user.roles
    .map((userRole: Role | number) => {
      const roleId = typeof userRole === 'number' ? userRole : userRole.rol_id
      return roles.value.find((r) => r.rol_id === roleId)
    })
    .filter((role): role is Role => !!role) // type guard
}

async function fetchRoles() {
  if (!session.sid) return
  const res = await api.getRoles(session.sid)
  roles.value = res.data.data || []

  // Nakon što dobijemo role, inicijalizuj selekciju
  initSelectedRoles()
}

onMounted(fetchRoles)

function save() {
  console.log('selectedRoles', selectedRoles.value)

  emit('save', {
    usr_id: localUser.value.usr_id,
    usr_fullname: localUser.value.usr_fullname.trim(),
    usr_username: localUser.value.usr_username.trim(),
    usr_email: localUser.value.usr_email.trim(),
    roles: selectedRoles.value,
  })
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal-container max-w-[500px] w-full">
      <!-- HEADER -->
      <div class="modal-header">
        <h2 class="modal-title">Edit User</h2>
        <p class="modal-subtitle">Update user details</p>
      </div>

      <!-- Full Name -->
      <div class="modal-field">
        <label class="modal-label">Full name</label>
        <input v-model="localUser.usr_fullname" class="modal-input" />
      </div>

      <!-- Username -->
      <div class="modal-field">
        <label class="modal-label">Username</label>
        <input v-model="localUser.usr_username" class="modal-input" />
      </div>

      <!-- Email -->
      <div class="modal-field">
        <label class="modal-label">Email</label>
        <input v-model="localUser.usr_email" type="email" class="modal-input" />
      </div>

      <!-- Roles -->
      <div class="modal-field">
        <label class="modal-label mb-2">Roles</label>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="role in roles"
            :key="role.rol_id"
            class="flex items-center gap-1.5 px-3 py-1 rounded-full border cursor-pointer text-sm transition"
            :class="
              selectedRoles.some((r) => r.rol_id === role.rol_id)
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                : 'border-white/10 text-white/50'
            "
          >
            <input v-model="selectedRoles" type="checkbox" :value="role" class="hidden" />
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            {{ role.rol_name }}
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button @click="emit('cancel')" class="modal-cancel">Cancel</button>
        <button @click="save" class="modal-primary">Save Changes</button>
      </div>
    </div>
  </div>
</template>
