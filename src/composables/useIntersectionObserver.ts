import { onMounted, onUnmounted, type Ref } from 'vue'

export interface IntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

/**
 * Intersection Observer composable for scroll animations
 * Observes when an element enters the viewport
 * 
 * @example
 * const target = ref<HTMLElement>()
 * useIntersectionObserver(target, (entries) => {
 *   entries.forEach(entry => {
 *     if (entry.isIntersecting) {
 *       entry.target.classList.add('animate-in')
 *     }
 *   })
 * })
 */
export function useIntersectionObserver(
  target: Ref<Element | undefined>,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverOptions = {}
) {
  let observer: IntersectionObserver | null = null

  const {
    root = null,
    rootMargin = '0px',
    threshold = 0.1
  } = options

  onMounted(() => {
    if (!target.value) return

    observer = new IntersectionObserver(callback, {
      root,
      rootMargin,
      threshold
    })

    observer.observe(target.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    observer
  }
}
