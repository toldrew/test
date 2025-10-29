<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTournamentStore } from '@/stores/tournamentStore'
import { useTheme } from '@/composables/useTheme'
import FeatureCard from '@/components/feature/FeatureCard.vue'
import BenefitCard from '@/components/feature/BenefitCard.vue'
import CreateTournamentModal from '@/components/tournament/CreateTournamentModal.vue'
import TournamentSchedule from '@/components/tournament/TournamentSchedule.vue'
import MatchEditorModal from '@/components/tournament/MatchEditorModal.vue'

const router = useRouter()
const store = useTournamentStore()
const { isDark, toggleTheme } = useTheme()

const showCreateModal = ref(false)
const showMatchEditor = ref(false)
const editingMatchId = ref<string | null>(null)
const focusOnResult = ref(false)
const latestTournamentId = ref<string | null>(null)

// Get latest tournament
const latestTournament = computed(() => {
  if (latestTournamentId.value) {
    return store.getTournamentById(latestTournamentId.value)
  }
  const tournaments = store.currentUserTournaments
  return tournaments.length > 0 ? tournaments[tournaments.length - 1] : null
})

const tournamentStats = computed(() => {
  if (!latestTournament.value) return null
  return store.getTournamentStats(latestTournament.value.id)
})

const features = [
  {
    icon: '⚡',
    title: 'Автоматическое расписание',
    description: 'Создайте турнир за минуты. Система автоматически генерирует расписание матчей с учетом раундов и групп.'
  },
  {
    icon: '🎯',
    title: 'Умная группировка',
    description: 'Распределяйте команды по группам, создавайте плей-офф сетки и управляйте турнирной таблицей.'
  },
  {
    icon: '🏆',
    title: 'Многораундовые турниры',
    description: 'Поддержка круговых турниров с несколькими раундами, двухкруговой системы и плей-офф.'
  },
  {
    icon: '📊',
    title: 'Экспорт и статистика',
    description: 'Отслеживайте статистику команд, результаты матчей и экспортируйте данные для анализа.'
  }
]

const benefits = [
  {
    icon: '⏱️',
    title: 'Экономия времени',
    description: 'Автоматическая генерация расписания экономит часы работы организаторов турниров.'
  },
  {
    icon: '🎨',
    title: 'Интуитивный интерфейс',
    description: 'Современный дизайн с поддержкой темной темы для комфортной работы в любое время.'
  },
  {
    icon: '💾',
    title: 'Локальное хранение',
    description: 'Все данные хранятся локально в вашем браузере - полный контроль и конфиденциальность.'
  },
  {
    icon: '📱',
    title: 'Адаптивный дизайн',
    description: 'Работайте с турнирами на любом устройстве - компьютере, планшете или смартфоне.'
  }
]

function handleCreateTournament() {
  showCreateModal.value = true
}

