<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    variant?: 'primary' | 'cancel' | 'danger'
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    loading: false,
    disabled: false,
    variant: 'primary',
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :class="[
      'base-button',
      props.variant === 'primary' && 'base-button-primary',
      props.variant === 'cancel' && 'base-button-cancel',
      props.variant === 'danger' && 'base-button-danger',
      props.loading && 'btn-loading',
    ]"
  >
    <span v-if="props.loading" class="spinner spinner-sm"></span>

    <span>
      <slot />
    </span>
  </button>
</template>
