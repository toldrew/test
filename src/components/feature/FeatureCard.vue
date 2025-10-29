<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
}

defineProps<Props>()
</script>

<template>
  <div class="feature-card">
    <div class="feature-icon">
      <span class="icon-text">{{ icon }}</span>
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-description">{{ description }}</p>
  </div>
</template>

<style scoped lang="scss">
.feature-card {
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  cursor: default;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--color-primary, #6366f1);
  }
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
    
    &:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4),
                  0 0 20px rgba(99, 102, 241, 0.3);
      border-color: var(--color-primary-dark, #818cf8);
    }
  }
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--color-primary, #6366f1), var(--color-secondary, #8b5cf6));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  .feature-card:hover & {
    transform: scale(1.1) rotate(5deg);
  }
  
  :global(.dark) & {
    background: linear-gradient(135deg, var(--color-primary-dark, #818cf8), var(--color-secondary-dark, #a78bfa));
    box-shadow: 0 0 20px rgba(129, 140, 248, 0.4);
  }
}

.icon-text {
  font-size: 2rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary, #111);
  
  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.feature-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
  
  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}
</style>
