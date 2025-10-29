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
- 📄 **Export Functionality** - PDF, Word, and Print support for schedules
- 🎭 **Animations** - Smooth entrance and hover effects with reduced-motion support
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop

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
- `/dashboard` - Dashboard with tournament management (requires authentication)
- `/dashboard/tournaments/:id` - Tournament detail view (requires authentication)
- `/about` - About page with application information
- `*` - 404 Not Found page (catch-all route)

## Authentication

The application includes a client-side authentication system with the following features:

- User registration with email, password, and optional name
- Login/logout functionality
- Password hashing using SHA-256 (via Web Crypto API)
- Persistent sessions using localStorage
- Protected routes (Dashboard) requiring authentication
- Per-user data isolation for tournaments and teams

### Security Considerations

**⚠️ Important: This is a CLIENT-SIDE authentication implementation designed for demonstration and local use only.**

This authentication system:
- Stores all user data locally in the browser's localStorage
- Uses client-side password hashing (SHA-256)
- Has NO server-side validation or security
- Should NOT be used in production environments with sensitive data
- Is vulnerable to various attacks (XSS, local storage inspection, etc.)

**For production applications, you should:**
- Implement proper server-side authentication with secure password hashing (bcrypt, Argon2)
- Use HTTPS for all communications
- Implement JWT or session-based authentication with secure cookies
- Add rate limiting, CSRF protection, and other security measures
- Never store sensitive data in localStorage
- Use secure backend APIs for user management and data storage
- Implement proper input validation and sanitization on the server
- Consider using established authentication services (Auth0, Firebase Auth, etc.)

This client-side implementation is suitable for:
- Learning and prototyping
- Local/offline applications
- Personal projects with non-sensitive data
- Demos and proof-of-concepts

## Export Functionality

The application provides robust export capabilities for tournament schedules:

### Supported Export Formats

1. **PDF Export** - Generates a formatted PDF document with tournament details, rounds, and matches
2. **Word Export** - Creates a .docx file with structured tables for easy editing
3. **Print** - Browser-native printing with optimized print stylesheets

### Using Export Features

To export a tournament schedule:

1. Navigate to a tournament detail page
2. Use the export action bar at the top of the schedule
3. Choose your preferred export format:
   - **Экспорт в PDF** - Download as PDF
   - **Экспорт в Word** - Download as Word document
   - **Печать** - Open print dialog

### Export Features

- **Localization** - All dates formatted in ru-RU locale
- **Theme Colors** - Exports use application theme colors for branding
- **Complete Data** - Includes tournament name, type, dates, rounds, matches, scores, and statuses
- **Progress Feedback** - Loading overlay with progress indicator during export
- **Error Handling** - Toast notifications for success/failure

### Implementation Details

The export functionality is implemented in `src/services/exporter.ts` using:
- `jspdf` + `jspdf-autotable` for PDF generation
- `docx` package for Word document creation
- Print media queries for optimized print output

### Performance Considerations

- **Client-side Processing** - All exports are generated in the browser
- **Large Tournaments** - Very large tournaments (100+ matches) may take a few seconds to export
- **Memory Usage** - Export operations load all data into memory temporarily
- **Browser Compatibility** - Works in all modern browsers (Chrome, Firefox, Safari, Edge)

### Limitations

- Limited Cyrillic font support in PDFs (uses built-in fonts)
- Complex formatting in Word exports may not match exactly with advanced Word features
- Print output depends on browser's print implementation
- No server-side storage of exported documents

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
