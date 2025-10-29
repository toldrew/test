import { ref, watch, type Ref } from 'vue'

export interface UseLocalStorageOptions<T> {
  serializer?: {
    read: (raw: string) => T
    write: (value: T) => string
  }
  onError?: (error: unknown) => void
  writeDefaults?: boolean
}

/**
 * Reactive localStorage composable
 * Automatically syncs ref value with localStorage
 * 
 * @param key - localStorage key
 * @param defaultValue - default value if key doesn't exist
 * @param options - serialization and error handling options
 * 
 * @example
 * const theme = useLocalStorage('theme', 'light')
 * theme.value = 'dark' // automatically persisted
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {}
): Ref<T> {
  const {
    serializer = {
      read: (v: string) => JSON.parse(v) as T,
      write: (v: T) => JSON.stringify(v)
    },
    onError = (e) => console.error(e),
    writeDefaults = true
  } = options

  const data = ref(defaultValue) as Ref<T>

  // Read initial value from localStorage
  try {
    const rawValue = localStorage.getItem(key)
    if (rawValue !== null) {
      data.value = serializer.read(rawValue)
    } else if (writeDefaults) {
      // Write default value to localStorage if it doesn't exist
      localStorage.setItem(key, serializer.write(defaultValue))
    }
  } catch (error) {
    onError(error)
  }

  // Watch for changes and sync to localStorage
  watch(
    data,
    (newValue) => {
      try {
        if (newValue === null) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, serializer.write(newValue))
        }
      } catch (error) {
        onError(error)
      }
    },
    { deep: true }
  )

  return data
}

/**
 * Date-aware JSON serializer for use with useLocalStorage
 */
export const dateAwareSerializer = {
  read: (raw: string) => {
    return JSON.parse(raw, (key, value) => {
      // Convert ISO date strings back to Date objects
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value)
      }
      return value
    })
  },
  write: (value: unknown) => JSON.stringify(value)
}
