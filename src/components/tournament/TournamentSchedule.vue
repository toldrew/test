<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTournamentStore } from '@/stores/tournamentStore'
import { exportToPDF, exportToWord, printSchedule } from '@/services/exporter'
import { useToast } from '@/composables/useToast'

interface Props {
  tournamentId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'edit-match': [matchId: string]
  'enter-result': [matchId: string]
}>()

const store = useTournamentStore()
const { success, error } = useToast()

const isExporting = ref(false)
const exportProgress = ref(0)

const tournament = computed(() => store.getTournamentById(props.tournamentId))

const matchesByRound = computed(() => {
  if (!tournament.value) return []
  
  return tournament.value.rounds.map(round => ({
    round,
    matches: round.matches
  }))
})

function getTeamName(teamId: string | null): string {
  if (!teamId) return 'TBD'
  const team = store.getTeamById(teamId)
  return team?.name || 'Unknown'
}

function getTeamLogo(teamId: string | null): string | undefined {
  if (!teamId) return undefined
  const team = store.getTeamById(teamId)
  return team?.logo
}

function formatDate(date?: Date): string {
  if (!date) return 'TBD'
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'status-completed'
    case 'in_progress':
      return 'status-in-progress'
    case 'cancelled':
      return 'status-cancelled'
    default:
      return 'status-scheduled'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'completed':
      return 'Завершен'
    case 'in_progress':
      return 'В процессе'
    case 'cancelled':
      return 'Отменен'
    default:
      return 'Запланирован'
  }
}

function handleEditMatch(matchId: string) {
  emit('edit-match', matchId)
}

function handleEnterResult(matchId: string) {
  emit('enter-result', matchId)
}

async function handleExportPDF() {
  if (!tournament.value) return
  
  isExporting.value = true
  exportProgress.value = 0
  
  try {
    await exportToPDF({
      tournament: tournament.value,
      teams: store.currentUserTeams,
      getTeamName,
      formatDate,
      onProgress: (progress) => {
        exportProgress.value = progress
      }
    })
    success('PDF успешно экспортирован')
  } catch (err) {
    error('Ошибка при экспорте PDF')
    console.error(err)
  } finally {
    isExporting.value = false
    exportProgress.value = 0
  }
}

async function handleExportWord() {
  if (!tournament.value) return
  
  isExporting.value = true
  exportProgress.value = 0
  
  try {
    await exportToWord({
      tournament: tournament.value,
      teams: store.currentUserTeams,
      getTeamName,
      formatDate,
      onProgress: (progress) => {
        exportProgress.value = progress
      }
    })
    success('Word документ успешно экспортирован')
  } catch (err) {
    error('Ошибка при экспорте Word документа')
    console.error(err)
  } finally {
    isExporting.value = false
    exportProgress.value = 0
  }
}

function handlePrint() {
  printSchedule()
}
</script>

