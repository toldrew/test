<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from '@/composables/useTheme'
import AuthModal from '@/components/AuthModal.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import AppFooter from '@/components/AppFooter.vue'

const authStore = useAuthStore()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const showAuthModal = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

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

function closeMobileMenu() {
  showMobileMenu.value = false
}
</script>

<template>
  <div id="app">
    <header>
      <nav class="nav">
        <div class="nav-brand">
          <RouterLink to="/" class="brand-link">Tournify</RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="nav-links">
          <RouterLink to="/">Главная</RouterLink>
          <RouterLink to="/dashboard">Дашборд</RouterLink>
          <RouterLink to="/about">О проекте</RouterLink>
        </div>

        <div class="nav-actions">
          <!-- Theme Toggle -->
          <button class="theme-toggle-btn" @click="toggleTheme" aria-label="Toggle theme">
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
          </button>

          <!-- Auth Section -->
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

          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-toggle" @click="showMobileMenu = !showMobileMenu" aria-label="Toggle menu">
            <svg v-if="!showMobileMenu" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h18M3 6h18M3 18h18" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <Transition name="mobile-menu">
        <div v-if="showMobileMenu" class="mobile-menu">
          <nav class="mobile-nav">
            <RouterLink to="/" @click="closeMobileMenu">Главная</RouterLink>
            <RouterLink to="/dashboard" @click="closeMobileMenu">Дашборд</RouterLink>
            <RouterLink to="/about" @click="closeMobileMenu">О проекте</RouterLink>
          </nav>
        </div>
      </Transition>
    </header>

    <main>
      <RouterView />
    </main>

    <AppFooter />

    <AuthModal v-model="showAuthModal" />
    <ToastNotification />
  </div>
</template>

<style scoped lang="scss">
header {
  background-color: var(--color-bg-primary, #f8f9fa);
  padding: 1rem;
  border-bottom: 1px solid var(--color-border, #dee2e6);
  animation: slideDown 0.5s ease-out;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  :global(.dark) & {
    background-color: var(--color-bg-secondary-dark, #1a1a1a);
    border-bottom-color: var(--color-border-dark, #333333);
  }
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

.nav-brand {
  .brand-link {
    font-size: 1.5rem;
    font-weight: 700;
    text-decoration: none;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }

    :global(.dark) & {
      background: linear-gradient(135deg, #818cf8, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
}

.nav-links {
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }

  a {
    color: var(--color-text-primary, #333);
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
      background: var(--color-primary, #42b983);
      transition: width 0.3s ease;
    }

    &:hover {
      color: var(--color-primary, #42b983);
      transform: translateY(-2px);

      &::after {
        width: 100%;
      }
    }

    &.router-link-active {
      color: var(--color-primary, #42b983);

      &::after {
        width: 100%;
      }
    }

    :global(.dark) & {
      color: var(--color-text-primary-dark, #f9fafb);

      &:hover {
        color: var(--color-primary-dark, #818cf8);
      }

      &.router-link-active {
        color: var(--color-primary-dark, #818cf8);
      }

      &::after {
        background: var(--color-primary-dark, #818cf8);
      }
    }
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.theme-toggle-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--color-border, #dee2e6);
  background: var(--color-bg-primary, white);
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1) rotate(15deg);
    border-color: var(--color-primary, #6366f1);
  }

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #2d2d2d);
    border-color: var(--color-border-dark, #333333);

    &:hover {
      border-color: var(--color-primary-dark, #818cf8);
    }
  }
}

.mobile-menu-toggle {
  display: none;
  padding: 0.5rem;
  background: none;
  border: none;
  color: var(--color-text-primary, #333);
  cursor: pointer;

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }

  @media (max-width: 768px) {
    display: block;
  }
}

.mobile-menu {
  background: var(--color-bg-primary, white);
  border-top: 1px solid var(--color-border, #dee2e6);
  padding: 1rem 0;

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #1a1a1a);
    border-top-color: var(--color-border-dark, #333333);
  }
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  a {
    padding: 0.75rem 1rem;
    color: var(--color-text-primary, #333);
    text-decoration: none;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-bg-secondary, #f9fafb);
      color: var(--color-primary, #6366f1);
    }

    &.router-link-active {
      background: var(--color-bg-secondary, #f9fafb);
      color: var(--color-primary, #6366f1);
    }

    :global(.dark) & {
      color: var(--color-text-primary-dark, #f9fafb);

      &:hover {
        background: var(--color-bg-secondary-dark-hover, #2d2d2d);
        color: var(--color-primary-dark, #818cf8);
      }

      &.router-link-active {
        background: var(--color-bg-secondary-dark-hover, #2d2d2d);
        color: var(--color-primary-dark, #818cf8);
      }
    }
  }
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.login-button {
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, var(--color-primary, #6366f1), var(--color-secondary, #8b5cf6));
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  :global(.dark) & {
    background: linear-gradient(135deg, var(--color-primary-dark, #818cf8), var(--color-secondary-dark, #a78bfa));
    box-shadow: 0 2px 8px rgba(129, 140, 248, 0.2);

    &:hover {
      box-shadow: 0 4px 12px rgba(129, 140, 248, 0.4);
    }
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
  background: var(--color-bg-primary, white);
  border: 1px solid var(--color-border, #dee2e6);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-primary, #6366f1);
    background: var(--color-bg-secondary, #f8f9fa);
  }

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #2d2d2d);
    border-color: var(--color-border-dark, #333333);

    &:hover {
      border-color: var(--color-primary-dark, #818cf8);
      background: var(--color-bg-secondary-dark-hover, #3d3d3d);
    }
  }
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-primary, #6366f1), var(--color-secondary, #8b5cf6));
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;

  :global(.dark) & {
    background: linear-gradient(135deg, var(--color-primary-dark, #818cf8), var(--color-secondary-dark, #a78bfa));
  }
}

.user-name {
  font-weight: 500;
  color: var(--color-text-primary, #333);
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.chevron {
  color: var(--color-text-secondary, #6b7280);
  transition: transform 0.2s;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.user-button:hover .chevron {
  color: var(--color-primary, #6366f1);

  :global(.dark) & {
    color: var(--color-primary-dark, #818cf8);
  }
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
  background: var(--color-bg-primary, white);
  border: 1px solid var(--color-border, #dee2e6);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  min-width: 260px;
  overflow: hidden;

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333333);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  }
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
  background: linear-gradient(135deg, var(--color-primary, #6366f1), var(--color-secondary, #8b5cf6));
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 1.125rem;
  flex-shrink: 0;

  :global(.dark) & {
    background: linear-gradient(135deg, var(--color-primary-dark, #818cf8), var(--color-secondary-dark, #a78bfa));
  }
}

.menu-info {
  flex: 1;
  min-width: 0;
}

.menu-name {
  font-weight: 600;
  color: var(--color-text-primary, #333);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.menu-email {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6b7280);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.menu-divider {
  height: 1px;
  background: var(--color-border, #dee2e6);

  :global(.dark) & {
    background: var(--color-border-dark, #333333);
  }
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
  color: var(--color-text-primary, #333);

  svg {
    color: var(--color-text-secondary, #6b7280);
  }

  &:hover {
    background: var(--color-bg-secondary, #f8f9fa);

    svg {
      color: var(--color-primary, #6366f1);
    }
  }

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);

    svg {
      color: var(--color-text-secondary-dark, #9ca3af);
    }

    &:hover {
      background: var(--color-bg-secondary-dark-hover, #2d2d2d);

      svg {
        color: var(--color-primary-dark, #818cf8);
      }
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
