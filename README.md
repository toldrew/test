# Vue 3 + Vite + TypeScript Application

A modern Vue 3 application scaffolded with Vite, TypeScript, and essential tooling for building multi-page applications.

## Features

- ⚡️ **Vue 3** - Composition API with `<script setup>` syntax
- 🚀 **Vite** - Fast development and optimized builds
- 🔷 **TypeScript** - Type safety throughout the application
- 🎨 **SCSS** - Powerful styling with Sass/SCSS support
- 🛣️ **Vue Router 4** - Client-side routing with navigation guards
- 🗃️ **Pinia** - Intuitive state management
- 📏 **ESLint + Prettier** - Code quality and consistent formatting
- 📁 **Organized Structure** - Logical directory organization for scalability

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable Vue components
├── composables/    # Composition API composables
├── router/         # Vue Router configuration
├── services/       # API and external service integrations
├── stores/         # Pinia stores for state management
├── styles/         # Global styles and SCSS files
├── views/          # Page-level components
├── App.vue         # Root component
└── main.ts         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check and fix code issues:

```bash
npm run lint
```

## Available Routes

The application includes the following routes:

- `/` - Home page
- `/dashboard` - Dashboard with sample statistics
- `/about` - About page with application information
- `*` - 404 Not Found page (catch-all route)

## Configuration

### Path Aliases

The project is configured with the `@` alias pointing to the `src/` directory:

```typescript
import MyComponent from '@/components/MyComponent.vue'
import { useMyStore } from '@/stores/myStore'
```

### TypeScript

TypeScript configuration is split into:
- `tsconfig.json` - Root configuration
- `tsconfig.app.json` - Application code configuration
- `tsconfig.node.json` - Node/build tool configuration

### ESLint & Prettier

- ESLint configuration: `.eslintrc.cjs`
- Prettier configuration: `.prettierrc.json`

## State Management

The project uses Pinia for state management. Example store is available at `src/stores/counter.ts`.

To create a new store:

```typescript
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMyStore = defineStore('myStore', () => {
  const data = ref(null)
  
  function updateData(newData) {
    data.value = newData
  }
  
  return { data, updateData }
})
```

## Styling

Global styles are located in `src/styles/main.scss`. The project includes:
- CSS reset for consistent cross-browser styling
- Base typography styles
- SCSS support for component styles

Use scoped styles in components:

```vue
<style scoped lang="scss">
.my-component {
  // Your styles here
}
</style>
```

## Next Steps

This scaffold provides a solid foundation for building Vue 3 applications. Consider adding:

- Component library (e.g., Vuetify, Element Plus, or custom design system)
- API integration layer in `services/`
- Authentication and authorization
- Testing setup (Vitest, Cypress, or Playwright)
- Environment-specific configuration
- CI/CD pipelines

## License

[Add your license here]
