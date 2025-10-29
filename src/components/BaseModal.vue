<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  maxWidth?: string
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: '600px',
  closeOnOverlay: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function close() {
  isOpen.value = false
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    close()
  }
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div 
          class="modal-container" 
          :style="{ maxWidth }"
          @click.stop
        >
          <div class="modal-header">
            <h3 v-if="title" class="modal-title">{{ title }}</h3>
            <slot name="header" />
            <button class="modal-close" @click="close" aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <slot />
          </div>
          
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

.modal-container {
  background: var(--color-bg-primary, #fff);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modal-slide-up 0.3s ease-out;
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 
                0 0 20px rgba(99, 102, 241, 0.2);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  
  :global(.dark) & {
    border-bottom-color: var(--color-border-dark, #333);
  }
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary, #111);
  
  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.modal-close {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--color-text-secondary, #6b7280);
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--color-bg-secondary, #f3f4f6);
    color: var(--color-text-primary, #111);
  }
  
  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
    
    &:hover {
      background: var(--color-bg-secondary-dark, #2d2d2d);
      color: var(--color-text-primary-dark, #f9fafb);
    }
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-border, #e5e7eb);
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  flex-shrink: 0;
  
  :global(.dark) & {
    border-top-color: var(--color-border-dark, #333);
  }
}

// Animations
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container {
  animation: modal-slide-up 0.3s ease-out;
}

.modal-leave-active .modal-container {
  animation: modal-slide-down 0.3s ease-in;
}

@keyframes modal-slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes modal-slide-down {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>
