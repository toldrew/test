<script setup lang="ts">
import { computed } from 'vue'

export interface BaseTextareaProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  label?: string
  id?: string
  name?: string
  rows?: number
  maxlength?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const props = withDefaults(defineProps<BaseTextareaProps>(), {
  disabled: false,
  readonly: false,
  required: false,
  rows: 4,
  resize: 'vertical'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const textareaId = computed(() => props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`)

const classes = computed(() => [
  'base-textarea__field',
  `base-textarea__field--resize-${props.resize}`,
  {
    'base-textarea__field--error': props.error,
    'base-textarea__field--disabled': props.disabled
  }
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const characterCount = computed(() => {
  if (!props.maxlength) return null
  const length = props.modelValue?.length || 0
  return `${length}/${props.maxlength}`
})
</script>

<template>
  <div class="base-textarea">
    <label v-if="label" :for="textareaId" class="base-textarea__label">
      {{ label }}
      <span v-if="required" class="base-textarea__required">*</span>
    </label>
    <textarea
      :id="textareaId"
      :class="classes"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :name="name"
      :rows="rows"
      :maxlength="maxlength"
      @input="handleInput"
      @blur="emit('blur', $event as FocusEvent)"
      @focus="emit('focus', $event as FocusEvent)"
    />
    <div v-if="error || characterCount" class="base-textarea__footer">
      <span v-if="error" class="base-textarea__error">{{ error }}</span>
      <span v-if="characterCount" class="base-textarea__count">{{ characterCount }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-textarea {
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
    padding: 0.5rem 0.875rem;
    font-size: 1rem;
    font-family: inherit;
    line-height: 1.5;
    transition: all 0.2s ease;

    &::placeholder {
      color: var(--color-text-tertiary);
    }

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(121, 80, 242, 0.1);
    }

    &--resize-none {
      resize: none;
    }

    &--resize-vertical {
      resize: vertical;
    }

    &--resize-horizontal {
      resize: horizontal;
    }

    &--resize-both {
      resize: both;
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

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  &__error {
    font-size: 0.875rem;
    color: var(--color-error);
  }

  &__count {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    margin-left: auto;
  }
}
</style>
