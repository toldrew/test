<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

export interface LoginRegisterModalProps {
  modelValue: boolean
}

defineProps<LoginRegisterModalProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const activeTab = ref<'login' | 'register'>('login')

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const setActiveTab = (tab: 'login' | 'register') => {
  activeTab.value = tab
}

const handleLogin = () => {
  console.log('Login form submitted:', loginForm.value)
}

const handleRegister = () => {
  console.log('Register form submitted:', registerForm.value)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="login-register-modal">
      <div class="login-register-modal__tabs">
        <button
          type="button"
          :class="['login-register-modal__tab', { 'login-register-modal__tab--active': activeTab === 'login' }]"
          @click="setActiveTab('login')"
        >
          Login
        </button>
        <button
          type="button"
          :class="['login-register-modal__tab', { 'login-register-modal__tab--active': activeTab === 'register' }]"
          @click="setActiveTab('register')"
        >
          Register
        </button>
      </div>

      <div v-if="activeTab === 'login'" class="login-register-modal__form">
        <form @submit.prevent="handleLogin">
          <BaseInput
            v-model="loginForm.email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            required
          />
          <BaseInput
            v-model="loginForm.password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
          />
          <div class="login-register-modal__actions">
            <BaseButton type="submit" variant="primary" full-width>
              Login
            </BaseButton>
          </div>
          <p class="login-register-modal__note">
            Authentication logic will be implemented in a future ticket.
          </p>
        </form>
      </div>

      <div v-else class="login-register-modal__form">
        <form @submit.prevent="handleRegister">
          <BaseInput
            v-model="registerForm.name"
            type="text"
            label="Name"
            placeholder="Enter your name"
            required
          />
          <BaseInput
            v-model="registerForm.email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            required
          />
          <BaseInput
            v-model="registerForm.password"
            type="password"
            label="Password"
            placeholder="Create a password"
            required
          />
          <BaseInput
            v-model="registerForm.confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
          />
          <div class="login-register-modal__actions">
            <BaseButton type="submit" variant="primary" full-width>
              Register
            </BaseButton>
          </div>
          <p class="login-register-modal__note">
            Authentication logic will be implemented in a future ticket.
          </p>
        </form>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
.login-register-modal {
  &__tabs {
    display: flex;
    border-bottom: 1px solid var(--color-border);
    margin: -1.5rem -1.5rem 1.5rem;
  }

  &__tab {
    flex: 1;
    padding: 1rem;
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      color: var(--color-text-primary);
    }

    &--active {
      color: var(--color-primary);

      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: var(--color-primary);
      }
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: -2px;
    }
  }

  &__form {
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }

  &__actions {
    margin-top: 0.5rem;
  }

  &__note {
    margin: 1rem 0 0;
    padding: 0.75rem;
    background-color: var(--color-surface);
    border-radius: 6px;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    text-align: center;
  }
}
</style>
