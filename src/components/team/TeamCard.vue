<script setup lang="ts">
import { computed } from 'vue'
import type { Team } from '@/types'

interface Props {
  team: Team
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()

const formattedDate = computed(() => {
  return new Date(props.team.createdAt).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

const teamInitials = computed(() => {
  return props.team.name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const stats = computed(() => props.team.stats)

function handleEdit() {
  emit('edit')
}

function handleDelete() {
  emit('delete')
}
</script>

<template>
  <div class="team-card">
    <div class="card-header">
      <div class="team-emblem">
        <img v-if="team.logo" :src="team.logo" :alt="team.name" />
        <div v-else class="emblem-placeholder">
          {{ teamInitials }}
        </div>
      </div>

      <div class="team-info">
        <h3 class="team-name">{{ team.name }}</h3>
        <span class="created-date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {{ formattedDate }}
        </span>
      </div>
    </div>

    <div v-if="stats" class="team-stats">
      <div class="stat-item">
        <span class="stat-label">Игр</span>
        <span class="stat-value">{{ stats.wins + stats.draws + stats.losses }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Побед</span>
        <span class="stat-value win">{{ stats.wins }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Ничьих</span>
        <span class="stat-value draw">{{ stats.draws }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Поражений</span>
        <span class="stat-value loss">{{ stats.losses }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Очков</span>
        <span class="stat-value points">{{ stats.points }}</span>
      </div>
    </div>

    <div class="card-actions">
      <button class="action-btn btn-edit" @click="handleEdit">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Редактировать
      </button>
      <button class="action-btn btn-delete" @click="handleDelete">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
        Удалить
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.team-card {
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--color-primary, #6366f1);

    .action-btn {
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

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);

  :global(.dark) & {
    border-bottom-color: var(--color-border-dark, #333);
  }
}

.team-emblem {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--color-border, #e5e7eb);

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

.team-info {
  flex: 1;
  min-width: 0;
}

.team-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.375rem 0;
  color: var(--color-text-primary, #111);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.created-date {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6b7280);

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  background: var(--color-bg-secondary, #f9fafb);
  border-radius: 8px;

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
  }
}

.stat-label {
  font-size: 0.7rem;
  color: var(--color-text-secondary, #6b7280);
  margin-bottom: 0.25rem;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary, #111);

  &.win {
    color: #22c55e;
  }

  &.draw {
    color: #6b7280;
  }

  &.loss {
    color: #ef4444;
  }

  &.points {
    color: var(--color-primary, #6366f1);
  }

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);

    &.points {
      color: var(--color-primary-dark, #818cf8);
    }
  }
}

.card-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  padding: 0.625rem 1rem;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--color-bg-primary, #fff);
  color: var(--color-text-primary, #111);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &.btn-edit:hover {
    border-color: var(--color-primary, #6366f1);
    color: var(--color-primary, #6366f1);
  }

  &.btn-delete:hover {
    border-color: #ef4444;
    color: #ef4444;
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

@media (max-width: 768px) {
  .team-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .card-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .team-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
