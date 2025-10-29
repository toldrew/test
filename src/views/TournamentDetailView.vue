<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTournamentStore } from '@/stores/tournamentStore'
import TournamentSchedule from '@/components/tournament/TournamentSchedule.vue'
import MatchEditorModal from '@/components/tournament/MatchEditorModal.vue'
import EditTournamentModal from '@/components/tournament/EditTournamentModal.vue'

const route = useRoute()
const router = useRouter()
const store = useTournamentStore()

const tournamentId = computed(() => route.params.id as string)
const tournament = computed(() => store.getTournamentById(tournamentId.value))
const stats = computed(() => store.getTournamentStats(tournamentId.value))

const showMatchEditor = ref(false)
const showEditModal = ref(false)
const selectedMatchId = ref<string | null>(null)

function handleEditMatch(matchId: string) {
  selectedMatchId.value = matchId
  showMatchEditor.value = true
}

function handleEnterResult(matchId: string) {
  selectedMatchId.value = matchId
  showMatchEditor.value = true
}

function handleEditTournament() {
  showEditModal.value = true
}

function handleSaveTournament(data: any) {
  store.updateTournamentMeta(tournamentId.value, data)
}

function handleBack() {
  router.push('/dashboard')
}

function handleExport() {
  // Stubbed for now - will be implemented in export ticket
  alert('Экспорт будет реализован в следующей задаче')
}
</script>

<template>
  <div class="tournament-detail-view">
    <div v-if="tournament" class="container">
      <div class="header">
        <button class="back-btn" @click="handleBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Назад к дашборду
        </button>

        <div class="header-content">
          <div class="title-section">
            <h1 class="tournament-title">{{ tournament.name }}</h1>
            <p v-if="tournament.description" class="tournament-description">
              {{ tournament.description }}
            </p>
          </div>

          <div class="header-actions">
            <button class="btn btn-secondary" @click="handleEditTournament">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Редактировать
            </button>
            <button class="btn btn-primary" @click="handleExport">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Экспорт
            </button>
          </div>
        </div>

        <div v-if="stats" class="stats-bar">
          <div class="stat">
            <span class="stat-icon">👥</span>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalTeams }}</div>
              <div class="stat-label">Команд</div>
            </div>
          </div>
          <div class="stat">
            <span class="stat-icon">⚽</span>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalMatches }}</div>
              <div class="stat-label">Всего матчей</div>
            </div>
          </div>
          <div class="stat">
            <span class="stat-icon">✅</span>
            <div class="stat-content">
              <div class="stat-value">{{ stats.completedMatches }}</div>
              <div class="stat-label">Завершено</div>
            </div>
          </div>
          <div class="stat">
            <span class="stat-icon">📅</span>
            <div class="stat-content">
              <div class="stat-value">{{ stats.upcomingMatches }}</div>
              <div class="stat-label">Предстоящих</div>
            </div>
          </div>
          <div class="stat progress-stat">
            <div class="stat-content">
              <div class="stat-value">{{ stats.progress.toFixed(0) }}%</div>
              <div class="stat-label">Прогресс</div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${stats.progress}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="schedule-section">
        <h2 class="section-title">Расписание матчей</h2>
        <TournamentSchedule 
          :tournament-id="tournamentId"
          @edit-match="handleEditMatch"
          @enter-result="handleEnterResult"
        />
      </div>
    </div>

    <div v-else class="container">
      <div class="error-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2>Турнир не найден</h2>
        <p>Указанный турнир не существует или был удалён</p>
        <button class="btn btn-primary" @click="handleBack">Вернуться к дашборду</button>
      </div>
    </div>

    <MatchEditorModal
      v-if="selectedMatchId"
      v-model="showMatchEditor"
      :match-id="selectedMatchId"
    />

    <EditTournamentModal
      v-model="showEditModal"
      :tournament="tournament"
      @save="handleSaveTournament"
    />
  </div>
</template>

<style scoped lang="scss">
.tournament-detail-view {
  min-height: 100vh;
  background: var(--color-bg-secondary, #f9fafb);
  padding: 2rem 1rem;

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #0a0a0a);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  color: var(--color-text-secondary, #6b7280);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;

  &:hover {
    color: var(--color-primary, #6366f1);
    border-color: var(--color-primary, #6366f1);
  }

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
    color: var(--color-text-secondary-dark, #9ca3af);

    &:hover {
      color: var(--color-primary-dark, #818cf8);
      border-color: var(--color-primary-dark, #818cf8);
    }
  }
}

.header-content {
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
  }
}

.title-section {
  flex: 1;
}

.tournament-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary, #111);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.tournament-description {
  font-size: 1rem;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.stat {
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  &.progress-stat {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
  }
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary, #6366f1);
  line-height: 1;

  :global(.dark) & {
    color: var(--color-primary-dark, #818cf8);
  }
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6b7280);
  margin-top: 0.25rem;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.progress-bar {
  height: 8px;
  background: var(--color-bg-secondary, #e5e7eb);
  border-radius: 4px;
  overflow: hidden;

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
  }
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--color-primary, #6366f1), var(--color-secondary, #8b5cf6));
  transition: width 0.3s ease;

  :global(.dark) & {
    background: linear-gradient(to right, var(--color-primary-dark, #818cf8), var(--color-secondary-dark, #a78bfa));
  }
}

.schedule-section {
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 2rem;

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
  }
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: var(--color-text-primary, #111);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-secondary, #6b7280);

  svg {
    margin: 0 auto 1.5rem;
    color: var(--color-text-secondary, #6b7280);
  }

  h2 {
    font-size: 1.75rem;
    color: var(--color-text-primary, #111);
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 2rem;
  }

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);

    svg {
      color: var(--color-text-secondary-dark, #9ca3af);
    }

    h2 {
      color: var(--color-text-primary-dark, #f9fafb);
    }
  }
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
  .stats-bar {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;

    button {
      flex: 1;
    }
  }

  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-bar {
    grid-template-columns: 1fr;
  }
}
</style>
