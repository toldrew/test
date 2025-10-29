<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { useTournamentStore } from '@/stores/tournamentStore'

interface Props {
  modelValue: boolean
  matchId: string | null
  focusOnResult?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  focusOnResult: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'saved': []
}>()

const store = useTournamentStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Form fields
const scheduledDate = ref('')
const scheduledTime = ref('')
const location = ref('')
const homeScore = ref<number | null>(null)
const awayScore = ref<number | null>(null)
const notes = ref('')
const errors = ref<Record<string, string>>({})

// Get match data
const matchData = computed(() => {
  if (!props.matchId) return null
  return store.getMatchById(props.matchId)
})

const homeTeamName = computed(() => {
  if (!matchData.value?.match.homeTeamId) return 'TBD'
  return store.getTeamById(matchData.value.match.homeTeamId)?.name || 'Unknown'
})

const awayTeamName = computed(() => {
  if (!matchData.value?.match.awayTeamId) return 'TBD'
  return store.getTeamById(matchData.value.match.awayTeamId)?.name || 'Unknown'
})

// Watch for match changes and populate form
watch(() => props.matchId, (newMatchId) => {
  if (newMatchId && matchData.value) {
    const match = matchData.value.match
    
    // Parse date and time
    if (match.scheduledDate) {
      const date = new Date(match.scheduledDate)
      scheduledDate.value = date.toISOString().split('T')[0]
      scheduledTime.value = date.toTimeString().slice(0, 5)
    }
    
    location.value = match.location || ''
    
    // Populate result if exists
    if (match.result) {
      homeScore.value = match.result.homeScore
      awayScore.value = match.result.awayScore
      notes.value = match.result.notes || ''
    } else {
      homeScore.value = null
      awayScore.value = null
      notes.value = ''
    }
    
    errors.value = {}
  }
}, { immediate: true })

function validateForm(): boolean {
  errors.value = {}

  if (!scheduledDate.value) {
    errors.value.date = 'Дата обязательна'
  }

  if (!scheduledTime.value) {
    errors.value.time = 'Время обязательно'
  }

  // Validate scores if entering result
  if (homeScore.value !== null || awayScore.value !== null) {
    if (homeScore.value === null) {
      errors.value.homeScore = 'Укажите счет домашней команды'
    }
    if (awayScore.value === null) {
      errors.value.awayScore = 'Укажите счет гостевой команды'
    }
    if (homeScore.value !== null && homeScore.value < 0) {
      errors.value.homeScore = 'Счет не может быть отрицательным'
    }
    if (awayScore.value !== null && awayScore.value < 0) {
      errors.value.awayScore = 'Счет не может быть отрицательным'
    }
  }

  return Object.keys(errors.value).length === 0
}

function handleSave() {
  if (!validateForm() || !props.matchId) return

  try {
    // Update match date/time/location
    const dateTime = new Date(`${scheduledDate.value}T${scheduledTime.value}`)
    store.updateMatch(props.matchId, {
      scheduledDate: dateTime,
      location: location.value || undefined
    })

    // Update result if scores are provided
    if (homeScore.value !== null && awayScore.value !== null) {
      store.recordMatchResult(props.matchId, {
        homeScore: homeScore.value,
        awayScore: awayScore.value,
        notes: notes.value || undefined
      })
    }

    emit('saved')
    resetForm()
    isOpen.value = false
  } catch (error) {
    console.error('Failed to save match:', error)
    errors.value.submit = 'Не удалось сохранить изменения'
  }
}

function resetForm() {
  scheduledDate.value = ''
  scheduledTime.value = ''
  location.value = ''
  homeScore.value = null
  awayScore.value = null
  notes.value = ''
  errors.value = {}
}

function handleClose() {
  resetForm()
  isOpen.value = false
}
</script>

