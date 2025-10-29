import { computed, watch } from 'vue'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'light' | 'dark'

/**
 * Theme management composable
 * Handles theme switching and persistence
 */
export function useTheme() {
  const theme = useLocalStorage<Theme>('theme', 'light')

  const isDark = computed(() => theme.value === 'dark')

  // Apply theme class to document element
  watch(
    theme,
    (newTheme) => {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(newTheme)
    },
    { immediate: true }
  )

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme
  }
}
