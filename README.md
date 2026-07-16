# Workspace Underwriter

Enterprise-ready Next.js underwriter workbench with thread-based AI chat, NextAuth integration, and feature-based architecture.

## Quick Start
1. Confirm the project root is the `src/` folder.
   - `cd src`
2. Install dependencies:
   - `npm ci`
3. Configure environment:
   - Copy `.env.example` to `.env.local`
4. Start development server:
   - `npm run dev`

> Note: This repository has moved package and config files into `src/`. Root-level `.next` and `node_modules` directories are stale and should be ignored.

## Scripts
- `npm run dev`: start local development server.
- `npm run build`: production build.
- `npm run start`: start production server.
- `npm run typecheck`: TypeScript verification.
- `npm run check`: typecheck + build.

## Project Structure
- `src/app`: routes, layouts, API endpoints.
- `src/components`: application and UI components.
- `src/features`: domain modules (auth/chat/context).
- `src/lib`: infra modules (api/env/logging/utils).
- `src/types`: shared domain types.

See:
- `docs/ARCHITECTURE.md`
- `docs/DEPLOYMENT.md`
- `docs/frontend-coding-standards.md`
