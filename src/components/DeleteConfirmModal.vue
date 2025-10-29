<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'

interface Props {
  modelValue: boolean
  title?: string
  message: string
  itemName?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Подтвердите удаление',
  confirmText: 'Удалить',
  cancelText: 'Отмена',
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  isOpen.value = false
}
</script>

<template>
  <BaseModal v-model="isOpen" :title="title" max-width="500px">
    <div class="delete-confirm-content">
      <div class="warning-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <p class="message">{{ message }}</p>

      <div v-if="itemName" class="item-name">
        <strong>{{ itemName }}</strong>
      </div>

      <p class="warning-text">Это действие нельзя отменить.</p>
    </div>

    <template #footer>
      <button class="btn btn-cancel" @click="handleCancel" :disabled="loading">
        {{ cancelText }}
      </button>
      <button class="btn btn-danger" @click="handleConfirm" :disabled="loading">
        <span v-if="loading" class="loading-spinner"></span>
        {{ confirmText }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
.delete-confirm-content {
  text-align: center;
  padding: 1rem 0;
}

.warning-icon {
  color: #ef4444;
  margin: 0 auto 1.5rem;
  width: 48px;
  height: 48px;
}

.message {
  font-size: 1.125rem;
  color: var(--color-text-primary, #111);
  margin-bottom: 1rem;

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.item-name {
  background: var(--color-bg-secondary, #f9fafb);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  
  strong {
    color: var(--color-text-primary, #111);
    word-break: break-word;
  }

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
    
    strong {
      color: var(--color-text-primary-dark, #f9fafb);
    }
  }
}

.warning-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6b7280);
  margin-bottom: 0;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.btn {
  padding: 0.625rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-cancel {
  background: var(--color-bg-secondary, #f3f4f6);
  color: var(--color-text-primary, #111);

  &:hover:not(:disabled) {
    background: var(--color-bg-secondary-hover, #e5e7eb);
  }

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #2d2d2d);
    color: var(--color-text-primary-dark, #f9fafb);

    &:hover:not(:disabled) {
      background: var(--color-bg-secondary-dark-hover, #3d3d3d);
    }
  }
}

.btn-danger {
  background: #ef4444;
  color: white;

  &:hover:not(:disabled) {
    background: #dc2626;
  }
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
