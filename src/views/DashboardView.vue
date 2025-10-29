<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTournamentStore } from '@/stores/tournamentStore'
import TournamentCard from '@/components/tournament/TournamentCard.vue'
import TeamCard from '@/components/team/TeamCard.vue'
import EditTeamModal from '@/components/team/EditTeamModal.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import type { Tournament, Team } from '@/types'

const router = useRouter()
const store = useTournamentStore()

const tournaments = computed(() => store.currentUserTournaments)
const teams = computed(() => store.currentUserTeams)

const showDeleteTournamentModal = ref(false)
const showDeleteTeamModal = ref(false)
const showEditTeamModal = ref(false)
const showAddTeamForm = ref(false)
const selectedTournament = ref<Tournament | null>(null)
const selectedTeam = ref<Team | null>(null)

const tournamentSortBy = ref<'date' | 'name' | 'status'>('date')
const teamSortBy = ref<'date' | 'name'>('date')

const newTeamName = ref('')
const newTeamLogo = ref('')
const teamFormErrors = ref<{ name?: string }>({})

const sortedTournaments = computed(() => {
  const list = [...tournaments.value]
  
  switch (tournamentSortBy.value) {
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name))
    case 'status':
      return list.sort((a, b) => {
        const getStatus = (t: Tournament) => {
          const stats = store.getTournamentStats(t.id)
          if (!stats) return 0
          if (stats.completedMatches === 0) return 0
          if (stats.completedMatches === stats.totalMatches) return 2
          return 1
        }
        return getStatus(b) - getStatus(a)
      })
    case 'date':
    default:
      return list.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }
})

const sortedTeams = computed(() => {
  const list = [...teams.value]
  
  switch (teamSortBy.value) {
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name))
    case 'date':
    default:
      return list.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }
})

function handleTournamentClick(tournament: Tournament) {
  router.push(`/dashboard/tournaments/${tournament.id}`)
}

function handleDeleteTournament(tournament: Tournament) {
  selectedTournament.value = tournament
  showDeleteTournamentModal.value = true
}

function confirmDeleteTournament() {
  if (selectedTournament.value) {
    store.deleteTournament(selectedTournament.value.id)
    selectedTournament.value = null
    showDeleteTournamentModal.value = false
  }
}

function handleEditTeam(team: Team) {
  selectedTeam.value = team
  showEditTeamModal.value = true
}

function handleSaveTeam(data: { name: string; logo?: string }) {
  if (selectedTeam.value) {
    store.updateTeam(selectedTeam.value.id, data)
  }
}

function handleDeleteTeam(team: Team) {
  selectedTeam.value = team
  showDeleteTeamModal.value = true
}

function confirmDeleteTeam() {
  if (selectedTeam.value) {
    store.deleteTeam(selectedTeam.value.id)
    selectedTeam.value = null
    showDeleteTeamModal.value = false
  }
}

function validateTeamForm(): boolean {
  teamFormErrors.value = {}

  if (!newTeamName.value.trim()) {
    teamFormErrors.value.name = 'Название команды обязательно'
    return false
  }

  if (newTeamName.value.trim().length < 2) {
    teamFormErrors.value.name = 'Название должно содержать минимум 2 символа'
    return false
  }

  return true
}

function handleAddTeam() {
  if (!validateTeamForm()) return

  store.createTeam({
    name: newTeamName.value.trim(),
    logo: newTeamLogo.value.trim() || undefined
  })

  newTeamName.value = ''
  newTeamLogo.value = ''
  showAddTeamForm.value = false
}

function handleCancelAddTeam() {
  newTeamName.value = ''
  newTeamLogo.value = ''
  teamFormErrors.value = {}
  showAddTeamForm.value = false
}
</script>

