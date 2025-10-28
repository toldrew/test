<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { computed } from 'vue'

const themeStore = useThemeStore()

const isDark = computed(() => themeStore.currentTheme === 'dark')

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggleTheme"
  >
    <Transition name="theme-icon" mode="out-in">
      <svg
        v-if="isDark"
        key="moon"
        class="theme-toggle__icon"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 10.5C16.8 14.5 13.5 17.8 9.5 18C5.5 18.2 2 14.9 2 11C2 7.4 4.7 4.4 8.2 4C8.2 4 8.5 4 8.7 4.1C9.2 4.3 9.4 4.9 9.1 5.4C8.6 6.3 8.3 7.3 8.3 8.4C8.3 11.5 10.8 14 13.9 14C15 14 16 13.7 16.9 13.2C17.4 12.9 18 13.1 18.2 13.6C18.3 13.8 18.3 14.1 18.3 14.1C18.3 14.1 17.3 10.1 17 10.5Z"
          fill="currentColor"
        />
      </svg>
      <svg
        v-else
        key="sun"
        class="theme-toggle__icon"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="3" fill="currentColor"/>
        <path
          d="M10 1V3M10 17V19M19 10H17M3 10H1M16.657 16.657L15.243 15.243M4.757 4.757L3.343 3.343M16.657 3.343L15.243 4.757M4.757 15.243L3.343 16.657"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </Transition>
  </button>
</template>

<style scoped lang="scss">
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-surface);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &__icon {
    display: block;
  }
}

.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.theme-icon-enter-from {
  transform: rotate(-90deg) scale(0.5);
  opacity: 0;
}

.theme-icon-leave-to {
  transform: rotate(90deg) scale(0.5);
  opacity: 0;
}
</style>
