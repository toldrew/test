<script setup lang="ts">
import { computed } from 'vue'
import type { Tournament } from '@/types'
import { useTournamentStore } from '@/stores/tournamentStore'

interface Props {
  tournament: Tournament
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
  delete: []
}>()

const store = useTournamentStore()

const stats = computed(() => {
  return store.getTournamentStats(props.tournament.id)
})

const statusBadge = computed(() => {
  if (!stats.value) return { label: 'Не начат', class: 'status-pending' }

  const { completedMatches, totalMatches } = stats.value

  if (completedMatches === 0) {
    return { label: 'Не начат', class: 'status-pending' }
  } else if (completedMatches === totalMatches) {
    return { label: 'Завершён', class: 'status-completed' }
  } else {
    return { label: 'В процессе', class: 'status-in-progress' }
  }
})

const formattedDate = computed(() => {
  return new Date(props.tournament.createdAt).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

const progressPercentage = computed(() => {
  return stats.value?.progress || 0
})

function handleClick() {
  emit('click')
}

function handleDelete(event: Event) {
  event.stopPropagation()
  emit('delete')
}
</script>

<template>
  <div class="tournament-card" @click="handleClick">
    <button class="delete-btn" @click="handleDelete" title="Удалить турнир">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    </button>

    <div class="card-header">
      <h3 class="tournament-name">{{ tournament.name }}</h3>
      <span class="status-badge" :class="statusBadge.class">
        {{ statusBadge.label }}
      </span>
    </div>

    <p v-if="tournament.description" class="tournament-description">
      {{ tournament.description }}
    </p>

    <div class="card-stats">
      <div class="stat-item">
        <span class="stat-icon">👥</span>
        <span class="stat-value">{{ tournament.teamIds.length }}</span>
        <span class="stat-label">команд</span>
      </div>

      <div class="stat-item">
        <span class="stat-icon">🔄</span>
        <span class="stat-value">{{ tournament.numberOfRounds }}</span>
        <span class="stat-label">кругов</span>
      </div>

      <div class="stat-item">
        <span class="stat-icon">⚽</span>
        <span class="stat-value">{{ stats?.upcomingMatches || 0 }}</span>
        <span class="stat-label">предстоящих</span>
      </div>

      <div class="stat-item">
        <span class="stat-icon">✅</span>
        <span class="stat-value">{{ stats?.completedMatches || 0 }}</span>
        <span class="stat-label">завершено</span>
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
    </div>

    <div class="card-footer">
      <span class="created-date">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Создан: {{ formattedDate }}
      </span>
      <span class="tournament-type">
        {{ tournament.type === 'groups' ? 'Групповой' : 'Плей-офф' }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tournament-card {
  position: relative;
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--color-primary, #6366f1);

    .delete-btn {
      opacity: 1;
    }
  }

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3),
                  0 0 20px rgba(99, 102, 241, 0.2);
      border-color: var(--color-primary-dark, #818cf8);
    }
  }
}

.delete-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  color: #ef4444;
  opacity: 0;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    background: #ef4444;
    color: white;
    transform: scale(1.1);
  }
}

.card-header {
  margin-bottom: 0.75rem;
  padding-right: 2rem;
}

.tournament-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary, #111);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;

  &.status-pending {
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
  }

  &.status-in-progress {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }

  &.status-completed {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }
}

.tournament-description {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #6b7280);
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.card-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.75rem 0.5rem;
  background: var(--color-bg-secondary, #f9fafb);
  border-radius: 8px;

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
  }
}

.stat-icon {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary, #6366f1);

  :global(.dark) & {
    color: var(--color-primary-dark, #818cf8);
  }
}

.stat-label {
  font-size: 0.7rem;
  color: var(--color-text-secondary, #6b7280);
  margin-top: 0.125rem;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.progress-bar {
  height: 6px;
  background: var(--color-bg-secondary, #e5e7eb);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 1rem;

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

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6b7280);

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.created-date {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.tournament-type {
  font-weight: 500;
}

@media (max-width: 768px) {
  .card-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
