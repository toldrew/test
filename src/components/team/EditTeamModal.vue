<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import type { Team } from '@/types'

interface Props {
  modelValue: boolean
  team: Team | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [data: { name: string; logo?: string }]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formData = ref({
  name: '',
  logo: ''
})

const errors = ref<{ name?: string; logo?: string }>({})
const imagePreview = ref<string>('')
const isLoadingImage = ref(false)

watch(() => props.team, (team) => {
  if (team) {
    formData.value = {
      name: team.name,
      logo: team.logo || ''
    }
    imagePreview.value = team.logo || ''
  }
}, { immediate: true })

function validateForm(): boolean {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'Название команды обязательно'
    return false
  }

  if (formData.value.name.trim().length < 2) {
    errors.value.name = 'Название должно содержать минимум 2 символа'
    return false
  }

  if (formData.value.logo) {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    if (!urlPattern.test(formData.value.logo)) {
      errors.value.logo = 'Введите корректный URL изображения'
      return false
    }
  }

  return true
}

function handleImageUrlChange() {
  if (formData.value.logo) {
    isLoadingImage.value = true
    imagePreview.value = ''
    
    const img = new Image()
    img.onload = () => {
      imagePreview.value = formData.value.logo
      isLoadingImage.value = false
      errors.value.logo = undefined
    }
    img.onerror = () => {
      isLoadingImage.value = false
      errors.value.logo = 'Не удалось загрузить изображение'
      imagePreview.value = ''
    }
    img.src = formData.value.logo
  } else {
    imagePreview.value = ''
    errors.value.logo = undefined
  }
}

function handleSubmit() {
  if (!validateForm()) return

  const data = {
    name: formData.value.name.trim(),
    logo: formData.value.logo.trim() || undefined
  }

  emit('save', data)
  isOpen.value = false
}

function handleCancel() {
  isOpen.value = false
}

const teamInitials = computed(() => {
  return formData.value.name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})
</script>

<template>
  <BaseModal v-model="isOpen" title="Редактировать команду" max-width="600px">
    <form @submit.prevent="handleSubmit" class="edit-team-form">
      <div class="form-group">
        <label for="team-name" class="form-label">
          Название команды <span class="required">*</span>
        </label>
        <input
          id="team-name"
          v-model="formData.name"
          type="text"
          class="form-input"
          :class="{ 'has-error': errors.name }"
          placeholder="Введите название команды"
          maxlength="100"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="team-logo" class="form-label">Эмблема команды (URL)</label>
        <input
          id="team-logo"
          v-model="formData.logo"
          type="url"
          class="form-input"
          :class="{ 'has-error': errors.logo }"
          placeholder="https://example.com/logo.png"
          @blur="handleImageUrlChange"
        />
        <span v-if="errors.logo" class="error-message">{{ errors.logo }}</span>
        <span class="form-hint">
          Введите URL изображения для эмблемы команды
        </span>
      </div>

      <div class="preview-section">
        <div class="preview-label">Предпросмотр:</div>
        <div class="preview-card">
          <div class="team-emblem">
            <div v-if="isLoadingImage" class="loading-spinner"></div>
            <img v-else-if="imagePreview" :src="imagePreview" alt="Предпросмотр эмблемы" />
            <div v-else class="emblem-placeholder">
              {{ teamInitials || '?' }}
            </div>
          </div>
          <div class="preview-name">{{ formData.name || 'Название команды' }}</div>
        </div>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-cancel" @click="handleCancel">
        Отмена
      </button>
      <button type="button" class="btn btn-primary" @click="handleSubmit">
        Сохранить
      </button>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
.edit-team-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text-primary, #111);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.required {
  color: #ef4444;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: var(--color-bg-primary, #fff);
  color: var(--color-text-primary, #111);

  &:focus {
    outline: none;
    border-color: var(--color-primary, #6366f1);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &.has-error {
    border-color: #ef4444;

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
    border-color: var(--color-border-dark, #404040);
    color: var(--color-text-primary-dark, #f9fafb);

    &:focus {
      border-color: var(--color-primary-dark, #818cf8);
      box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1);
    }
  }
}

.form-hint {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6b7280);

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.error-message {
  font-size: 0.875rem;
  color: #ef4444;
}

.preview-section {
  padding: 1.5rem;
  background: var(--color-bg-secondary, #f9fafb);
  border-radius: 12px;
  border: 1px solid var(--color-border, #e5e7eb);

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
    border-color: var(--color-border-dark, #404040);
  }
}

.preview-label {
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text-primary, #111);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.preview-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-bg-primary, #fff);
  border-radius: 8px;
  border: 1px solid var(--color-border, #e5e7eb);

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
  }
}

.team-emblem {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--color-border, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :global(.dark) & {
    border-color: var(--color-border-dark, #333);
  }
}

.emblem-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary, #6366f1), var(--color-secondary, #8b5cf6));
  color: white;
  font-size: 1.5rem;
  font-weight: 700;

  :global(.dark) & {
    background: linear-gradient(135deg, var(--color-primary-dark, #818cf8), var(--color-secondary-dark, #a78bfa));
  }
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border, #e5e7eb);
  border-top-color: var(--color-primary, #6366f1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.preview-name {
  flex: 1;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary, #111);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.btn {
  padding: 0.625rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-cancel {
  background: var(--color-bg-secondary, #f3f4f6);
  color: var(--color-text-primary, #111);

  &:hover {
    background: var(--color-bg-secondary-hover, #e5e7eb);
  }

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #2d2d2d);
    color: var(--color-text-primary-dark, #f9fafb);

    &:hover {
      background: var(--color-bg-secondary-dark-hover, #3d3d3d);
    }
  }
}

.btn-primary {
  background: var(--color-primary, #6366f1);
  color: white;

  &:hover {
    background: var(--color-primary-hover, #4f46e5);
  }

  :global(.dark) & {
    background: var(--color-primary-dark, #818cf8);

    &:hover {
      background: var(--color-primary-dark-hover, #6366f1);
    }
  }
}
</style>
