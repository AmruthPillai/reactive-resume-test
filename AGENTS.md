# Reactive Resume - Agent Documentation

This document provides essential information about the Reactive Resume project structure, architecture, and conventions to help AI agents understand and work with the codebase effectively.

## Project Overview

**Reactive Resume** is a free and open-source resume builder application that prioritizes user privacy. It's a full-stack web application built with modern web technologies, allowing users to create, customize, and share their resumes securely.

- **License**: MIT
- **Version**: v5.0.0
- **Package Manager**: Bun v1.3.2
- **Type**: ESM (ES Modules)

## Tech Stack

### Core Framework & Runtime

- **Runtime**: Bun (JavaScript runtime)
- **Framework**: TanStack Start (React framework with SSR)
- **UI Library**: React v19.2.0
- **Language**: TypeScript v5.9.3 (strict mode enabled)

### Routing & State Management

- **Router**: TanStack Router v1.136.8 (file-based routing)
- **State Management**: Zustand v5.0.8
- **Server State**: TanStack Query v5.90.7 (React Query)
- **Form Management**: React Hook Form v7.66.0

### API & Backend

- **API Framework**: ORPC (type-safe RPC framework)
- **Server**: Nitro v3.0.1-alpha.1 (for SSR/production)
- **Database**: PostgreSQL with Drizzle ORM v0.44.7
- **Authentication**: Better Auth v1.3.34

### UI & Styling

- **CSS Framework**: Tailwind CSS v4.1.17
- **UI Components**: Radix UI primitives
- **Icons**: Phosphor Icons
- **Animations**: Motion v12.23.24 (Framer Motion successor)
- **Rich Text Editor**: Tiptap v3.10.7

### Internationalization

- **i18n**: Lingui v5.6.0
- **Supported Locales**: en-US, de-DE, zu-ZA

### Build Tools

- **Bundler**: Vite v7.2.2
- **Linter/Formatter**: Biome v2.3.5
- **Type Checking**: TypeScript compiler

### Additional Libraries

- **Drag & Drop**: @dnd-kit (core, sortable, modifiers)
- **Image Processing**: Sharp v0.34.5
- **QR Code**: qrcode.react v4.2.0
- **Search**: Fuse.js v7.1.0
- **Validation**: Zod v4.1.12
- **Utilities**: es-toolkit, immer, clsx, tailwind-merge

## Project Structure

```
reactive-resume-start/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── input/          # Form input components (chip, color, icon, rich, url)
│   │   ├── layout/         # Layout components (aurora background, loading screen)
│   │   ├── locale/         # Locale selection components
│   │   ├── resume/         # Resume-specific components (preview, hooks)
│   │   ├── theme/          # Theme management components
│   │   ├── typography/     # Typography components and font management
│   │   ├── ui/             # Base UI components (35+ components)
│   │   └── user/           # User-related components
│   ├── constants/          # Application constants
│   ├── dialogs/            # Modal dialogs
│   │   ├── auth/           # Authentication dialogs
│   │   ├── resume/         # Resume management dialogs (14 files)
│   │   ├── manager.tsx     # Dialog manager
│   │   └── store.ts        # Dialog state store
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Third-party integrations
│   │   ├── auth/           # Authentication integration (Better Auth)
│   │   ├── drizzle/        # Database schema and utilities
│   │   └── orpc/           # ORPC API setup
│   │       ├── router/     # API route definitions (auth, resume, storage)
│   │       ├── services/   # Business logic services
│   │       └── helpers/    # Helper functions
│   ├── routes/             # TanStack Router file-based routes
│   │   ├── __root.tsx      # Root route with layout
│   │   ├── _home/          # Home page routes
│   │   ├── $username.$slug.tsx  # Public resume view
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication routes (10 files)
│   │   ├── builder/        # Resume builder routes (43 files)
│   │   ├── dashboard/      # User dashboard routes (18 files)
│   │   ├── printer/        # Print view route
│   │   └── uploads/        # File upload route
│   ├── schema/             # Zod schemas and types
│   │   └── resume/         # Resume data schemas
│   ├── utils/              # Utility functions
│   │   ├── env.ts          # Environment variable validation
│   │   ├── locale.ts       # Locale utilities
│   │   ├── resume/         # Resume-specific utilities
│   │   ├── string.ts       # String utilities
│   │   ├── style.ts        # Style utilities
│   │   └── theme.ts        # Theme utilities
│   ├── router.tsx          # Router configuration
│   ├── routeTree.gen.ts    # Auto-generated route tree
│   └── styles.css          # Global styles
├── public/                 # Static assets
├── locales/                # Translation files (.po format)
├── migrations/             # Database migrations
├── scripts/                # Utility scripts
├── data/                   # Data directory (fonts, uploads)
├── dist/                   # Build output
├── entrypoint.ts           # Production server entry point
├── vite.config.ts          # Vite configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── tsconfig.json           # TypeScript configuration
├── biome.json              # Biome linter configuration
└── components.json         # shadcn/ui components configuration
```

## Architecture Patterns

### File-Based Routing

Routes are defined using TanStack Router's file-based routing system:

- `__root.tsx` - Root layout route
- `_home/` - Home page routes (underscore prefix for layout groups)
- `$username.$slug.tsx` - Dynamic route parameters
- Routes automatically generate types in `routeTree.gen.ts`

### API Architecture (ORPC)

- **Type-safe RPC**: Uses ORPC for end-to-end type safety
- **Router**: Defined in `src/integrations/orpc/router/`
  - `auth.ts` - Authentication endpoints
  - `resume.ts` - Resume CRUD operations
  - `storage.ts` - File storage operations
