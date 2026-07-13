# Workspace Underwriter

Enterprise-ready Next.js underwriter workbench with thread-based AI chat, NextAuth integration, and feature-based architecture.

## Quick Start
1. Install dependencies:
   - `npm ci`
2. Configure environment:
   - Copy `.env.example` to `.env.local`
3. Start development server:
   - `npm run dev`

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
