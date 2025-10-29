<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { useTournamentStore } from '@/stores/tournamentStore'
import { TournamentType } from '@/types'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'created': [tournamentId: string]
}>()

const store = useTournamentStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Form fields
const tournamentName = ref('')
const numberOfTeams = ref(4)
const numberOfRounds = ref(1)
const tournamentType = ref<TournamentType>(TournamentType.GROUPS)
const selectedTeamIds = ref<string[]>([])
const newTeamName = ref('')
const newTeamLogo = ref('')
const errors = ref<Record<string, string>>({})

// Available teams (existing + newly created)
const availableTeams = computed(() => {
  return [...store.currentUserTeams]
})

function validateForm(): boolean {
  errors.value = {}

  if (!tournamentName.value.trim()) {
    errors.value.name = 'Название турнира обязательно'
  }

  if (numberOfTeams.value < 2) {
    errors.value.teams = 'Минимум 2 команды'
  }

  if (numberOfRounds.value < 1) {
    errors.value.rounds = 'Минимум 1 раунд'
  }

  if (selectedTeamIds.value.length < 2) {
    errors.value.selection = 'Выберите минимум 2 команды'
  }

  return Object.keys(errors.value).length === 0
}

function addNewTeam() {
  if (!newTeamName.value.trim()) return

  const team = store.createTeam({
    name: newTeamName.value.trim(),
    logo: newTeamLogo.value || undefined
  })

  selectedTeamIds.value.push(team.id)
  newTeamName.value = ''
  newTeamLogo.value = ''
}

function toggleTeamSelection(teamId: string) {
  const index = selectedTeamIds.value.indexOf(teamId)
  if (index > -1) {
    selectedTeamIds.value.splice(index, 1)
  } else {
    selectedTeamIds.value.push(teamId)
  }
}

function autoGenerateTeams() {
  const count = numberOfTeams.value - selectedTeamIds.value.length
  if (count <= 0) return

  for (let i = 0; i < count; i++) {
    const teamNumber = availableTeams.value.length + i + 1
    const team = store.createTeam({
      name: `Команда ${teamNumber}`
    })
    selectedTeamIds.value.push(team.id)
  }
}

function handleLogoUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    newTeamLogo.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    // Create tournament
    const tournament = store.createTournament({
      name: tournamentName.value.trim(),
      type: tournamentType.value,
      numberOfRounds: numberOfRounds.value
    })

    // Assign selected teams
    store.assignTeamsToTournament(tournament.id, selectedTeamIds.value)

    // Emit success
    emit('created', tournament.id)
    
    // Reset form and close
    resetForm()
    isOpen.value = false
  } catch (error) {
    console.error('Failed to create tournament:', error)
    errors.value.submit = 'Не удалось создать турнир'
  }
}

