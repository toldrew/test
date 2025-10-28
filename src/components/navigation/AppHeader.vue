<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import BaseIconButton from '@/components/ui/BaseIconButton.vue'

const isMobileMenuOpen = ref(false)

const emit = defineEmits<{
  openLoginModal: []
}>()

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLoginClick = () => {
  emit('openLoginModal')
  closeMobileMenu()
}

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/about', label: 'About' }
]
</script>

<template>
  <header class="app-header">
    <div class="app-header__container">
      <div class="app-header__brand">
        <RouterLink to="/" class="app-header__logo" @click="closeMobileMenu">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
            <path d="M8 16L14 22L24 10" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="app-header__logo-text">App</span>
        </RouterLink>
      </div>

      <nav class="app-header__nav" :class="{ 'app-header__nav--open': isMobileMenuOpen }">
        <div class="app-header__nav-links">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="app-header__nav-link"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <div class="app-header__actions">
          <ThemeToggle />
          <button
            type="button"
            class="app-header__login-btn"
            @click="handleLoginClick"
          >
            Login / Register
          </button>
        </div>
      </nav>

      <BaseIconButton
        class="app-header__hamburger"
        aria-label="Toggle mobile menu"
        @click="toggleMobileMenu"
      >
        <svg
          v-if="!isMobileMenuOpen"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg
          v-else
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </BaseIconButton>
    </div>

    <div
      v-if="isMobileMenuOpen"
      class="app-header__overlay"
      @click="closeMobileMenu"
    />
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background-color: var(--color-background-alt);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    gap: 2rem;
  }

  &__brand {
    display: flex;
    align-items: center;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--color-text-primary);
    font-weight: 600;
    font-size: 1.25rem;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  &__logo-text {
    @media (max-width: 768px) {
      display: none;
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex: 1;
    justify-content: space-between;

    @media (max-width: 768px) {
      position: fixed;
      top: 4rem;
      right: 0;
      width: 280px;
      height: calc(100vh - 4rem);
      background-color: var(--color-background-elevated);
      border-left: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      flex-direction: column;
      justify-content: flex-start;
      padding: 2rem 1rem;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      z-index: 101;

      &--open {
        transform: translateX(0);
      }
    }
  }

  &__nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    @media (max-width: 768px) {
      flex-direction: column;
      width: 100%;
      gap: 0;
    }
  }

  &__nav-link {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
    padding: 0.5rem 0;

    &:hover {
      color: var(--color-text-primary);
    }

    &.router-link-active {
      color: var(--color-primary);
    }

    @media (max-width: 768px) {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 6px;

      &:hover {
        background-color: var(--color-surface);
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 768px) {
      width: 100%;
      margin-top: auto;
      flex-direction: column;
      gap: 0.75rem;
    }
  }

  &__login-btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    white-space: nowrap;

    &:hover {
      background-color: var(--color-primary-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__hamburger {
    display: none;

    @media (max-width: 768px) {
      display: inline-flex;
    }
  }

  &__overlay {
    display: none;

    @media (max-width: 768px) {
      display: block;
      position: fixed;
      top: 4rem;
      left: 0;
      width: 100%;
      height: calc(100vh - 4rem);
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 100;
    }
  }
}
</style>
