# CSS Organization

This directory contains all CSS styles organized by purpose and scope.

## Structure

```
styles/
├── index.css              # Main entry point
├── base/                  # Base styles and foundations
│   ├── variables.css      # CSS custom properties and themes
│   ├── typography.css     # Typography styles
│   └── animations.css     # Keyframes and animation utilities
├── components/            # Reusable component styles
│   ├── buttons.css        # Button variants
│   ├── cards.css          # Card components
│   ├── forms.css          # Form elements
│   └── landing.module.css # Landing page components
├── layouts/               # Layout-specific styles
│   ├── dashboard.css      # Dashboard layout
│   └── marketing.css      # Marketing pages layout
└── utilities/             # Utility classes
    └── helpers.css        # Helper utilities
```

## Usage

Import the main CSS file in your layout:

```tsx
import "../styles/index.css";
```

## Guidelines

1. **Base styles** - Global styles, variables, and typography
2. **Components** - Reusable UI component styles
3. **Layouts** - Page-specific layout styles
4. **Utilities** - Helper classes and utilities

## Naming Convention

- Use kebab-case for CSS classes
- Prefix layout-specific classes with the layout name
- Use semantic naming over presentational naming