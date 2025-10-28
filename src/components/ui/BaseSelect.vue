<script setup lang="ts">
import { computed } from 'vue'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface BaseSelectProps {
  modelValue?: string | number
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  id?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<BaseSelectProps>(), {
  disabled: false,
  required: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const selectId = computed(() => props.id || `select-${Math.random().toString(36).substr(2, 9)}`)

const classes = computed(() => [
  'base-select__field',
  `base-select__field--${props.size}`,
  {
    'base-select__field--error': props.error,
    'base-select__field--disabled': props.disabled
  }
])

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="base-select">
    <label v-if="label" :for="selectId" class="base-select__label">
      {{ label }}
      <span v-if="required" class="base-select__required">*</span>
    </label>
    <div class="base-select__wrapper">
      <select
        :id="selectId"
        :class="classes"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :name="name"
        @change="handleChange"
      >
        <option v-if="placeholder" value="" disabled :selected="!modelValue">
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <span class="base-select__icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    <span v-if="error" class="base-select__error">{{ error }}</span>
  </div>
</template>

<style scoped lang="scss">
.base-select {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  &__required {
    color: var(--color-error);
    margin-left: 0.125rem;
  }

  &__wrapper {
    position: relative;
    width: 100%;
  }

  &__field {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-background);
    color: var(--color-text-primary);
    cursor: pointer;
    appearance: none;
    padding-right: 2.5rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(121, 80, 242, 0.1);
    }

    &--sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }

    &--md {
      padding: 0.5rem 0.875rem;
      font-size: 1rem;
    }

    &--lg {
      padding: 0.75rem 1rem;
      font-size: 1.125rem;
    }

    &--error {
      border-color: var(--color-error);

      &:focus {
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
      }
    }

    &--disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: var(--color-surface);
    }
  }

  &__icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--color-text-tertiary);
    display: flex;
    align-items: center;
  }

  &__error {
    font-size: 0.875rem;
    color: var(--color-error);
  }
}
</style>
