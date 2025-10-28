<script setup lang="ts">
import { computed } from 'vue'

export interface BaseIconButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  ariaLabel: string
  type?: 'button' | 'submit' | 'reset'
  rounded?: boolean
}

const props = withDefaults(defineProps<BaseIconButtonProps>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
  type: 'button',
  rounded: true
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => [
  'base-icon-button',
  `base-icon-button--${props.variant}`,
  `base-icon-button--${props.size}`,
  {
    'base-icon-button--disabled': props.disabled,
    'base-icon-button--rounded': props.rounded
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="classes"
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.base-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &--sm {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }

  &--md {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.25rem;
  }

  &--lg {
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
  }

  &--rounded {
    border-radius: 50%;
  }

  &:not(&--rounded) {
    border-radius: 6px;
  }

  &--primary {
    background-color: var(--color-primary);
    color: var(--color-text-inverse);

    &:hover:not(.base-icon-button--disabled) {
      background-color: var(--color-primary-hover);
    }

    &:active:not(.base-icon-button--disabled) {
      background-color: var(--color-primary-active);
    }
  }

  &--secondary {
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);

    &:hover:not(.base-icon-button--disabled) {
      background-color: var(--color-surface-hover);
      border-color: var(--color-border-hover);
    }
  }

  &--ghost {
    background-color: transparent;
    color: var(--color-text-primary);

    &:hover:not(.base-icon-button--disabled) {
      background-color: var(--color-surface);
    }
  }

  &--danger {
    background-color: var(--color-error);
    color: var(--color-text-inverse);

    &:hover:not(.base-icon-button--disabled) {
      background-color: #ff5252;
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
