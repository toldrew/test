import { watch, type Ref } from 'vue'

export function useTitle(title: Ref<string> | string) {
  if (typeof title === 'string') {
    document.title = title
  } else {
    watch(
      title,
      (newTitle) => {
        document.title = newTitle
      },
      { immediate: true }
    )
  }
}
