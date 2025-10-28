<script setup lang="ts">
import { ref } from 'vue'

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
    </ul>
  </div>
</template>

<style scoped lang="scss">
.home {
  h1 {
    color: #42b983;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  ul {
    list-style-position: inside;
    line-height: 1.8;

    li {
      margin-left: 1rem;
    }
  }
}
</style>
