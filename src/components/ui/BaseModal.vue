<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

export interface BaseModalProps {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlay?: boolean
  showClose?: boolean
}

const props = withDefaults(defineProps<BaseModalProps>(), {
  size: 'md',
  closeOnOverlay: true,
  showClose: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const modalRef = ref<HTMLElement | null>(null)
const firstFocusableElement = ref<HTMLElement | null>(null)
const lastFocusableElement = ref<HTMLElement | null>(null)

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    close()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

const trapFocus = (event: KeyboardEvent) => {
  if (!props.modelValue || !modalRef.value) return

  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  if (focusableElements.length === 0) return

  firstFocusableElement.value = focusableElements[0] as HTMLElement
  lastFocusableElement.value = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement.value) {
        lastFocusableElement.value?.focus()
        event.preventDefault()
      }
    } else {
      if (document.activeElement === lastFocusableElement.value) {
        firstFocusableElement.value?.focus()
        event.preventDefault()
      }
    }
  }
}

const lockScroll = () => {
  document.body.style.overflow = 'hidden'
}

const unlockScroll = () => {
  document.body.style.overflow = ''
}

watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    lockScroll()
    await nextTick()
    const focusableElements = modalRef.value?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus()
    }
  } else {
    unlockScroll()
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.addEventListener('keydown', trapFocus)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
  document.removeEventListener('keydown', trapFocus)
  unlockScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="base-modal-overlay"
        @click="handleOverlayClick"
      >
        <Transition name="modal-slide">
          <div
            v-if="modelValue"
            ref="modalRef"
            :class="['base-modal', `base-modal--${size}`]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? 'modal-title' : undefined"
          >
            <div v-if="title || showClose || $slots.header" class="base-modal__header">
              <slot name="header">
                <h2 v-if="title" id="modal-title" class="base-modal__title">{{ title }}</h2>
              </slot>
              <button
                v-if="showClose"
                class="base-modal__close"
                type="button"
                aria-label="Close modal"
                @click="close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div class="base-modal__body">
              <slot />
            </div>

            <div v-if="$slots.footer" class="base-modal__footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.base-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

.base-modal {
  background-color: var(--color-background-elevated);
  border-radius: 12px;
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  position: relative;

  &--sm {
    max-width: 400px;
  }

  &--md {
    max-width: 600px;
  }

  &--lg {
    max-width: 800px;
  }

  &--xl {
    max-width: 1000px;
  }

  &--full {
    max-width: calc(100vw - 2rem);
    max-height: calc(100vh - 2rem);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }

  &__close {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: 0.5rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    margin-left: auto;

    &:hover {
      background-color: var(--color-surface);
      color: var(--color-text-primary);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  &__body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  &__footer {
    padding: 1.5rem;
    border-top: 1px solid var(--color-border);
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-slide-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.modal-slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .base-modal {
    max-height: calc(100vh - 1rem);
    
    &__header,
    &__body,
    &__footer {
      padding: 1rem;
    }
  }
}
</style>
