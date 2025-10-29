<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
}

defineProps<Props>()
</script>

<template>
  <div class="benefit-card">
    <div class="benefit-icon">
      <span class="icon-text">{{ icon }}</span>
    </div>
    <div class="benefit-content">
      <h4 class="benefit-title">{{ title }}</h4>
      <p class="benefit-description">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.benefit-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--color-bg-secondary, #f9fafb);
  border-radius: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(8px);
    background: var(--color-bg-primary, #fff);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
    
    &:hover {
      background: var(--color-bg-primary-dark, #1a1a1a);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3),
                  0 0 16px rgba(99, 102, 241, 0.15);
    }
  }
}

.benefit-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary, #6366f1), var(--color-secondary, #8b5cf6));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  .benefit-card:hover & {
    transform: rotate(10deg) scale(1.1);
  }
  
  :global(.dark) & {
    background: linear-gradient(135deg, var(--color-primary-dark, #818cf8), var(--color-secondary-dark, #a78bfa));
    box-shadow: 0 0 16px rgba(129, 140, 248, 0.3);
  }
}

.icon-text {
  font-size: 1.5rem;
}

.benefit-content {
  flex: 1;
}

.benefit-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary, #111);
  
  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.benefit-description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
  
  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}
</style>