- **Client**: Created in `src/integrations/orpc/client.ts`
- **Services**: Business logic in `src/integrations/orpc/services/`
- **Integration**: Uses TanStack Query utilities for React integration

### Database Schema (Drizzle ORM)

- **Schema Location**: `src/integrations/drizzle/schema.ts`
- **Database**: PostgreSQL
- **Migrations**: Stored in `migrations/` directory
- **Migrations Generated**: `bun run db:generate`
- **Migrations Applied**: `bun run db:migrate` or auto-applied in production

### Authentication (Better Auth)

- **Provider**: Better Auth library
- **OAuth Providers**: Google, GitHub, Custom OAuth
- **Session Management**: Server-side sessions stored in database
- **Client Integration**: `src/integrations/auth/client.ts`

### State Management

- **Server State**: TanStack Query for API data
- **Client State**: Zustand stores (found in `dialogs/store.ts` and component stores)
- **Form State**: React Hook Form with Zod validation

## Development Workflow

### Available Scripts

```bash
# Development
bun run dev              # Start dev server on port 3000

# Building
bun run build            # Build for production

# Database
bun run db:generate      # Generate migration files
bun run db:migrate       # Run migrations
bun run db:push          # Push schema changes directly
bun run db:pull          # Pull schema from database
bun run db:studio        # Open Drizzle Studio

# Code Quality
bun run check            # Run Biome linter/formatter
bun run typecheck        # Type check without emitting

# Internationalization
bun run lingui:extract   # Extract translatable strings

# Production
bun run start            # Start production server (Nitro)
bun run start:bun        # Start production server (Bun)
```

### TypeScript Configuration

- **Strict Mode**: Enabled
- **Path Aliases**:
  - `@/*` → `./src/*`
  - `@/builder/*` → `./src/routes/builder/$resumeId/*`
- **Target**: ES2022
- **Module**: ESNext
- **JSX**: React JSX (automatic)

### Code Style

- **Linter**: Biome (configured in `biome.json`)
- **Formatting**: Biome auto-formatting
- **Conventions**:
  - Prefer early returns (one-line)
  - Strong TypeScript typing
  - Use tabs for indentation (inferred from codebase)

## Environment Variables

Environment variables are validated using `@t3-oss/env-core` in `src/utils/env.ts`:

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string (format: `postgresql://...`)
- `AUTH_SECRET` - Secret key for authentication
- `APP_URL` - Application URL (defaults to `http://localhost:3000`)

### Optional Variables

- **Google OAuth**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **GitHub OAuth**: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- **S3 Storage**: `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_SESSION_TOKEN`
- **Custom OAuth**: `OAUTH_PROVIDER_NAME`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, `OAUTH_DISCOVERY_URL`, `OAUTH_AUTHORIZATION_URL`, `OAUTH_REDIRECT_URI`
- **Feature Flags**: `FLAG_DISABLE_SIGNUP` (default: false)

### Client-Side Variables

- Variables prefixed with `VITE_` are available on the client

## Database Schema

Key tables (from Drizzle schema):

- `user` - User accounts
- `session` - User sessions
- `account` - OAuth account links
- `resume` - Resume documents
- Additional tables for resume data, storage, etc.

## API Endpoints

### ORPC Routes

- `/api/rpc` - Main RPC endpoint
- Routes defined in `src/integrations/orpc/router/`
- Type-safe client available via `orpc` utility from `@/integrations/orpc/client`

### TanStack Query Integration

- Use `orpc` utility for type-safe API calls
- Automatically integrated with TanStack Query
- SSR support via `@tanstack/react-router-ssr-query`

## Key Patterns

### Component Structure

- Components use TypeScript with strict typing
- UI components follow Radix UI patterns
- Custom hooks for reusable logic

### Form Handling

- React Hook Form for form state
- Zod for schema validation
- `@hookform/resolvers` for integration

### Styling

- Tailwind CSS utility classes
- `clsx` and `tailwind-merge` for conditional classes
- CSS variables for theming

### Internationalization

- Lingui for i18n
- Translation files in `locales/` directory (.po format)
- Use `t` or `<Trans>` macro for translatable strings, imported from `@lingui/core/macro` and `@lingui/react/macro` respectively.

## Production Deployment

### Build Output

- Client: `.output/public/`
- Server: `.output/server/`

### Docker Support

- `Dockerfile` - Standard Docker build
- `compose.yml` - Docker Compose configuration

## Important Notes

1. **Package Manager**: Always use `bun` instead of `npm`, `pnpm` or `yarn`
2. **Type Safety**: The project emphasizes end-to-end type safety (TypeScript + Zod + ORPC)
3. **SSR**: TanStack Start provides SSR capabilities
4. **Database Migrations**: Run automatically in production, manually in development
5. **Route Generation**: Route tree is auto-generated - don't edit `routeTree.gen.ts` manually
6. **Environment Validation**: Environment variables are validated at runtime using Zod schemas

## Common Tasks

### Adding a New Route

1. Create a new file in `src/routes/` following TanStack Router conventions
2. The route tree will auto-generate when running `bun run dev`
3. Use `Link` component from `@tanstack/react-router` for internal navigation

### Adding a New API Endpoint

1. Add route handler in `src/integrations/orpc/router/`
2. Add service logic in `src/integrations/orpc/services/`
3. Use `orpc` utility in components for type-safe calls

### Adding a New Database Table

1. Define schema in `src/integrations/drizzle/schema.ts`
2. Run `bun run db:generate` to create migration
3. Run `bun run db:migrate` to apply migration

### Adding Translations

1. Use `t` or `<Trans>` macro from `@lingui/core/macro` or `@lingui/react/macro` respectively in when translating inside components or functions
2. Run `bun run lingui:extract` to extract strings
3. Edit `.po` files in `locales/` directory
