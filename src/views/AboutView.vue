<script setup lang="ts">
import { ref } from 'vue'

const appVersion = ref('0.1.0')
const features = [
  {
    icon: '⚡',
    title: 'Быстрое создание',
    description: 'Создавайте турниры за считанные минуты с интуитивным интерфейсом'
  },
  {
    icon: '📅',
    title: 'Автоматическое расписание',
    description: 'Генерация расписания матчей с учетом круговой системы и временных интервалов'
  },
  {
    icon: '📊',
    title: 'Статистика и результаты',
    description: 'Отслеживайте результаты, счета и таблицы команд в реальном времени'
  },
  {
    icon: '📄',
    title: 'Экспорт документов',
    description: 'Экспортируйте расписания в PDF, Word или распечатывайте напрямую'
  },
  {
    icon: '🎨',
    title: 'Темная тема',
    description: 'Работайте в комфорте с поддержкой светлой и темной темы'
  },
  {
    icon: '📱',
    title: 'Адаптивный дизайн',
    description: 'Удобный доступ с любого устройства - компьютера, планшета или телефона'
  }
]

const benefits = [
  {
    title: 'Экономия времени',
    description: 'Автоматизация создания расписаний экономит до 90% времени по сравнению с ручным планированием'
  },
  {
    title: 'Меньше ошибок',
    description: 'Система автоматически проверяет конфликты и обеспечивает справедливое распределение матчей'
  },
  {
    title: 'Профессиональный вид',
    description: 'Создавайте документы с расписанием, которые выглядят профессионально и понятны всем участникам'
  },
  {
    title: 'Централизованное управление',
    description: 'Все турниры, команды и результаты в одном месте с удобным поиском и фильтрацией'
  }
]

const targetUsers = [
  {
    title: 'Тренеры',
    description: 'Управляйте турнирами своих команд, отслеживайте результаты и планируйте тренировочный процесс'
  },
  {
    title: 'Организаторы',
    description: 'Создавайте и проводите турниры любого масштаба - от школьных до региональных соревнований'
  },
  {
    title: 'Спортивные клубы',
    description: 'Организуйте внутренние лиги и чемпионаты с профессиональным подходом'
  },
  {
    title: 'Школы и ВУЗы',
    description: 'Проводите спортивные мероприятия между классами, группами или факультетами'
  },
  {
    title: 'Лиги любителей',
    description: 'Создавайте общественные турниры и дружеские соревнования в вашем районе или городе'
  }
]
</script>

