<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/navigation/AppHeader.vue'
import AppFooter from '@/components/navigation/AppFooter.vue'
import LoginRegisterModal from '@/components/LoginRegisterModal.vue'

const isLoginModalOpen = ref(false)

const openLoginModal = () => {
  isLoginModalOpen.value = true
}
</script>

<template>
  <div class="app-shell">
    <AppHeader @open-login-modal="openLoginModal" />
    
    <main class="app-shell__main">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    
    <AppFooter />

    <LoginRegisterModal
      v-model="isLoginModalOpen"
      @update:model-value="isLoginModalOpen = $event"
    />
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__main {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1rem;

    @media (max-width: 768px) {
      padding: 1.5rem 1rem;
    }
  }
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
