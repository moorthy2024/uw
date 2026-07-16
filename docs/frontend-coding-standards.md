# Frontend Coding Standards

## Purpose
This document defines frontend coding conventions for the `uw-main` Next.js project. It is intended to keep UI code consistent, readable, maintainable, and aligned with this repository's existing patterns.

## Scope
Applies to:
- `src/app` page and route components
- `src/components` reusable UI elements
- `src/features` domain-specific logic and feature slices
- `src/lib` utilities used by the frontend
- `src/styles` Tailwind and global styling

## Formatting
- Use 2 spaces for indentation.
- Use LF line endings.
- Keep lines under 120 characters when practical.
- Use single quotes in TypeScript/JSX unless double quotes are required by HTML attributes or JSON.
- Prefer trailing commas for multiline arrays, objects, and type definitions.
- Keep blank lines to separate logical blocks, especially within components and functions.
- Avoid extra whitespace at the end of lines.

## File Naming
- Components: `PascalCase.tsx` (example: `RoleSelection.tsx`).
- Hooks/utilities: `camelCase.ts` or `kebab-case.ts` when appropriate.
- Feature folders: lowercase or `kebab-case`.
- Keep filenames short and descriptive.

## Component Structure
- Prefer function components with explicit props interfaces.
- Example:
  ```tsx
  interface RoleSelectionProps {
    onSelectRole: (role: 'underwriter' | 'manager') => void;
  }

  export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
    return <div>...</div>;
  }
  ```
- Keep page components lean; delegate complex UI or state into child components.
- Use `use client` only in components that require client-only behavior.
- Place `use client` at the top of the file and avoid mixing server and client logic within the same component.

## TypeScript
- Enable strict typing and avoid `any` unless strongly justified.
- Prefer `interface` for props and public object shapes.
- Use `type` aliases for unions, mapped types, and utility types.
- Prefer explicit return types on exported functions and component props.
- Avoid non-null assertions (`!`) unless a value is proven to be present.
- Use discriminated unions for conditional prop types when needed.
- Keep types local to the module unless they are shared across multiple features.

## React Patterns
- Use hooks consistently: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`.
- Follow the rules of hooks: call them conditionally only in the top-level component scope.
- Keep state close to where it is used. Avoid lifting state unnecessarily.
- Prefer props over context for local data flow. Use context for widely shared application state.
- Keep components focused: a component should do one thing well.
- Extract repeated markup or complex behavior into reusable components.
- Use destructuring for props and values returned from hooks.

## Styling
- Use Tailwind CSS utility classes for visual styling.
- Prefer `className` over inline `style` unless dynamic complex values are required.
- Keep class order readable and group related utilities logically.
- Use `tailwind-merge` for conditional class merging in components.
- Avoid duplicate styles; extract repeated class patterns into reusable components or helper functions.
- Use semantic HTML tags and accessible attributes (`alt`, `aria-*`, `role`) when needed.

## Accessibility
- Use semantic HTML elements: `button`, `label`, `nav`, `header`, `main`, `section`, etc.
- Provide meaningful `alt` text for images.
- Ensure form controls are labelled and keyboard accessible.
- Use `aria-*` attributes only when native HTML semantics are insufficient.
- Keep focus order logical and maintain visible focus outlines.

## Project Architecture
- `src/app`: page routes, layouts, and global providers.
- `src/components`: reusable UI components and presentational elements.
- `src/features`: feature modules and domain-specific logic.
- `src/lib`: shared utilities, API helpers, and configuration.
- `src/types`: shared TypeScript declarations.
- Do not mix business logic directly into page files; use feature modules or helper functions.

## Imports and Module Resolution
- Use absolute imports from `src/` when supported by the project configuration.
- Order imports by groups:
  1. React and third-party libraries
  2. Absolute imports from `src/`
  3. Relative imports
- Avoid deep import paths when a shorter alias or centralized module can be used.

## Linting and Validation
- Run `npm run lint` regularly.
- Run `npm run typecheck` before merging changes.
- Treat lint errors as blockers for PRs.

## Documentation and Comments
- Add JSDoc-style comments for exported functions and complex logic.
- Keep comments concise and focused on intent, not implementation details.
- Use README or docs pages for architecture, deployment, and process-level guidance.
- When a component or module has important usage rules, document them in a short comment at the top of the file.

## Best Practices
- Keep UI state predictable and derived state minimal.
- Favor composition over inheritance.
- Avoid deeply nested ternaries or conditional logic inside JSX; extract to helper functions or subcomponents.
- Use explicit boolean checks rather than implicit truthiness when handling props and state.
- Keep component props stable and avoid passing anonymous functions unnecessarily.

## Repository-specific notes
- This repo follows Next.js 14 conventions and uses Tailwind CSS.
- Use `src/app` routing with React Server Components by default.
- Mark only truly interactive components with `use client`.
- Keep shared design primitives inside `src/components/ui` or `src/components`.

## How to Use This Document
- Review this file when creating new frontend code.
- Use it as a common reference during code reviews and PRs.
- Update it whenever the repo adopts new conventions or tooling.
