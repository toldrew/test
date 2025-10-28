<script setup lang="ts">
import { ref } from 'vue'

const appVersion = ref('0.1.0')
const buildDate = ref(new Date().toLocaleDateString())
</script>

<template>
  <div class="about">
    <h1>About</h1>
    <p>This is the about page for the Vue 3 application.</p>
    
    <div class="info-section">
      <h2>Application Info</h2>
      <dl>
        <dt>Version:</dt>
        <dd>{{ appVersion }}</dd>
        
        <dt>Build Date:</dt>
        <dd>{{ buildDate }}</dd>
        
        <dt>Framework:</dt>
        <dd>Vue 3 with Composition API</dd>
        
        <dt>Build Tool:</dt>
        <dd>Vite</dd>
      </dl>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about {
  h1 {
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: var(--color-text-secondary);
  }
}

.info-section {
  background: var(--color-background-alt);
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);

  h2 {
    color: var(--color-text-primary);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    
    dt {
      font-weight: bold;
      color: var(--color-text-primary);
    }
    
    dd {
      color: var(--color-text-secondary);
      margin: 0;
    }
  }
}
</style>
