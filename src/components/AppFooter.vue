<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3 class="footer-title">Tournify</h3>
        <p class="footer-description">
          Современное решение для управления спортивными турнирами
        </p>
      </div>

      <div class="footer-section">
        <h4 class="footer-heading">Навигация</h4>
        <nav class="footer-nav">
          <RouterLink to="/" class="footer-link">Главная</RouterLink>
          <RouterLink to="/dashboard" class="footer-link">Дашборд</RouterLink>
          <RouterLink to="/about" class="footer-link">О проекте</RouterLink>
        </nav>
      </div>

      <div class="footer-section">
        <h4 class="footer-heading">Возможности</h4>
        <ul class="footer-list">
          <li>Автоматическое расписание</li>
          <li>Умная группировка</li>
          <li>Экспорт в PDF/Word</li>
          <li>Темная тема</li>
        </ul>
      </div>

      <div class="footer-section">
        <h4 class="footer-heading">Технологии</h4>
        <ul class="footer-list">
          <li>Vue.js 3</li>
          <li>TypeScript</li>
          <li>Pinia</li>
          <li>Vue Router</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copyright">
        &copy; {{ currentYear }} Tournify. Все права защищены.
      </p>
      <p class="footer-version">
        Версия 0.1.0
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  background-color: var(--color-bg-secondary, #f9fafb);
  border-top: 1px solid var(--color-border, #e5e7eb);
  margin-top: auto;
  padding: 3rem 1rem 1.5rem;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  :global(.dark) & {
    background-color: var(--color-bg-secondary-dark, #1a1a1a);
    border-top-color: var(--color-border-dark, #333333);
  }
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  :global(.dark) & {
    background: linear-gradient(135deg, #818cf8, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.footer-description {
  color: var(--color-text-secondary, #6b7280);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.footer-heading {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary, #111827);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: var(--color-text-secondary, #6b7280);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-primary, #6366f1);
  }

  &.router-link-active {
    color: var(--color-primary, #6366f1);
    font-weight: 500;
  }

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);

    &:hover {
      color: var(--color-primary-dark, #818cf8);
    }

    &.router-link-active {
      color: var(--color-primary-dark, #818cf8);
    }
  }
}

.footer-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    color: var(--color-text-secondary, #6b7280);
    font-size: 0.9rem;

    :global(.dark) & {
      color: var(--color-text-secondary-dark, #9ca3af);
    }
  }
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border, #e5e7eb);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  :global(.dark) & {
    border-top-color: var(--color-border-dark, #333333);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.footer-copyright,
.footer-version {
  color: var(--color-text-secondary, #6b7280);
  font-size: 0.875rem;
  margin: 0;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .app-footer,
  .footer-link {
    transition: none;
  }
}
</style>