<template>
  <div class="about">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">О приложении</h1>
        <p class="hero-subtitle">
          Современное решение для организации спортивных турниров и автоматического создания расписаний
        </p>
      </div>
    </section>

    <!-- Purpose Section -->
    <section class="section purpose">
      <div class="section-header">
        <h2>Что это за сервис?</h2>
      </div>
      <div class="purpose-content">
        <p class="lead">
          Наше приложение - это мощный инструмент для организации спортивных турниров любого уровня.
          Оно автоматизирует рутинные задачи по созданию расписаний, отслеживанию результатов и
          формированию турнирных таблиц, позволяя вам сосредоточиться на самом важном - проведении
          соревнований.
        </p>
        <p>
          Система поддерживает различные форматы турниров, включая круговую систему и плей-офф,
          автоматически генерирует расписание матчей с учетом временных интервалов и позволяет
          экспортировать результаты в удобных форматах.
        </p>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="section features">
      <div class="section-header">
        <h2>Основные возможности</h2>
      </div>
      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Target Users -->
    <section class="section target-users">
      <div class="section-header">
        <h2>Для кого это приложение?</h2>
      </div>
      <div class="users-grid">
        <div v-for="user in targetUsers" :key="user.title" class="user-card">
          <h3 class="user-title">{{ user.title }}</h3>
          <p class="user-description">{{ user.description }}</p>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="section benefits">
      <div class="section-header">
        <h2>Преимущества использования</h2>
      </div>
      <div class="benefits-list">
        <div v-for="benefit in benefits" :key="benefit.title" class="benefit-item">
          <div class="benefit-marker">✓</div>
          <div class="benefit-content">
            <h3 class="benefit-title">{{ benefit.title }}</h3>
            <p class="benefit-description">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Info -->
    <section class="section tech-info">
      <div class="section-header">
        <h2>Техническая информация</h2>
      </div>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">Версия</div>
          <div class="info-value">{{ appVersion }}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Технологии</div>
          <div class="info-value">Vue 3, TypeScript, Vite</div>
        </div>
        <div class="info-card">
          <div class="info-label">Хранение данных</div>
          <div class="info-value">Локальное (localStorage)</div>
        </div>
        <div class="info-card">
          <div class="info-label">Экспорт</div>
          <div class="info-value">PDF, Word, Печать</div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta">
      <div class="cta-content">
        <h2>Готовы начать?</h2>
        <p>Создайте свой первый турнир прямо сейчас</p>
        <RouterLink to="/dashboard" class="cta-button">Перейти в Dashboard</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.about {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero {
  text-align: center;
  padding: 3rem 0 4rem;
  background: linear-gradient(135deg, 
    var(--color-primary, #6366f1) 0%, 
    var(--color-secondary, #8b5cf6) 100%
  );
  border-radius: 16px;
  margin-bottom: 3rem;
  color: white;
  animation: slideDown 0.8s ease-out;

  :global(.dark) & {
    background: linear-gradient(135deg,
      var(--color-primary-dark, #818cf8) 0%,
      var(--color-secondary-dark, #a78bfa) 100%
    );
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  animation: scaleIn 0.6s ease-out 0.2s backwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  animation: fadeIn 0.6s ease-out 0.4s backwards;
}

.section {
  margin-bottom: 4rem;
  animation: fadeInUp 0.6s ease-out backwards;
  
  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.3s; }
  &:nth-child(5) { animation-delay: 0.4s; }
  &:nth-child(6) { animation-delay: 0.5s; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;

  h2 {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--color-text-primary, #111);
    margin: 0;

    :global(.dark) & {
      color: var(--color-text-primary-dark, #f9fafb);
    }
  }
}

.purpose-content {
  max-width: 800px;
  margin: 0 auto;

  .lead {
    font-size: 1.25rem;
    line-height: 1.7;
    color: var(--color-text-primary, #111);
    margin-bottom: 1.5rem;

    :global(.dark) & {
      color: var(--color-text-primary-dark, #f9fafb);
    }
  }

  p {
    font-size: 1.0625rem;
    line-height: 1.7;
    color: var(--color-text-secondary, #6b7280);

    :global(.dark) & {
      color: var(--color-text-secondary-dark, #9ca3af);
    }
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--color-bg-secondary, #f9fafb);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  animation: scaleIn 0.4s ease-out backwards;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--color-primary, #6366f1);
  }

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
    border-color: var(--color-border-dark, #404040);

    &:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
      border-color: var(--color-primary-dark, #818cf8);
    }
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary, #111);
  margin-bottom: 0.75rem;

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.feature-description {
  font-size: 0.9375rem;
  color: var(--color-text-secondary, #6b7280);
  line-height: 1.6;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: var(--color-bg-primary, #fff);
  border: 2px solid var(--color-border, #e5e7eb);
  border-radius: 10px;
  padding: 1.75rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-primary, #6366f1);
    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.15);
  }

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);

    &:hover {
      border-color: var(--color-primary-dark, #818cf8);
      box-shadow: 0 8px 16px rgba(129, 140, 248, 0.15);
    }
  }
}

.user-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-primary, #6366f1);
  margin-bottom: 0.75rem;

  :global(.dark) & {
    color: var(--color-primary-dark, #818cf8);
  }
}

.user-description {
  font-size: 0.9375rem;
  color: var(--color-text-secondary, #6b7280);
  line-height: 1.6;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.benefits-list {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.benefit-item {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  background: var(--color-bg-secondary, #f9fafb);
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid var(--color-primary, #6366f1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
    border-left-color: var(--color-primary-dark, #818cf8);

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }
}

.benefit-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-primary, #6366f1);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.125rem;
  flex-shrink: 0;

  :global(.dark) & {
    background: var(--color-primary-dark, #818cf8);
  }
}

.benefit-content {
  flex: 1;
}

.benefit-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary, #111);
  margin-bottom: 0.5rem;

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.benefit-description {
  font-size: 0.9375rem;
  color: var(--color-text-secondary, #6b7280);
  line-height: 1.6;
  margin: 0;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: var(--color-bg-secondary, #f9fafb);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 10px;
  padding: 1.75rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #262626);
    border-color: var(--color-border-dark, #404040);

    &:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
  }
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary, #6b7280);
  margin-bottom: 0.75rem;

  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.info-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary, #111);

  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.cta {
  background: linear-gradient(135deg,
    var(--color-primary, #6366f1) 0%,
    var(--color-secondary, #8b5cf6) 100%
  );
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  color: white;

  :global(.dark) & {
    background: linear-gradient(135deg,
      var(--color-primary-dark, #818cf8) 0%,
      var(--color-secondary-dark, #a78bfa) 100%
    );
  }
}

.cta-content {
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.95;
  }
}

.cta-button {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: white;
  color: var(--color-primary, #6366f1);
  font-weight: 600;
  font-size: 1.0625rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }

  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    color: var(--color-primary-dark, #818cf8);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-header h2 {
    font-size: 1.75rem;
  }

  .features-grid,
  .users-grid {
    grid-template-columns: 1fr;
  }

  .benefit-item {
    flex-direction: column;
    gap: 1rem;
  }

  .cta-content h2 {
    font-size: 1.75rem;
  }

  .cta-content p {
    font-size: 1rem;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .about,
  .hero,
  .hero-title,
  .hero-subtitle,
  .section,
  .feature-card,
  .info-card,
  .benefit-item,
  .user-card,
  .cta-button {
    animation: none;
    transition: none;
  }

  .feature-card:hover,
  .info-card:hover,
  .benefit-item:hover,
  .user-card:hover,
  .cta-button:hover {
    transform: none;
  }
}
</style>
