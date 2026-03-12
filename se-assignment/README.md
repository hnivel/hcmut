# se-assignment

Simple front-end project built with Vite + React + TypeScript and TailwindCSS.

## Overview

This repository contains a small single-page application organized for an assignment. It uses Vite for bundling, React + TypeScript for the UI, and TailwindCSS for styling. The application is modular - components, pages, services, hooks and contexts are separated into folders to make the codebase easy to navigate.

## Project structure (important files/folders)

Top-level files

- `package.json` - npm scripts and dependencies
- `vite.config.ts` - Vite configuration
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` - TypeScript configurations
- `tailwind.config.ts` - Tailwind configuration

Key source folders (under `src/`)

- `src/main.tsx` - application entry
- `src/App.tsx` - root application component
- `src/pages/` - page-level components (dashboard, login, notifications)
- `src/components/` - shared UI components
- `src/layouts/` - layout components (example: `Sidebar.tsx`)
- `src/contexts/` - React contexts and providers (authentication)
- `src/hooks/` - custom hooks (auth helpers, login/signup hooks)
- `src/services/` - API/service layer (authentication/authorization, users, courses)
- `src/validators/` - form validation logic
- `src/constants/` - constants and mock data
- `src/lib/` - small utility helpers

## Getting started (development)

Prerequisites

- Node.js and npm installed

Install dependencies

1. Open a terminal in the project root.
2. Run:

```
npm install
```

Run the development server

```
npm run dev
```

This starts Vite and opens a local dev server (default: <http://localhost:5173>).

Build for production

```
npm run build
```

Preview the production build

```
npm run preview
```

Run tests (if present)

```
npm test
```

## How to contribute

If you'd like to contribute, follow these steps:

1. Fork the repository and create a branch for your work:

   - Branch name pattern: `feat/<short-description>` or `fix/<short-description>`

2. Install dependencies and run the dev server locally.

3. Make small, focused commits. Keep changes scoped to a single purpose.

4. Add or update tests when you change behavior.

5. Run linters and TypeScript checks before opening a pull request.

6. Open a pull request against the `main` branch and include a brief description of your changes.

Guidelines

- Follow existing code style and TypeScript types.
- Reuse or add components under `src/components` for consistent look-and-feel.
- Put API calls in `src/services` and data types in `*.interface.ts` files nearby.

## Development tips

- Use `src/contexts` for application-wide state like authentication.
- Keep page-level composition inside `src/pages/<page>/index.tsx` when possible.
- Utilities that are generic go into `src/lib`.

## Troubleshooting

- If the development server fails to start, delete `node_modules` and reinstall:

```
rm -rf node_modules package-lock.json; npm install
```