<template>
  <BaseModal
    v-model="isOpen"
    title="Редактировать матч"
    max-width="600px"
  >
    <form v-if="matchData" @submit.prevent="handleSave" class="match-form">
      <!-- Match Teams Display -->
      <div class="match-header">
        <div class="teams-display">
          <span class="team-name">{{ homeTeamName }}</span>
          <span class="vs-text">VS</span>
          <span class="team-name">{{ awayTeamName }}</span>
        </div>
      </div>

      <!-- Date and Time -->
      <div class="form-row">
        <div class="form-group">
          <label for="match-date" class="form-label">Дата</label>
          <input
            id="match-date"
            v-model="scheduledDate"
            type="date"
            class="form-input"
            :class="{ error: errors.date }"
          />
          <span v-if="errors.date" class="error-message">{{ errors.date }}</span>
        </div>

        <div class="form-group">
          <label for="match-time" class="form-label">Время</label>
          <input
            id="match-time"
            v-model="scheduledTime"
            type="time"
            class="form-input"
            :class="{ error: errors.time }"
          />
          <span v-if="errors.time" class="error-message">{{ errors.time }}</span>
        </div>
      </div>

      <!-- Location -->
      <div class="form-group">
        <label for="match-location" class="form-label">Место проведения</label>
        <input
          id="match-location"
          v-model="location"
          type="text"
          class="form-input"
          placeholder="Например: Стадион Центральный"
        />
      </div>

      <!-- Result Section -->
      <div class="result-section">
        <h4 class="section-title">Результат матча</h4>
        
        <div class="form-row">
          <div class="form-group">
            <label for="home-score" class="form-label">{{ homeTeamName }}</label>
            <input
              id="home-score"
              v-model.number="homeScore"
              type="number"
              min="0"
              class="form-input score-input"
              placeholder="0"
              :class="{ error: errors.homeScore }"
            />
            <span v-if="errors.homeScore" class="error-message">{{ errors.homeScore }}</span>
          </div>

          <div class="form-group">
            <label for="away-score" class="form-label">{{ awayTeamName }}</label>
            <input
              id="away-score"
              v-model.number="awayScore"
              type="number"
              min="0"
              class="form-input score-input"
              placeholder="0"
              :class="{ error: errors.awayScore }"
            />
            <span v-if="errors.awayScore" class="error-message">{{ errors.awayScore }}</span>
          </div>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label for="match-notes" class="form-label">Заметки (необязательно)</label>
          <textarea
            id="match-notes"
            v-model="notes"
            class="form-textarea"
            placeholder="Дополнительная информация о матче..."
            rows="3"
          />
        </div>
      </div>

      <!-- Submit Error -->
      <div v-if="errors.submit" class="error-message error-submit">
        {{ errors.submit }}
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-secondary" @click="handleClose">
        Отмена
      </button>
      <button type="button" class="btn btn-primary" @click="handleSave">
        Сохранить
      </button>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
.match-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.match-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-primary, #6366f1), var(--color-secondary, #8b5cf6));
  border-radius: 10px;
  margin-bottom: 0.5rem;
  
  :global(.dark) & {
    background: linear-gradient(135deg, var(--color-primary-dark, #818cf8), var(--color-secondary-dark, #a78bfa));
  }
}

.teams-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

.vs-text {
  font-size: 0.9rem;
  opacity: 0.9;
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

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-bg-primary, #fff);
  color: var(--color-text-primary, #111);
  transition: all 0.2s;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary, #6366f1);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  &.error {
    border-color: #ef4444;
  }
  
  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
    border-color: var(--color-border-dark, #404040);
    color: var(--color-text-primary-dark, #f9fafb);
    
    &:focus {
      border-color: var(--color-primary-dark, #818cf8);
      box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
    }
  }
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.score-input {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.result-section {
  padding: 1.5rem;
  background: var(--color-bg-secondary, #f9fafb);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
  }
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary, #111);
  
  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.error-message {
  font-size: 0.875rem;
  color: #ef4444;
  margin-top: 0.25rem;
}

.error-submit {
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  text-align: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &.btn-primary {
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
  
  &.btn-secondary {
    background: var(--color-bg-secondary, #f3f4f6);
    color: var(--color-text-primary, #111);
    
    &:hover {
      background: var(--color-bg-secondary-hover, #e5e7eb);
    }
    
    :global(.dark) & {
      background: var(--color-bg-secondary-dark, #262626);
      color: var(--color-text-primary-dark, #f9fafb);
      
      &:hover {
        background: var(--color-bg-secondary-dark-hover, #333);
      }
    }
  }
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
