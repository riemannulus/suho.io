# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a monorepo for suho.io that uses:
- **Bun** as the JavaScript runtime and package manager (not Node.js)
- **Moon** as the build system and task runner
- **TypeScript** throughout all projects
- **Workspace structure** with apps and packages

## Key Technologies and Conventions

### Runtime: Bun (NOT Node.js)
- Use `bun` commands instead of `node`/`npm`/`yarn`/`pnpm`
- Use `bun test` instead of jest/vitest
- Use `bun install` for package installation
- Use `bun run <script>` for running scripts
- Bun automatically loads .env files (no dotenv needed)
- For SQLite: use `bun:sqlite` (not better-sqlite3)
- For Redis: use `Bun.redis` (not ioredis)
- For Postgres: use `Bun.sql` (not pg)

### Build System: Moon
All tasks are run through Moon with the format `moon run <project>:<task>`:
- `moon run tools:dev` - Start the tools app development server
- `moon run tools:build` - Build the tools app for production
- `moon run tools:start` - Start the tools app production server
- `moon run tools:test` - Run tests for the tools app
- `moon run tools:type-check` - Type check the tools app
- `moon run tools:new-tool` - Generate a new tool component
- `moon run multitools:test` - Run tests for the multitools package
- `moon run multitools:build` - Build the multitools package
- `moon run :build` - Build all projects

### Frontend Development (apps/tools)
The tools app uses Bun's HTML imports approach:
- **NO Vite/Webpack** - Bun handles bundling automatically
- HTML files can import .tsx/.jsx files directly
- CSS imports work in TypeScript files
- Hot module replacement is built-in with `bun --hot`
- React 19 with React Router for navigation
- Tailwind CSS for styling with Radix UI components

### High-Level Architecture

```
suho.io/
├── apps/
│   └── tools/              # Web tools application
│       ├── src/
│       │   ├── index.tsx   # Bun server entry point
│       │   ├── index.html  # HTML entry point
│       │   ├── frontend.tsx # React app entry
│       │   ├── components/ # Shared UI components
│       │   ├── tools/      # Individual tool implementations
│       │   └── lib/        # Tool registry and utilities
│       └── moon.yml        # Moon task configuration
├── packages/
│   └── multitools/         # Shared utility library
├── templates/
│   ├── tools/              # Tool generation templates
│   ├── github-actions/     # GitHub Actions workflow templates
│   └── docker-compose-service/ # Docker Compose service templates
└── .github/
    └── workflows/          # GitHub Actions CI/CD workflows
```

### Adding New Tools
Tools are self-contained React components registered in the tool registry:
1. Run `moon run tools:new-tool` to generate boilerplate
2. Tool structure: `apps/tools/src/tools/<tool-name>/`
   - `index.ts` - Tool metadata export
   - `<ToolName>.tsx` - React component
3. Tools are automatically registered in `src/lib/tool-registry.ts`
4. Each tool exports metadata (id, name, description, tags) and component

### Testing Strategy
- Use `bun test` for all testing
- Test files use `.test.ts` or `.test.tsx` extension
- Bun test syntax:
  ```typescript
  import { test, expect } from "bun:test";
  test("description", () => {
    expect(value).toBe(expected);
  });
  ```

### Common Workflows
- Development: `moon run tools:dev` (starts full-stack dev server)
- Production build: `moon run tools:build` (builds static assets)
- Add new tool: `moon run tools:new-tool` (interactive generator)
- Type checking: `moon run tools:type-check`
- Clean build: `moon run tools:clean`
- **Add new app CI/CD**: `moon generate github-actions` (generates GitHub Actions workflow)
- **Add new Docker service**: `moon generate docker-compose-service` (generates Docker Compose configs)

## Docker Compose Setup

The repository includes a modular Docker Compose setup with Traefik as a reverse proxy:

### Structure

```
compose.yml                  # Root compose file
server/
├── compose.yml             # Main server compose that includes all services
├── common/                 # Common resources
│   ├── networks.yml        # Network definitions
│   └── volumes.yml         # Volume definitions
├── traefik/                # Traefik service directory
│   ├── dev.yml             # Development profile (HTTP)
│   └── prod.yml            # Production profile (HTTPS + Let's Encrypt)
└── tools/                  # Tools application directory
    ├── dev.yml             # Development profile
    └── prod.yml            # Production profile
```

### Docker Commands

- **Development**: `docker compose --profile dev up -d` (HTTP-only for local development)
- **Production**: `docker compose --profile prod up -d` (HTTPS with Let's Encrypt)
- **Stop services**: `docker compose --profile <dev|prod> down`
- **View logs**: `docker compose logs -f <service-name>`

### Prerequisites

1. Create external Docker network: `docker network create web`
2. For production, configure `.env` file with:
   - `DOMAIN=yourdomain.com`
   - `LETSENCRYPT_EMAIL=your-email@example.com`
   - `TRAEFIK_AUTH=<basic-auth-string>`

### Adding New Services

When adding new services, use Moon's code generation:
1. Run `moon run :new-compose-service` to generate Docker Compose configs
2. The generator will create `server/<service-name>/dev.yml` and `prod.yml`
3. Include the service files in `server/compose.yml`
4. Run `moon run :new-app-workflow` to create the CI/CD pipeline

## GitOps CD Pipeline

The repository uses GitHub Actions for continuous deployment:

### CI/CD Architecture
- **Reusable workflows**: `_docker-build.yml` for Docker image building
- **App workflows**: Generated via `moon run :new-app-workflow`
- **Infrastructure deployment**: `deploy-infrastructure.yml` for Docker Compose
- **GitOps sync**: Hourly sync between Git and deployment server

### Deployment Flow
1. **Development** (`develop` branch):
   - Builds Docker images with `develop-<sha>` tags
   - Deploys using `docker compose --profile dev`
   - HTTP-only access via Traefik

2. **Production** (`main` branch):
   - Builds Docker images with `latest` and semantic version tags
   - Deploys using `docker compose --profile prod`
   - HTTPS with Let's Encrypt certificates

### Required GitHub Secrets
```
DOCKER_USERNAME      # Docker Hub username
DOCKER_PASSWORD      # Docker Hub password/token
DEPLOY_HOST         # Deployment server hostname
DEPLOY_USER         # SSH username
DEPLOY_SSH_KEY      # SSH private key
DEPLOY_PATH         # Repository path on server
DOMAIN              # Production domain
LETSENCRYPT_EMAIL   # Email for SSL certificates
TRAEFIK_AUTH        # Basic auth for Traefik dashboard
```

### Adding a New App with CI/CD
```bash
# 1. Generate GitHub Actions workflow
moon generate github-actions
# Follow prompts: app name, path, Docker image name, etc.

# 2. Generate Docker Compose service
moon generate docker-compose-service
# Follow prompts: service config, database needs, etc.

# 3. Update server/compose.yml to include new service
# 4. Commit and push - CI/CD will handle the rest
```

## Important Notes
- The tools app has an existing CLAUDE.md at `apps/tools/CLAUDE.md` with Bun-specific guidance
- Always use absolute imports from workspace packages: `@suho/multitools`
- The monorepo uses workspaces defined in root package.json
- Proto and Moon are prerequisites for development (see CONTRIBUTING.md)