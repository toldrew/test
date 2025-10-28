<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header>
      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.nav {
  display: flex;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: #42b983;
    }

    &.router-link-active {
      color: #42b983;
    }
  }
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>
