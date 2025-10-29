import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'auth-store'
const STORAGE_VERSION = 1

export interface User {
  id: string
  email: string
  passwordHash: string
  name?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

interface StorageData {
  version: number
  users: User[]
  currentUserId: string | null
}

async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    // Fallback for environments without crypto.subtle (like tests)
    return btoa(password)
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const users = ref<User[]>([])
  const currentUserId = ref<string | null>(null)

  // Load initial state from localStorage
  loadFromStorage()

  // Watch for state changes and persist to localStorage
  watch(
    [users, currentUserId],
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  // Getters
  const currentUser = computed(() => {
    if (!currentUserId.value) return null
    return users.value.find(u => u.id === currentUserId.value) || null
  })

  const isAuthenticated = computed(() => currentUser.value !== null)

  const userInitials = computed(() => {
    if (!currentUser.value) return ''
    if (currentUser.value.name) {
      const names = currentUser.value.name.trim().split(/\s+/)
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase()
      }
      return names[0][0].toUpperCase()
    }
    return currentUser.value.email[0].toUpperCase()
  })

  const userDisplayName = computed(() => {
    if (!currentUser.value) return ''
    return currentUser.value.name || currentUser.value.email
  })

  // Actions
  async function register(
    email: string,
    password: string,
    name?: string
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    // Validation
    if (!email || !email.trim()) {
      return { success: false, error: 'Введите email' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Некорректный формат email' }
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Пароль должен содержать минимум 6 символов' }
    }

    // Check if user already exists
    const existingUser = users.value.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return { success: false, error: 'Пользователь с таким email уже существует' }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      passwordHash,
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    users.value.push(user)
    currentUserId.value = user.id

    return { success: true, user }
  }

  async function login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    // Validation
    if (!email || !email.trim()) {
      return { success: false, error: 'Введите email' }
    }

    if (!password || !password.trim()) {
      return { success: false, error: 'Введите пароль' }
    }

    // Find user
    const user = users.value.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return { success: false, error: 'Неверный email или пароль' }
    }

    // Check password
    const passwordHash = await hashPassword(password)
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Неверный email или пароль' }
    }

    currentUserId.value = user.id

    return { success: true, user }
  }

  function logout(): void {
    currentUserId.value = null
  }

  function updateUserProfile(updates: Partial<Pick<User, 'name' | 'avatar'>>): void {
    if (!currentUser.value) return

    Object.assign(currentUser.value, updates, { updatedAt: new Date() })
  }

  function loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const data: StorageData = JSON.parse(raw, (key, value) => {
        // Convert ISO date strings back to Date objects
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value)
        }
        return value
      })

      // Check version and migrate if needed
      if (data.version !== STORAGE_VERSION) {
        console.warn('Auth storage version mismatch, migration may be needed')
      }

      users.value = data.users || []
      currentUserId.value = data.currentUserId || null
    } catch (error) {
      console.error('Failed to load auth store from localStorage:', error)
    }
  }

  function saveToStorage(): void {
    try {
      const data: StorageData = {
        version: STORAGE_VERSION,
        users: users.value,
        currentUserId: currentUserId.value
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save auth store to localStorage:', error)
    }
  }

  function clearAllData(): void {
    users.value = []
    currentUserId.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    // State
    users,
    currentUserId,

    // Getters
    currentUser,
    isAuthenticated,
    userInitials,
    userDisplayName,

    // Actions
    register,
    login,
    logout,
    updateUserProfile,
    clearAllData
  }
})