<template>
  <div class="dashboard-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Панель управления</h1>
        <p class="page-subtitle">Управляйте своими турнирами и командами</p>
      </div>

      <!-- Tournaments Section -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">Ваши турниры</h2>
          <div class="section-controls">
            <select v-model="tournamentSortBy" class="sort-select">
              <option value="date">По дате создания</option>
              <option value="name">По имени</option>
              <option value="status">По статусу</option>
            </select>
          </div>
        </div>

        <div v-if="sortedTournaments.length > 0" class="cards-grid">
          <TournamentCard
            v-for="tournament in sortedTournaments"
            :key="tournament.id"
            :tournament="tournament"
            @click="handleTournamentClick(tournament)"
            @delete="handleDeleteTournament(tournament)"
          />
        </div>

        <div v-else class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h18v18H3z" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          <h3>У вас пока нет турниров</h3>
          <p>Создайте свой первый турнир, чтобы начать организовывать матчи</p>
          <button class="btn btn-primary" @click="router.push('/')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Создать турнир
          </button>
        </div>
      </section>

      <!-- Teams Section -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">Ваши команды</h2>
          <div class="section-controls">
            <select v-model="teamSortBy" class="sort-select">
              <option value="date">По дате создания</option>
              <option value="name">По имени</option>
            </select>
            <button class="btn btn-primary" @click="showAddTeamForm = !showAddTeamForm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Добавить команду
            </button>
          </div>
        </div>

        <div v-if="showAddTeamForm" class="add-team-form">
          <h3 class="form-title">Создать новую команду</h3>
          <div class="form-group">
            <label for="new-team-name" class="form-label">
              Название команды <span class="required">*</span>
            </label>
            <input
              id="new-team-name"
              v-model="newTeamName"
              type="text"
              class="form-input"
              :class="{ 'has-error': teamFormErrors.name }"
              placeholder="Введите название команды"
              maxlength="100"
            />
            <span v-if="teamFormErrors.name" class="error-message">{{ teamFormErrors.name }}</span>
          </div>

          <div class="form-group">
            <label for="new-team-logo" class="form-label">Эмблема (URL)</label>
            <input
              id="new-team-logo"
              v-model="newTeamLogo"
              type="url"
              class="form-input"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary" @click="handleCancelAddTeam">Отмена</button>
            <button class="btn btn-primary" @click="handleAddTeam">Создать команду</button>
          </div>
        </div>

        <div v-if="sortedTeams.length > 0" class="cards-grid">
          <TeamCard
            v-for="team in sortedTeams"
            :key="team.id"
            :team="team"
            @edit="handleEditTeam(team)"
            @delete="handleDeleteTeam(team)"
          />
        </div>

        <div v-else-if="!showAddTeamForm" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          <h3>У вас пока нет команд</h3>
          <p>Создайте команды, чтобы участвовать в турнирах</p>
          <button class="btn btn-primary" @click="showAddTeamForm = true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Добавить команду
          </button>
        </div>
      </section>
    </div>

    <!-- Modals -->
    <DeleteConfirmModal
      v-model="showDeleteTournamentModal"
      title="Удалить турнир?"
      message="Вы уверены, что хотите удалить этот турнир?"
      :item-name="selectedTournament?.name"
      @confirm="confirmDeleteTournament"
      @cancel="showDeleteTournamentModal = false"
    />

    <DeleteConfirmModal
      v-model="showDeleteTeamModal"
      title="Удалить команду?"
      message="Вы уверены, что хотите удалить эту команду? Она будет удалена из всех турниров."
      :item-name="selectedTeam?.name"
      @confirm="confirmDeleteTeam"
      @cancel="showDeleteTeamModal = false"
    />

    <EditTeamModal
      v-model="showEditTeamModal"
      :team="selectedTeam"
      @save="handleSaveTeam"
    />
  </div>
</template>

<style scoped lang="scss">
.dashboard-view {
  min-height: 100vh;
  background: var(--color-bg-secondary, #f9fafb);
  padding: 2rem 1rem;

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #0a0a0a);
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary, #111);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.dashboard-section {
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary, #111);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.section-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  font-size: 0.9rem;
  background: var(--color-bg-primary, #fff);
  color: var(--color-text-primary, #111);
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-primary, #6366f1);
  }

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
    color: var(--color-text-primary-dark, #f9fafb);

    &:focus {
      border-color: var(--color-primary-dark, #818cf8);
    }
  }
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--color-bg-primary, #fff);
  border: 2px dashed var(--color-border, #e5e7eb);
  border-radius: 12px;
  color: var(--color-text-secondary, #6b7280);

  svg {
    margin: 0 auto 1.5rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.5rem;
    color: var(--color-text-primary, #111);
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 2rem;
  }

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
    color: var(--color-text-secondary-dark, #9ca3af);

    h3 {
      color: var(--color-text-primary-dark, #f9fafb);
    }
  }
}

.add-team-form {
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
  }
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: var(--color-text-primary, #111);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary, #111);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.required {
  color: #ef4444;
}

.form-input {
  width: 100%;
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

.error-message {
  display: block;
  margin-top: 0.375rem;
  font-size: 0.875rem;
  color: #ef4444;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  white-space: nowrap;
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

.btn-secondary {
  background: var(--color-bg-secondary, #f3f4f6);
  color: var(--color-text-primary, #111);
  border: 1px solid var(--color-border, #e5e7eb);

  &:hover {
    background: var(--color-bg-secondary-hover, #e5e7eb);
  }

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #2d2d2d);
    color: var(--color-text-primary-dark, #f9fafb);
    border-color: var(--color-border-dark, #404040);

    &:hover {
      background: var(--color-bg-secondary-dark-hover, #3d3d3d);
    }
  }
}

@media (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-controls {
    width: 100%;
    flex-wrap: wrap;

    .sort-select {
      flex: 1;
    }
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