function resetForm() {
  tournamentName.value = ''
  numberOfTeams.value = 4
  numberOfRounds.value = 1
  tournamentType.value = TournamentType.GROUPS
  selectedTeamIds.value = []
  newTeamName.value = ''
  newTeamLogo.value = ''
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
    title="Создать турнир"
    max-width="700px"
  >
    <form @submit.prevent="handleSubmit" class="tournament-form">
      <!-- Tournament Name -->
      <div class="form-group">
        <label for="tournament-name" class="form-label">Название турнира</label>
        <input
          id="tournament-name"
          v-model="tournamentName"
          type="text"
          class="form-input"
          placeholder="Например: Летняя лига 2024"
          :class="{ error: errors.name }"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <!-- Tournament Type -->
      <div class="form-group">
        <label class="form-label">Тип турнира</label>
        <div class="radio-group">
          <label class="radio-label">
            <input
              v-model="tournamentType"
              type="radio"
              :value="TournamentType.GROUPS"
            />
            <span>Групповой</span>
          </label>
          <label class="radio-label">
            <input
              v-model="tournamentType"
              type="radio"
              :value="TournamentType.PLAYOFF"
            />
            <span>Плей-офф</span>
          </label>
        </div>
      </div>

      <!-- Number of Teams and Rounds -->
      <div class="form-row">
        <div class="form-group">
          <label for="num-teams" class="form-label">Количество команд</label>
          <input
            id="num-teams"
            v-model.number="numberOfTeams"
            type="number"
            min="2"
            max="32"
            class="form-input"
            :class="{ error: errors.teams }"
          />
          <span v-if="errors.teams" class="error-message">{{ errors.teams }}</span>
        </div>

        <div class="form-group">
          <label for="num-rounds" class="form-label">Количество раундов</label>
          <input
            id="num-rounds"
            v-model.number="numberOfRounds"
            type="number"
            min="1"
            max="10"
            class="form-input"
            :class="{ error: errors.rounds }"
          />
          <span v-if="errors.rounds" class="error-message">{{ errors.rounds }}</span>
        </div>
      </div>

      <!-- Team Selection -->
      <div class="form-group">
        <div class="section-header">
          <label class="form-label">Выбрать команды</label>
          <button
            type="button"
            class="btn-auto-generate"
            @click="autoGenerateTeams"
            :disabled="selectedTeamIds.length >= numberOfTeams"
          >
            Автозаполнение
          </button>
        </div>

        <div v-if="availableTeams.length > 0" class="team-list">
          <label
            v-for="team in availableTeams"
            :key="team.id"
            class="team-checkbox"
          >
            <input
              type="checkbox"
              :checked="selectedTeamIds.includes(team.id)"
              @change="toggleTeamSelection(team.id)"
              :disabled="!selectedTeamIds.includes(team.id) && selectedTeamIds.length >= numberOfTeams"
            />
            <div class="team-info">
              <div v-if="team.logo" class="team-logo">
                <img :src="team.logo" :alt="team.name" />
              </div>
              <span class="team-name">{{ team.name }}</span>
            </div>
          </label>
        </div>

        <!-- Add New Team Inline -->
        <div class="add-team-section">
          <h4 class="section-subtitle">Добавить новую команду</h4>
          <div class="add-team-form">
            <input
              v-model="newTeamName"
              type="text"
              class="form-input"
              placeholder="Название команды"
              @keypress.enter.prevent="addNewTeam"
            />
            <div class="logo-upload">
              <label for="team-logo" class="logo-upload-label">
                <span v-if="!newTeamLogo">📷 Эмблема</span>
                <img v-else :src="newTeamLogo" alt="Logo preview" class="logo-preview" />
              </label>
              <input
                id="team-logo"
                type="file"
                accept="image/*"
                class="logo-input"
                @change="handleLogoUpload"
              />
            </div>
            <button
              type="button"
              class="btn-add-team"
              @click="addNewTeam"
              :disabled="!newTeamName.trim() || selectedTeamIds.length >= numberOfTeams"
            >
              Добавить
            </button>
          </div>
        </div>

        <!-- Selected Teams Summary -->
        <div class="selected-summary">
          <span class="summary-text">
            Выбрано: {{ selectedTeamIds.length }} / {{ numberOfTeams }}
          </span>
        </div>

        <span v-if="errors.selection" class="error-message">{{ errors.selection }}</span>
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
      <button type="button" class="btn btn-primary" @click="handleSubmit">
        Создать турнир
      </button>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
.tournament-form {
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

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-bg-primary, #fff);
  color: var(--color-text-primary, #111);
  transition: all 0.2s;
  
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--color-primary, #6366f1);
  }
  
  input[type="radio"] {
    cursor: pointer;
  }
  
  :global(.dark) & {
    border-color: var(--color-border-dark, #404040);
    
    &:hover {
      border-color: var(--color-primary-dark, #818cf8);
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-auto-generate {
  padding: 0.5rem 1rem;
  background: var(--color-bg-secondary, #f3f4f6);
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: var(--color-primary, #6366f1);
    color: white;
    border-color: var(--color-primary, #6366f1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
    border-color: var(--color-border-dark, #404040);
    
    &:hover:not(:disabled) {
      background: var(--color-primary-dark, #818cf8);
      border-color: var(--color-primary-dark, #818cf8);
    }
  }
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
  background: var(--color-bg-secondary, #f9fafb);
  border-radius: 8px;
  
  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
  }
}

.team-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--color-primary, #6366f1);
  }
  
  input[type="checkbox"] {
    cursor: pointer;
  }
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
    
    &:hover {
      border-color: var(--color-primary-dark, #818cf8);
    }
  }
}

.team-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.team-logo {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.team-name {
  font-weight: 500;
  color: var(--color-text-primary, #111);
  
  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.add-team-section {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-bg-secondary, #f9fafb);
  border-radius: 8px;
  
  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
  }
}

.section-subtitle {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary, #111);
  
  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.add-team-form {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
}

.logo-upload {
  position: relative;
}

.logo-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--color-primary, #6366f1);
  }
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #404040);
  }
}

.logo-preview {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.logo-input {
  display: none;
}

.btn-add-team {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary, #6366f1);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: var(--color-primary-hover, #4f46e5);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  :global(.dark) & {
    background: var(--color-primary-dark, #818cf8);
    
    &:hover:not(:disabled) {
      background: var(--color-primary-dark-hover, #6366f1);
    }
  }
}

.selected-summary {
  padding: 0.75rem;
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 6px;
  text-align: center;
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
  }
}

.summary-text {
  font-weight: 600;
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
  
  .add-team-form {
    grid-template-columns: 1fr;
  }
}
</style>
