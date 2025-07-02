# Contributor guide

## Prerequisites

### System Requirements

Before contributing to this project, ensure you have the following installed on your system:

#### Required Tools
- **Git** - for version control and fetching available versions/tags
- **tar, unzip, gzip, xz** - for unpacking archives

**Install on different systems:**

```bash
# macOS
brew install git unzip gzip xz

# Ubuntu / Debian
apt-get install git unzip gzip xz-utils

# RHEL-based / Fedora
dnf install git unzip gzip xz
```

### Tool Installation

#### 1. Install proto (Multi-language version manager)

**Linux, macOS, WSL:**
```bash
bash <(curl -fsSL https://moonrepo.dev/install/proto.sh)
```

**Windows (Administrator PowerShell):**
```powershell
irm https://moonrepo.dev/install/proto.ps1 | iex
```

> **Note:** The install location can be customized with the `PROTO_HOME` environment variable. Default location is `~/.proto`.

#### 2. Install moon (Build system)

**Recommended: Using proto**
```bash
proto install moon
```

This will install moon to `~/.proto/tools/moon` and make the binary available at `~/.proto/bin`.

## Building the Project

This project uses moon for task management and builds. You can run tasks using the `moon run` command with the target format `<project>:<task>`.

### Basic Build Commands

```bash
# Run a specific project's build task
moon run <project>:build

# In moon v1.14+, "run" can be omitted
moon <project>:build

# Run build task for all projects
moon run :build
```

**Pass arguments to underlying commands:**
```bash
# Pass additional arguments to the task command
moon run <project>:build -- --force
```

### Common Development Tasks

```bash
# Format code
moon run <project>:format

# Run linting
moon run <project>:lint

# Run tests
moon run <project>:test

# Type checking
moon run <project>:typecheck
```

> **Note:** For specific build instructions and available tasks for each project, please refer to the individual project's documentation. 

## Creating a New Project

### 1. Declare the Project in Workspace

Add your new project to the `.moon/workspace.yml` file by mapping a unique project name to its source location:

```yaml
projects:
  my-new-project: 'apps/my-new-project'
  # ... other projects
```

### 2. Configure the Project

Create a `moon.yml` file at the root of your new project directory:

```yaml
# apps/my-new-project/moon.yml
type: 'application'  # or 'library', 'tool'
language: 'typescript'  # or your project language

project:
  name: 'My New Project'
  description: 'Description of what this project does'
  owner: 'team.name'
  maintainers: ['your.name']

tasks:
  build:
    command: 'your build command'
    inputs:
      - 'src/**/*'
    outputs:
      - 'dist'
      
  dev:
    command: 'your dev server command'
    inputs:
      - 'src/**/*'
```
