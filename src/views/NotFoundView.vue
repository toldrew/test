<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'

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
    <BaseButton variant="primary" @click="goHome">
      Go to Home
    </BaseButton>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  text-align: center;
  padding: 4rem 0;

  h1 {
    font-size: 6rem;
    color: var(--color-primary);
    margin-bottom: 1rem;
    font-weight: bold;
  }

  h2 {
    font-size: 2rem;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }

  p {
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
}
</style>
