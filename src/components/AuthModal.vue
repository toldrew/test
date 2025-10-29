<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import { useAuthStore } from '@/stores/authStore'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const authStore = useAuthStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Tab state
const activeTab = ref<'login' | 'register'>('login')

// Form state
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')

// UI state
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function switchTab(tab: 'login' | 'register') {
  activeTab.value = tab
  clearForm()
}

function clearForm() {
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  name.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}

async function handleLogin() {
  if (isLoading.value) return

  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const result = await authStore.login(email.value, password.value)

    if (result.success) {
      successMessage.value = 'Вход выполнен успешно!'
      setTimeout(() => {
        isOpen.value = false
        clearForm()
      }, 1000)
    } else {
      errorMessage.value = result.error || 'Ошибка входа'
    }
  } catch (error) {
    errorMessage.value = 'Произошла ошибка. Попробуйте снова.'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleRegister() {
  if (isLoading.value) return

  errorMessage.value = ''
  successMessage.value = ''

  // Additional validation for registration
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.register(email.value, password.value, name.value || undefined)

    if (result.success) {
      successMessage.value = 'Регистрация успешна! Добро пожаловать!'
      setTimeout(() => {
        isOpen.value = false
        clearForm()
      }, 1000)
    } else {
      errorMessage.value = result.error || 'Ошибка регистрации'
    }
  } catch (error) {
    errorMessage.value = 'Произошла ошибка. Попробуйте снова.'
    console.error('Registration error:', error)
  } finally {
    isLoading.value = false
  }
}

function handleSubmit() {
  if (activeTab.value === 'login') {
    handleLogin()
  } else {
    handleRegister()
  }
}
</script>

<template>
  <BaseModal v-model="isOpen" title="" max-width="500px">
    <div class="auth-modal">
      <div class="tabs">
        <button
          :class="['tab', { active: activeTab === 'login' }]"
          @click="switchTab('login')"
        >
          Вход
        </button>
        <button
          :class="['tab', { active: activeTab === 'register' }]"
          @click="switchTab('register')"
        >
          Регистрация
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="activeTab === 'register'" class="form-group">
          <label for="name">Имя (опционально)</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Введите имя"
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="email">Email <span class="required">*</span></label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Введите email"
            required
            :disabled="isLoading"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль <span class="required">*</span></label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Введите пароль"
            required
            :disabled="isLoading"
            :autocomplete="activeTab === 'login' ? 'current-password' : 'new-password'"
          />
          <small v-if="activeTab === 'register'" class="hint">
            Минимум 6 символов
          </small>
        </div>

        <div v-if="activeTab === 'register'" class="form-group">
          <label for="confirmPassword">Подтверждение пароля <span class="required">*</span></label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            required
            :disabled="isLoading"
            autocomplete="new-password"
          />
        </div>

        <div v-if="errorMessage" class="message error">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="message success">
          {{ successMessage }}
        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">
            {{ activeTab === 'login' ? 'Войти' : 'Зарегистрироваться' }}
          </span>
          <span v-else class="loading">
            Загрузка...
          </span>
        </button>
      </form>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
.auth-modal {
  min-height: 300px;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab {
  flex: 1;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;

  &:hover {
    color: #111;
  }

  &.active {
    color: #42b983;
    border-bottom-color: #42b983;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;

    .required {
      color: #ef4444;
    }
  }

  input {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #42b983;
      box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
    }

    &:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .hint {
    font-size: 0.75rem;
    color: #6b7280;
  }
}

.message {
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;

  &.error {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  &.success {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }
}

.submit-button {
  padding: 0.875rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #35a372;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .loading {
    display: inline-block;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
