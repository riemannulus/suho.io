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
└── templates/
    └── tools/              # Tool generation templates
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

## Important Notes
- The tools app has an existing CLAUDE.md at `apps/tools/CLAUDE.md` with Bun-specific guidance
- Always use absolute imports from workspace packages: `@suho/multitools`
- The monorepo uses workspaces defined in root package.json
- Proto and Moon are prerequisites for development (see CONTRIBUTING.md)