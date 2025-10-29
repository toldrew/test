<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import type { Tournament } from '@/types'

interface Props {
  modelValue: boolean
  tournament: Tournament | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [data: { name: string; description?: string; startDate?: Date; endDate?: Date; defaultLocation?: string }]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formData = ref({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  defaultLocation: ''
})

const errors = ref<{ name?: string; dates?: string }>({})

watch(() => props.tournament, (tournament) => {
  if (tournament) {
    formData.value = {
      name: tournament.name,
      description: tournament.description || '',
      startDate: tournament.startDate ? formatDateForInput(tournament.startDate) : '',
      endDate: tournament.endDate ? formatDateForInput(tournament.endDate) : '',
      defaultLocation: tournament.defaultLocation || ''
    }
  }
}, { immediate: true })

function formatDateForInput(date: Date): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function validateForm(): boolean {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'Название турнира обязательно'
    return false
  }

  if (formData.value.name.trim().length < 3) {
    errors.value.name = 'Название должно содержать минимум 3 символа'
    return false
  }

  if (formData.value.startDate && formData.value.endDate) {
    const start = new Date(formData.value.startDate)
    const end = new Date(formData.value.endDate)
    if (end < start) {
      errors.value.dates = 'Дата окончания не может быть раньше даты начала'
      return false
    }
  }

  return true
}

function handleSubmit() {
  if (!validateForm()) return

  const data = {
    name: formData.value.name.trim(),
    description: formData.value.description.trim() || undefined,
    startDate: formData.value.startDate ? new Date(formData.value.startDate) : undefined,
    endDate: formData.value.endDate ? new Date(formData.value.endDate) : undefined,
    defaultLocation: formData.value.defaultLocation.trim() || undefined
  }

  emit('save', data)
  isOpen.value = false
}

function handleCancel() {
  isOpen.value = false
}
</script>

<template>
  <BaseModal v-model="isOpen" title="Редактировать турнир" max-width="700px">
    <form @submit.prevent="handleSubmit" class="edit-tournament-form">
      <div class="form-group">
        <label for="tournament-name" class="form-label">
          Название турнира <span class="required">*</span>
        </label>
        <input
          id="tournament-name"
          v-model="formData.name"
          type="text"
          class="form-input"
          :class="{ 'has-error': errors.name }"
          placeholder="Введите название турнира"
          maxlength="100"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="tournament-description" class="form-label">Описание</label>
        <textarea
          id="tournament-description"
          v-model="formData.description"
          class="form-textarea"
          placeholder="Добавьте описание турнира"
          rows="3"
          maxlength="500"
        ></textarea>
        <span class="form-hint">
          {{ formData.description.length }} / 500 символов
        </span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="start-date" class="form-label">Дата начала</label>
          <input
            id="start-date"
            v-model="formData.startDate"
            type="datetime-local"
            class="form-input"
            :class="{ 'has-error': errors.dates }"
          />
        </div>

        <div class="form-group">
          <label for="end-date" class="form-label">Дата окончания</label>
          <input
            id="end-date"
            v-model="formData.endDate"
            type="datetime-local"
            class="form-input"
            :class="{ 'has-error': errors.dates }"
          />
        </div>
      </div>

      <span v-if="errors.dates" class="error-message">{{ errors.dates }}</span>

      <div class="form-group">
        <label for="default-location" class="form-label">Место проведения по умолчанию</label>
        <input
          id="default-location"
          v-model="formData.defaultLocation"
          type="text"
          class="form-input"
          placeholder="Например: Стадион 'Центральный'"
          maxlength="200"
        />
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-cancel" @click="handleCancel">
        Отмена
      </button>
      <button type="button" class="btn btn-primary" @click="handleSubmit">
        Сохранить изменения
      </button>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
.edit-tournament-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
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

.form-textarea {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;
  background: var(--color-bg-primary, #fff);
  color: var(--color-text-primary, #111);
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: var(--color-primary, #6366f1);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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
