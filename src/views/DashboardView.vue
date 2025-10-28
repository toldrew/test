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
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: #666;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #dee2e6;

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #42b983;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: #666;
    font-size: 0.9rem;
  }
}
</style>