function handleTournamentCreated(tournamentId: string) {
  latestTournamentId.value = tournamentId
  // Scroll to schedule section
  setTimeout(() => {
    const scheduleEl = document.getElementById('tournament-schedule')
    if (scheduleEl) {
      scheduleEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

function handleEditMatch(matchId: string) {
  editingMatchId.value = matchId
  focusOnResult.value = false
  showMatchEditor.value = true
}

function handleEnterResult(matchId: string) {
  editingMatchId.value = matchId
  focusOnResult.value = true
  showMatchEditor.value = true
}

function handleMatchSaved() {
  // Refresh is automatic due to reactivity
}

function goToDashboard() {
  router.push('/dashboard')
}

// Scroll animation setup
onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, observerOptions)

  const animatedElements = document.querySelectorAll('.animate-on-scroll')
  animatedElements.forEach(el => observer.observe(el))
})
</script>

<template>
  <div class="home-view">
    <!-- Theme Toggle -->
    <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle theme">
      <span v-if="isDark">🌞</span>
      <span v-else>🌙</span>
    </button>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content animate-on-scroll">
        <h1 class="hero-title">
          <span class="gradient-text">Tournify</span>
        </h1>
        <p class="hero-subtitle">
          Управление турнирами стало проще. Создавайте расписания, отслеживайте результаты и управляйте командами в одном месте.
        </p>
        <button class="cta-button" @click="handleCreateTournament">
          <span class="button-icon">🚀</span>
          <span>Создать турнир</span>
        </button>
      </div>
      <div class="hero-illustration">
        <div class="illustration-circle circle-1"></div>
        <div class="illustration-circle circle-2"></div>
        <div class="illustration-circle circle-3"></div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="features-section animate-on-scroll">
      <h2 class="section-title">Ключевые возможности</h2>
      <div class="features-grid">
        <FeatureCard
          v-for="feature in features"
          :key="feature.title"
          :icon="feature.icon"
          :title="feature.title"
          :description="feature.description"
        />
      </div>
    </section>

    <!-- Create Tournament CTA -->
    <section class="cta-section animate-on-scroll">
      <div class="cta-card">
        <h2 class="cta-title">Готовы начать?</h2>
        <p class="cta-description">
          Создайте свой первый турнир прямо сейчас и оцените все преимущества автоматизации.
        </p>
        <button class="cta-button secondary" @click="handleCreateTournament">
          <span class="button-icon">⚽</span>
          <span>Создать турнир</span>
        </button>
      </div>
    </section>

    <!-- Latest Tournament Schedule -->
    <section
      v-if="latestTournament"
      id="tournament-schedule"
      class="schedule-section animate-on-scroll"
    >
      <div class="schedule-header">
        <div>
          <h2 class="section-title">{{ latestTournament.name }}</h2>
          <p class="section-subtitle">Последний созданный турнир</p>
        </div>
        <button class="btn-dashboard" @click="goToDashboard">
          📋 Все турниры
        </button>
      </div>

      <!-- Tournament Summary -->
      <div class="tournament-summary">
        <div class="summary-chip">
          <span class="chip-icon">👥</span>
          <span class="chip-label">{{ tournamentStats?.totalTeams || 0 }} команд</span>
        </div>
        <div class="summary-chip">
          <span class="chip-icon">🎮</span>
          <span class="chip-label">{{ latestTournament.numberOfRounds }} раундов</span>
        </div>
        <div class="summary-chip">
          <span class="chip-icon">📅</span>
          <span class="chip-label">
            {{ new Date(latestTournament.createdAt).toLocaleDateString('ru-RU') }}
          </span>
        </div>
        <div v-if="tournamentStats" class="summary-chip">
          <span class="chip-icon">✅</span>
          <span class="chip-label">
            {{ tournamentStats.completedMatches }} / {{ tournamentStats.totalMatches }} завершено
          </span>
        </div>
      </div>

      <!-- Schedule Display -->
      <TournamentSchedule
        :tournament-id="latestTournament.id"
        @edit-match="handleEditMatch"
        @enter-result="handleEnterResult"
      />

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="action-btn" @click="handleCreateTournament">
          ➕ Создать новый турнир
        </button>
        <button class="action-btn" @click="goToDashboard">
          📊 Перейти в дашборд
        </button>
      </div>
    </section>

    <!-- Why Tournify Section -->
    <section class="benefits-section animate-on-scroll">
      <h2 class="section-title">Почему Tournify?</h2>
      <p class="section-subtitle">
        Мы создали инструмент, который упрощает организацию турниров любого масштаба
      </p>
      <div class="benefits-grid">
        <BenefitCard
          v-for="benefit in benefits"
          :key="benefit.title"
          :icon="benefit.icon"
          :title="benefit.title"
          :description="benefit.description"
        />
      </div>
    </section>

    <!-- Footer CTA -->
    <section class="footer-cta animate-on-scroll">
      <div class="footer-content">
        <h2 class="footer-title">Начните управлять турнирами эффективно</h2>
        <p class="footer-description">
          Присоединяйтесь к организаторам, которые доверяют Tournify
        </p>
        <div class="footer-actions">
          <button class="cta-button" @click="handleCreateTournament">
            Создать турнир
          </button>
          <button class="cta-button secondary" @click="goToDashboard">
            Перейти в дашборд
          </button>
        </div>
      </div>
    </section>

    <!-- Modals -->
    <CreateTournamentModal
      v-model="showCreateModal"
      @created="handleTournamentCreated"
    />

    <MatchEditorModal
      v-model="showMatchEditor"
      :match-id="editingMatchId"
      :focus-on-result="focusOnResult"
      @saved="handleMatchSaved"
    />
  </div>
</template>

<style scoped lang="scss">
.home-view {
  min-height: 100vh;
  background: var(--color-bg-primary, #fff);
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #0a0a0a);
  }
}

.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: var(--color-bg-primary, #fff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1) rotate(15deg);
  }
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4),
                0 0 20px rgba(99, 102, 241, 0.3);
  }
}

