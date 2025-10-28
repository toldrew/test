<script setup lang="ts">
import { RouterLink } from 'vue-router'

const currentYear = new Date().getFullYear()

const footerLinks = [
  { to: '/about', label: 'About' },
  { to: '#', label: 'Privacy' },
  { to: '#', label: 'Terms' },
  { to: '#', label: 'Contact' }
]

const socialLinks = [
  { href: '#', label: 'GitHub', icon: 'github' },
  { href: '#', label: 'Twitter', icon: 'twitter' },
  { href: '#', label: 'LinkedIn', icon: 'linkedin' }
]
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__container">
      <div class="app-footer__content">
        <div class="app-footer__section">
          <div class="app-footer__brand">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
              <path d="M8 16L14 22L24 10" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="app-footer__brand-text">App</span>
          </div>
          <p class="app-footer__description">
            Building amazing experiences with Vue 3 and modern web technologies.
          </p>
        </div>

        <div class="app-footer__section">
          <h3 class="app-footer__heading">Quick Links</h3>
          <nav class="app-footer__links">
            <RouterLink
              v-for="link in footerLinks"
              :key="link.to"
              :to="link.to"
              class="app-footer__link"
            >
              {{ link.label }}
            </RouterLink>
          </nav>
        </div>

        <div class="app-footer__section">
          <h3 class="app-footer__heading">Connect</h3>
          <div class="app-footer__social">
            <a
              v-for="social in socialLinks"
              :key="social.icon"
              :href="social.href"
              :aria-label="social.label"
              class="app-footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg v-if="social.icon === 'github'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z"/>
              </svg>
              <svg v-else-if="social.icon === 'twitter'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
              <svg v-else-if="social.icon === 'linkedin'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM4.943 8.57c-.86 0-1.556-.697-1.556-1.556 0-.86.697-1.556 1.556-1.556.86 0 1.556.697 1.556 1.556 0 .86-.697 1.556-1.556 1.556zm1.333 9.769H3.61V9.75h2.667v8.589zM19.998 0H.002C.001 0 0 0 0 .002v19.996C0 20 0 20 .002 20h19.996c.002 0 .002 0 .002-.002V.002C20 0 20 0 19.998 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="app-footer__bottom">
        <p class="app-footer__copyright">
          &copy; {{ currentYear }} App. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  background-color: var(--color-background-alt);
  border-top: 1px solid var(--color-border);
  margin-top: auto;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 1rem 1.5rem;
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__brand-text {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  &__description {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0;
  }

  &__heading {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__link {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-primary);
    }
  }

  &__social {
    display: flex;
    gap: 1rem;
  }

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    color: var(--color-text-secondary);
    background-color: transparent;
    transition: all 0.2s ease;

    &:hover {
      color: var(--color-primary);
      background-color: var(--color-surface);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  &__bottom {
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
    text-align: center;
  }

  &__copyright {
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
    margin: 0;
  }
}
</style>
