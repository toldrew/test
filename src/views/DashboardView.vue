<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  { label: 'Total Users', value: 1234 },
  { label: 'Active Sessions', value: 42 },
  { label: 'Revenue', value: '$5,678' }
])
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>This is a placeholder dashboard page.</p>
    
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  h1 {
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: var(--color-text-secondary);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  background: var(--color-background-alt);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }
}
</style>
