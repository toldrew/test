<script setup lang="ts">
import { computed } from 'vue'

export interface BaseInputProps {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  label?: string
  id?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

const classes = computed(() => [
  'base-input__field',
  `base-input__field--${props.size}`,
  {
    'base-input__field--error': props.error,
    'base-input__field--disabled': props.disabled
  }
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="base-input">
    <label v-if="label" :for="inputId" class="base-input__label">
      {{ label }}
      <span v-if="required" class="base-input__required">*</span>
    </label>
    <input
      :id="inputId"
      :class="classes"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :name="name"
      @input="handleInput"
      @blur="emit('blur', $event as FocusEvent)"
      @focus="emit('focus', $event as FocusEvent)"
    />
    <span v-if="error" class="base-input__error">{{ error }}</span>
  </div>
</template>

<style scoped lang="scss">
.base-input {
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

  &__field {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-background);
    color: var(--color-text-primary);
    transition: all 0.2s ease;

    &::placeholder {
      color: var(--color-text-tertiary);
    }

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

  &__error {
    font-size: 0.875rem;
    color: var(--color-error);
  }
}
</style>
