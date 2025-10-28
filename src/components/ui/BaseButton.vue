<script setup lang="ts">
import { computed } from 'vue'

export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--disabled': props.disabled || props.loading,
    'base-button--loading': props.loading,
    'base-button--full-width': props.fullWidth
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="classes"
    :type="type"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__spinner"></span>
    <span class="base-button__content" :class="{ 'base-button__content--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
  user-select: none;

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &--sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  &--md {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  &--lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  &--primary {
    background-color: var(--color-primary);
    color: var(--color-text-inverse);

    &:hover:not(.base-button--disabled) {
      background-color: var(--color-primary-hover);
    }

    &:active:not(.base-button--disabled) {
      background-color: var(--color-primary-active);
    }
  }

  &--secondary {
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);

    &:hover:not(.base-button--disabled) {
      background-color: var(--color-surface-hover);
      border-color: var(--color-border-hover);
    }
  }

  &--ghost {
    background-color: transparent;
    color: var(--color-text-primary);

    &:hover:not(.base-button--disabled) {
      background-color: var(--color-surface);
    }
  }

  &--danger {
    background-color: var(--color-error);
    color: var(--color-text-inverse);

    &:hover:not(.base-button--disabled) {
      background-color: #ff5252;
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--full-width {
    width: 100%;
  }

  &__spinner {
    position: absolute;
    width: 1em;
    height: 1em;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &--hidden {
      opacity: 0;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
