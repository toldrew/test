import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
  function showToast(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = toastId++
    const toast: Toast = { id, message, type, duration }
    
    toasts.value.push(toast)
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  function removeToast(id: number) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  function success(message: string, duration = 3000) {
    return showToast(message, 'success', duration)
  }
  
  function error(message: string, duration = 4000) {
    return showToast(message, 'error', duration)
  }
  
  function info(message: string, duration = 3000) {
    return showToast(message, 'info', duration)
  }
  
  function warning(message: string, duration = 3000) {
    return showToast(message, 'warning', duration)
  }
  
  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}
