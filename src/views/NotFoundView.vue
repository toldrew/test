<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you are looking for doesn't exist or has been moved.</p>
    <button @click="goHome" class="btn-home">Go to Home</button>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  text-align: center;
  padding: 4rem 0;

  h1 {
    font-size: 6rem;
    color: #42b983;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .btn-home {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #35a372;
    }
  }
}
</style>
