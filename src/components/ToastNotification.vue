<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

function getIcon(type: string): string {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠'
    default:
      return 'ℹ'
  }
}
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
        @click="removeToast(toast.id)"
      >
        <span class="toast-icon">{{ getIcon(toast.type) }}</span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click.stop="removeToast(toast.id)">✕</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid;
  animation: slideIn 0.3s ease;

  &:hover {
    transform: translateX(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &-success {
    border-left-color: #22c55e;
    
    .toast-icon {
      background: #22c55e;
    }
  }

  &-error {
    border-left-color: #ef4444;
    
    .toast-icon {
      background: #ef4444;
    }
  }

  &-warning {
    border-left-color: #f59e0b;
    
    .toast-icon {
      background: #f59e0b;
    }
  }

  &-info {
    border-left-color: #3b82f6;
    
    .toast-icon {
      background: #3b82f6;
    }
  }
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  color: #333;
  font-size: 0.9375rem;
  line-height: 1.4;
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
  font-size: 1rem;
  padding: 0;

  &:hover {
    color: #333;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

@media (max-width: 640px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}

// Dark theme support
:global(.dark) {
  .toast {
    background: #1a1a1a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    }
  }

  .toast-message {
    color: #f9fafb;
  }

  .toast-close {
    color: #9ca3af;

    &:hover {
      color: #f9fafb;
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .toast {
    animation: none;
    transition: none;
    
    &:hover {
      transform: none;
    }
  }
  
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition: none;
  }
}
</style>