// Hero Section
.hero-section {
  position: relative;
  padding: 6rem 2rem;
  text-align: center;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  
  :global(.dark) & {
    background: linear-gradient(135deg, rgba(129, 140, 248, 0.1), rgba(167, 139, 250, 0.1));
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  :global(.dark) & {
    background: linear-gradient(135deg, #818cf8, #a78bfa, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.hero-subtitle {
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: var(--color-text-secondary, #6b7280);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
  }
  
  &.secondary {
    background: var(--color-bg-primary, #fff);
    color: var(--color-primary, #6366f1);
    border: 2px solid var(--color-primary, #6366f1);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
    
    :global(.dark) & {
      background: var(--color-bg-primary-dark, #1a1a1a);
      color: var(--color-primary-dark, #818cf8);
      border-color: var(--color-primary-dark, #818cf8);
      box-shadow: 0 4px 20px rgba(129, 140, 248, 0.3);
    }
  }
  
  :global(.dark) & {
    background: linear-gradient(135deg, #818cf8, #a78bfa);
    box-shadow: 0 4px 20px rgba(129, 140, 248, 0.4),
                0 0 30px rgba(129, 140, 248, 0.2);
  }
}

.button-icon {
  font-size: 1.25rem;
}

.hero-illustration {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.illustration-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
  animation: float 20s infinite ease-in-out;
  
  &.circle-1 {
    width: 400px;
    height: 400px;
    top: -100px;
    left: -100px;
    animation-delay: 0s;
  }
  
  &.circle-2 {
    width: 300px;
    height: 300px;
    bottom: -50px;
    right: -50px;
    animation-delay: -7s;
  }
  
  &.circle-3 {
    width: 200px;
    height: 200px;
    top: 50%;
    right: 10%;
    animation-delay: -14s;
  }
  
  :global(.dark) & {
    background: linear-gradient(135deg, rgba(129, 140, 248, 0.1), rgba(167, 139, 250, 0.1));
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

// Sections
.features-section,
.benefits-section,
.cta-section,
.schedule-section,
.footer-cta {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--color-text-primary, #111);
  
  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.section-subtitle {
  text-align: center;
  font-size: 1.125rem;
  color: var(--color-text-secondary, #6b7280);
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

// Features Grid
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

// Benefits Grid
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

// CTA Section
.cta-section {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
  border-radius: 20px;
  
  :global(.dark) & {
    background: linear-gradient(135deg, rgba(129, 140, 248, 0.05), rgba(167, 139, 250, 0.05));
  }
}

.cta-card {
  text-align: center;
  padding: 3rem;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text-primary, #111);
  
  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.cta-description {
  font-size: 1.125rem;
  color: var(--color-text-secondary, #6b7280);
  margin-bottom: 2rem;
  
  :global(.dark) & {
    color: var(--color-text-secondary-dark, #9ca3af);
  }
}

// Schedule Section
.schedule-section {
  background: var(--color-bg-secondary, #f9fafb);
  border-radius: 20px;
  padding: 3rem 2rem;
  
  :global(.dark) & {
    background: var(--color-bg-secondary-dark, #111);
  }
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-dashboard {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary, #6366f1);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--color-primary-hover, #4f46e5);
    transform: translateY(-2px);
  }
  
  :global(.dark) & {
    background: var(--color-primary-dark, #818cf8);
    
    &:hover {
      background: var(--color-primary-dark-hover, #6366f1);
    }
  }
}

.tournament-summary {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.summary-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 25px;
  font-weight: 500;
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    border-color: var(--color-border-dark, #333);
  }
}

.chip-icon {
  font-size: 1.25rem;
}

.chip-label {
  color: var(--color-text-primary, #111);
  
  :global(.dark) & {
    color: var(--color-text-primary-dark, #f9fafb);
  }
}

.quick-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.875rem 1.5rem;
  background: var(--color-bg-primary, #fff);
  color: var(--color-text-primary, #111);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--color-primary, #6366f1);
    color: white;
    border-color: var(--color-primary, #6366f1);
    transform: translateY(-2px);
  }
  
  :global(.dark) & {
    background: var(--color-bg-primary-dark, #1a1a1a);
    color: var(--color-text-primary-dark, #f9fafb);
    border-color: var(--color-border-dark, #333);
    
    &:hover {
      background: var(--color-primary-dark, #818cf8);
      border-color: var(--color-primary-dark, #818cf8);
    }
  }
}

// Footer CTA
.footer-cta {
  text-align: center;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 20px;
  padding: 4rem 2rem;
  
  :global(.dark) & {
    background: linear-gradient(135deg, #818cf8, #a78bfa);
    box-shadow: 0 0 40px rgba(129, 140, 248, 0.3);
  }
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.footer-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.footer-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
}

.footer-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

// Animations
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
  
  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsive
@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 1.5rem;
  }
  
  .features-section,
  .benefits-section,
  .cta-section,
  .schedule-section,
  .footer-cta {
    padding: 3rem 1.5rem;
  }
  
  .schedule-header {
    flex-direction: column;
  }
  
  .quick-actions {
    flex-direction: column;
    
    .action-btn {
      width: 100%;
    }
  }
  
  .footer-actions {
    flex-direction: column;
    
    .cta-button {
      width: 100%;
    }
  }
}
</style>
