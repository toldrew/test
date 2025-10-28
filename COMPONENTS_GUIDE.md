# Components Guide

## Overview

This document describes the UI primitives and layout components built for the application.

## Theme System

### Theme Store (`/src/stores/theme.ts`)

Pinia store managing the application theme with light/dark mode support.

**Usage:**
```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
themeStore.toggleTheme() // Switch between light and dark
themeStore.setTheme('dark') // Set specific theme
themeStore.currentTheme // Current theme ('light' or 'dark')
```

**Features:**
- Persists theme preference in localStorage
- Initializes from localStorage or system preference
- Applies theme via CSS custom properties on `document.documentElement`

### CSS Custom Properties (`/src/styles/theme.scss`)

**Colors:**
- `--color-background` - Main background
- `--color-background-alt` - Alternative background (headers, footers)
- `--color-background-elevated` - Elevated surfaces (modals)
- `--color-surface` - Surface backgrounds
- `--color-text-primary` - Primary text color
- `--color-text-secondary` - Secondary text color
- `--color-text-tertiary` - Tertiary text color
- `--color-primary` - Primary brand color
- `--color-border` - Border color
- `--color-success`, `--color-warning`, `--color-error`, `--color-info` - Status colors

**Shadows:**
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`

## UI Components

### BaseButton (`/src/components/ui/BaseButton.vue`)

A versatile button component with multiple variants and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: boolean (default: false)
- `loading`: boolean (default: false)
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `fullWidth`: boolean (default: false)

**Events:**
- `click`: Emitted when button is clicked

**Example:**
```vue
<BaseButton variant="primary" size="md" @click="handleClick">
  Click me
</BaseButton>
```

### BaseInput (`/src/components/ui/BaseInput.vue`)

Text input component with label and error state support.

**Props:**
- `modelValue`: string | number
- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' (default: 'text')
- `placeholder`: string
- `disabled`: boolean
- `readonly`: boolean
- `required`: boolean
- `error`: string - Error message to display
- `label`: string
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Events:**
- `update:modelValue`: Emitted on input change
- `blur`: Emitted on blur
- `focus`: Emitted on focus

**Example:**
```vue
<BaseInput
  v-model="email"
  type="email"
  label="Email"
  placeholder="Enter your email"
  :error="emailError"
/>
```

### BaseSelect (`/src/components/ui/BaseSelect.vue`)

Select dropdown component.

**Props:**
- `modelValue`: string | number
- `options`: SelectOption[] - Array of { value, label, disabled? }
- `placeholder`: string
- `disabled`: boolean
- `required`: boolean
- `error`: string
- `label`: string
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Events:**
- `update:modelValue`: Emitted on selection change
- `change`: Emitted on selection change

**Example:**
```vue
<BaseSelect
  v-model="country"
  :options="[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' }
  ]"
  label="Country"
/>
```

### BaseTextarea (`/src/components/ui/BaseTextarea.vue`)

Textarea component with character count support.

**Props:**
- `modelValue`: string
- `placeholder`: string
- `disabled`: boolean
- `readonly`: boolean
- `required`: boolean
- `error`: string
- `label`: string
- `rows`: number (default: 4)
- `maxlength`: number
- `resize`: 'none' | 'vertical' | 'horizontal' | 'both' (default: 'vertical')

**Events:**
- `update:modelValue`: Emitted on input change
- `blur`: Emitted on blur
- `focus`: Emitted on focus

**Example:**
```vue
<BaseTextarea
  v-model="description"
  label="Description"
  :maxlength="500"
  placeholder="Enter description"
/>
```

### BaseIconButton (`/src/components/ui/BaseIconButton.vue`)

Icon-only button component.

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger' (default: 'ghost')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: boolean
- `ariaLabel`: string (required for accessibility)
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `rounded`: boolean (default: true)

**Events:**
- `click`: Emitted when button is clicked

**Example:**
```vue
<BaseIconButton aria-label="Close" @click="close">
  <CloseIcon />
</BaseIconButton>
```

### BaseModal (`/src/components/ui/BaseModal.vue`)

Accessible modal dialog with focus trapping.

**Props:**
- `modelValue`: boolean - Controls modal visibility
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'md')
- `closeOnOverlay`: boolean (default: true)
- `showClose`: boolean (default: true)

**Events:**
- `update:modelValue`: Emitted when modal should close
- `close`: Emitted when modal is closed

**Slots:**
- `header`: Custom header content
- `default`: Modal body content
- `footer`: Modal footer content

**Features:**
- Focus trapping
- Escape key to close
- Background scroll lock
- Teleports to body
- Accessible with ARIA attributes

**Example:**
```vue
<BaseModal v-model="isOpen" title="Modal Title" size="md">
  <p>Modal content goes here</p>
  <template #footer>
    <BaseButton @click="isOpen = false">Close</BaseButton>
  </template>
</BaseModal>
```

### ThemeToggle (`/src/components/ui/ThemeToggle.vue`)

Button component to toggle between light and dark themes.

**Usage:**
```vue
<ThemeToggle />
```

## Navigation Components

### AppHeader (`/src/components/navigation/AppHeader.vue`)

Application header with navigation, theme toggle, and login button.

**Events:**
- `openLoginModal`: Emitted when login button is clicked

**Features:**
- Responsive with hamburger menu on mobile
- Active route highlighting
- Theme toggle integration
- Sticky positioning

### AppFooter (`/src/components/navigation/AppFooter.vue`)

Application footer with links and social icons.

**Features:**
- Responsive grid layout
- Quick links and social media links
- Copyright notice

## Layout Components

### AppShell (`/src/layouts/AppShell.vue`)

Main application layout shell containing header, router-view, and footer.

**Features:**
- Integrates header and footer
- Page transition animations
- Login/Register modal management
- Responsive layout

## Modal Components

### LoginRegisterModal (`/src/components/LoginRegisterModal.vue`)

Modal with tabbed interface for login and registration forms.

**Props:**
- `modelValue`: boolean - Controls modal visibility

**Events:**
- `update:modelValue`: Emitted when modal should close

**Features:**
- Tabbed interface (Login/Register)
- Form validation structure
- Placeholder for future authentication logic

## Global Transitions

Global transition classes available in `main.scss`:

- `.fade-*` - Fade in/out
- `.slide-*` - Horizontal slide
- `.slide-up-*` - Vertical slide

## Responsive Breakpoints

- Mobile: < 768px
- Desktop: >= 768px

## Accessibility Features

- Focus-visible outlines on all interactive elements
- ARIA labels on icon buttons
- Focus trapping in modals
- Keyboard navigation support
- Semantic HTML structure
