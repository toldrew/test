<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const message = ref('Welcome to Vue 3 + Vite + TypeScript')
</script>

<template>
  <div class="home">
    <h1>{{ message }}</h1>
    <p>This is the home page of your Vue 3 application.</p>
    <p>The project is scaffolded with:</p>
    <ul>
      <li>Vue 3 (Composition API)</li>
      <li>Vite for fast development</li>
      <li>TypeScript for type safety</li>
      <li>Vue Router for navigation</li>
      <li>Pinia for state management</li>
      <li>ESLint + Prettier for code quality</li>
      <li>SCSS for styling</li>
      <li>Theme system with light/dark mode</li>
      <li>Reusable UI primitives</li>
    </ul>

    <div class="home__actions">
      <BaseButton variant="primary" @click="$router.push('/dashboard')">
        Go to Dashboard
      </BaseButton>
      <BaseButton variant="secondary" @click="$router.push('/about')">
        Learn More
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  h1 {
    color: var(--color-primary);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }

  ul {
    list-style: disc;
    list-style-position: inside;
    line-height: 1.8;
    color: var(--color-text-secondary);
    margin-bottom: 2rem;

    li {
      margin-left: 1rem;
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
}
</style>