<template>
  <div v-if="tournament" class="tournament-schedule">
    <!-- Export Actions Bar -->
    <div class="export-actions">
      <div class="export-actions-left">
        <h2>Расписание турнира</h2>
      </div>
      <div class="export-actions-right">
        <button
          class="export-btn export-pdf"
          :disabled="isExporting"
          @click="handleExportPDF"
          title="Экспорт в PDF"
        >
          <span class="btn-icon">📄</span>
          <span class="btn-text">Экспорт в PDF</span>
        </button>
        <button
          class="export-btn export-word"
          :disabled="isExporting"
          @click="handleExportWord"
          title="Экспорт в Word"
        >
          <span class="btn-icon">📝</span>
          <span class="btn-text">Экспорт в Word</span>
        </button>
        <button
          class="export-btn export-print"
          :disabled="isExporting"
          @click="handlePrint"
          title="Печать"
        >
          <span class="btn-icon">🖨️</span>
          <span class="btn-text">Печать</span>
        </button>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="isExporting" class="export-loading">
      <div class="loading-spinner"></div>
      <p>Экспорт... {{ Math.round(exportProgress) }}%</p>
    </div>

    <div v-for="{ round, matches } in matchesByRound" :key="round.id" class="round-section">
      <div class="round-header">
        <h3 class="round-title">{{ round.name }}</h3>
        <span class="round-dates">
          {{ formatDate(round.startDate) }} - {{ formatDate(round.endDate) }}
        </span>
      </div>

      <div class="matches-list">
        <div
          v-for="match in matches"
          :key="match.id"
          class="match-card"
        >
          <div class="match-teams">
            <div class="team home-team">
              <div v-if="getTeamLogo(match.homeTeamId)" class="team-logo">
                <img :src="getTeamLogo(match.homeTeamId)" :alt="getTeamName(match.homeTeamId)" />
              </div>
              <span class="team-name">{{ getTeamName(match.homeTeamId) }}</span>
              <span v-if="match.result" class="team-score">{{ match.result.homeScore }}</span>
            </div>

            <div class="match-vs">VS</div>

            <div class="team away-team">
              <span v-if="match.result" class="team-score">{{ match.result.awayScore }}</span>
              <span class="team-name">{{ getTeamName(match.awayTeamId) }}</span>
              <div v-if="getTeamLogo(match.awayTeamId)" class="team-logo">
                <img :src="getTeamLogo(match.awayTeamId)" :alt="getTeamName(match.awayTeamId)" />
              </div>
            </div>
          </div>

          <div class="match-details">
            <div class="match-info">
              <div class="info-item">
                <span class="info-label">📅</span>
                <span class="info-value">{{ formatDate(match.scheduledDate) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">📍</span>
                <span class="info-value">{{ match.location || 'TBD' }}</span>
              </div>
            </div>

            <div class="match-status">
              <span class="status-badge" :class="getStatusBadgeClass(match.status)">
                {{ getStatusLabel(match.status) }}
              </span>
            </div>
          </div>

          <div class="match-actions">
            <button
              class="action-btn btn-edit"
              @click="handleEditMatch(match.id)"
              title="Редактировать"
            >
              ✏️ Редактировать
            </button>
            <button
              v-if="match.status !== 'completed'"
              class="action-btn btn-result"
              @click="handleEnterResult(match.id)"
              title="Введите результат"
            >
              ⚽ Введите результат
            </button>
          </div>

          <div v-if="match.result?.notes" class="match-notes">
            <p>{{ match.result.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tournament-schedule {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.5s ease-in-out;
  position: relative;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.export-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  margin-bottom: 1rem;
  animation: slideDown 0.4s ease-out;

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--color-text-primary, #111);

    :global(.dark) & {
      color: var(--color-text-primary-dark, #f9fafb);
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.export-actions-left {
  flex: 1;
}

.export-actions-right {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-bg-secondary, #f9fafb);
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text-primary, #111);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-icon {
    font-size: 1.125rem;
  }

  &.export-pdf:hover:not(:disabled) {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
    color: #ef4444;
  }

  &.export-word:hover:not(:disabled) {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
    color: #3b82f6;
  }

  &.export-print:hover:not(:disabled) {
    border-color: var(--color-primary, #6366f1);
    background: rgba(99, 102, 241, 0.05);
    color: var(--color-primary, #6366f1);
  }

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
    border-color: var(--color-border-dark, #404040);
    color: var(--color-text-primary-dark, #f9fafb);

    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    &.export-pdf:hover:not(:disabled) {
      border-color: #f87171;
      background: rgba(248, 113, 113, 0.1);
      color: #f87171;
    }

    &.export-word:hover:not(:disabled) {
      border-color: #60a5fa;
      background: rgba(96, 165, 250, 0.1);
      color: #60a5fa;
    }

    &.export-print:hover:not(:disabled) {
      border-color: var(--color-primary-dark, #818cf8);
      background: rgba(129, 140, 248, 0.1);
      color: var(--color-primary-dark, #818cf8);
    }
  }
}

.export-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;

  p {
    color: white;
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
  }
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.round-section {
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 1.5rem;
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
  }
}

.round-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-border, #e5e7eb);
  
  :global(.dark) & {
    border-bottom-color: var(--color-border-dark, #333);
  }
}

.round-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary, #111);
  
  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.round-dates {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #6b7280);
  
  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.match-card {
  background: var(--color-bg-secondary, #f9fafb);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 10px;
  padding: 1.25rem;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--color-primary, #6366f1);
  }
  
  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
    border-color: var(--color-border-dark, #404040);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3),
                  0 0 16px rgba(99, 102, 241, 0.2);
      border-color: var(--color-primary-dark, #818cf8);
    }
  }
}

.match-teams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.team {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &.home-team {
    justify-content: flex-start;
  }
  
  &.away-team {
    justify-content: flex-end;
  }
}

.team-logo {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.team-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text-primary, #111);
  
  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.team-score {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary, #6366f1);
  min-width: 40px;
  text-align: center;
  
  :global(.dark) & {
    color: var(--color-primary-dark, #818cf8);
  }
}

.match-vs {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6b7280);
  padding: 0.5rem 1rem;
  background: var(--color-bg-primary, #fff);
  border-radius: 20px;
  
  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
    background: var(--color-bg-primary-dark, #1a1a1a);
  }
}

.match-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--color-border, #e5e7eb);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  
  :global(.dark) & {
    border-color: var(--color-border-dark, #404040);
  }
}

.match-info {
  display: flex;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary, #6b7280);
  
  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.info-label {
  font-size: 1rem;
}

.match-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.825rem;
  font-weight: 600;
  
  &.status-scheduled {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
  
  &.status-in-progress {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }
  
  &.status-completed {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }
  
  &.status-cancelled {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
}

.match-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.625rem 1rem;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--color-bg-primary, #fff);
  color: var(--color-text-primary, #111);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &.btn-edit:hover {
    border-color: var(--color-primary, #6366f1);
    color: var(--color-primary, #6366f1);
  }
  
  &.btn-result:hover {
    border-color: #22c55e;
    color: #22c55e;
  }
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #404040);
    color: var(--color-text-primary-dark, #f9fafb);
    
    &.btn-edit:hover {
      border-color: var(--color-primary-dark, #818cf8);
      color: var(--color-primary-dark, #818cf8);
    }
  }
}

.match-notes {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-bg-primary, #fff);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--color-text-secondary, #6b7280);
  border-left: 3px solid var(--color-primary, #6366f1);
  
  p {
    margin: 0;
  }
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    color: var(--color-text-secondary-dark, #9ca3af);
    border-left-color: var(--color-primary-dark, #818cf8);
  }
}

@media (max-width: 768px) {
  .export-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;

    h2 {
      font-size: 1.25rem;
    }
  }

  .export-actions-right {
    flex-direction: column;
    gap: 0.5rem;

    .export-btn {
      width: 100%;
      justify-content: center;
    }
  }

  .match-teams {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .team {
    &.away-team {
      justify-content: flex-start;
    }
  }
  
  .match-vs {
    justify-self: center;
  }
  
  .match-details {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .match-actions {
    flex-direction: column;
    width: 100%;
    
    .action-btn {
      width: 100%;
    }
  }
  
  .round-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

// Print styles
@media print {
  .export-actions,
  .export-loading,
  .match-actions {
    display: none !important;
  }

  .tournament-schedule {
    gap: 1.5rem;
  }

  .round-section {
    page-break-inside: avoid;
    border: 1px solid #ddd;
    box-shadow: none;
  }

  .match-card {
    page-break-inside: avoid;
    border: 1px solid #ddd;
    box-shadow: none;
    margin-bottom: 0.5rem;
  }

  .round-header {
    border-bottom: 2px solid #333;
  }

  .round-title {
    color: #000;
  }

  .team-name,
  .info-value {
    color: #000;
  }

  .status-badge {
    border: 1px solid #333;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .tournament-schedule,
  .export-actions,
  .export-loading,
  .match-card,
  .export-btn,
  .action-btn {
    animation: none;
    transition: none;
  }

  .export-btn:hover:not(:disabled),
  .action-btn:hover {
    transform: none;
  }

  .loading-spinner {
    animation: none;
  }
}
</style>
