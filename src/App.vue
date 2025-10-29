<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AuthModal from '@/components/AuthModal.vue'
import ToastNotification from '@/components/ToastNotification.vue'

const authStore = useAuthStore()
const router = useRouter()

const showAuthModal = ref(false)
const showUserMenu = ref(false)

function openAuthModal() {
  showAuthModal.value = true
}

function handleLogout() {
  authStore.logout()
  showUserMenu.value = false
  router.push('/')
}

function closeUserMenu() {
  showUserMenu.value = false
}
</script>

<template>
  <div id="app">
    <header>
      <nav class="nav">
        <div class="nav-links">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </div>

        <div class="nav-auth">
          <button v-if="!authStore.isAuthenticated" class="login-button" @click="openAuthModal">
            Войти
          </button>

          <div v-else class="user-menu-container">
            <button class="user-button" @click="showUserMenu = !showUserMenu">
              <span class="user-avatar">{{ authStore.userInitials }}</span>
              <span class="user-name">{{ authStore.userDisplayName }}</span>
              <svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.5 6L8 9.5L11.5 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <Transition name="menu">
              <div v-if="showUserMenu" class="user-menu" @click="closeUserMenu">
                <div class="menu-overlay" @click="closeUserMenu"></div>
                <div class="menu-content" @click.stop>
                  <div class="menu-header">
                    <div class="menu-avatar">{{ authStore.userInitials }}</div>
                    <div class="menu-info">
                      <div class="menu-name">{{ authStore.userDisplayName }}</div>
                      <div class="menu-email">{{ authStore.currentUser?.email }}</div>
                    </div>
                  </div>
                  <div class="menu-divider"></div>
                  <button class="menu-item" @click="handleLogout">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                      <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Выйти
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <AuthModal v-model="showAuthModal" />
    <ToastNotification />
  </div>
</template>

<style scoped lang="scss">
header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;

  a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: #42b983;
      transition: width 0.3s ease;
    }

    &:hover {
      color: #42b983;
      transform: translateY(-2px);

      &::after {
        width: 100%;
      }
    }

    &.router-link-active {
      color: #42b983;

      &::after {
        width: 100%;
      }
    }
  }
}

.nav-auth {
  margin-left: auto;
}

.login-button {
  padding: 0.5rem 1.25rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #35a372;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.user-menu-container {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #42b983;
    background: #f8f9fa;
  }
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #42b983, #35a372);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name {
  font-weight: 500;
  color: #333;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  color: #6b7280;
  transition: transform 0.2s;
}

.user-button:hover .chevron {
  color: #42b983;
}

.user-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
}

.menu-content {
  position: absolute;
  top: 4.5rem;
  right: 1rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  min-width: 260px;
  overflow: hidden;
}

.menu-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #42b983, #35a372);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.menu-info {
  flex: 1;
  min-width: 0;
}

.menu-name {
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-email {
  font-size: 0.875rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-divider {
  height: 1px;
  background: #dee2e6;
}

.menu-item {
  width: 100%;
  padding: 0.875rem 1rem;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;

  svg {
    color: #6b7280;
  }

  &:hover {
    background: #f8f9fa;

    svg {
      color: #42b983;
    }
  }
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease;

  .menu-content {
    transition: all 0.2s ease;
  }
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;

  .menu-content {
    opacity: 0;
    transform: translateY(-10px);
  }
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  header {
    animation: none;
  }

  .nav-links a {
    transition: none;

    &::after {
      transition: none;
    }

    &:hover {
      transform: none;
    }
  }

  .login-button,
  .user-button,
  .cta-button {
    transition: none;

    &:hover {
      transform: none;
    }
  }

  .menu-enter-active,
  .menu-leave-active {
    transition: none;

    .menu-content {
      transition: none;
    }
  }
}
</style>
