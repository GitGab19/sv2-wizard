# Stratum V2 Deployment Wizard

<p align="center">
    <a href="https://www.npmjs.com/package/sv2-wizard"><img alt="NPM Package" src="https://img.shields.io/npm/v/sv2-wizard.svg?style=flat-square"/></a>
    <a href="https://github.com/stratum-mining/sv2-wizard/blob/main/LICENSE.md"><img alt="MIT or Apache-2.0 Licensed" src="https://img.shields.io/badge/license-MIT%2FApache--2.0-blue.svg"/></a>
</p>

A standalone React component for guiding users through the deployment of SRI (Stratum V2 Reference Implementation) stack. Its design tokens and styling are aligned with [stratumprotocol.org](https://stratumprotocol.org) for consistent branding when embedded in the Stratum V2 website or used in related tools.

## Features

- **Standalone Component**: No dependencies on external layouts or navigation
- **Interactive Wizard**: Multi-step guided flow for SRI deployment
- **Multiple Deployment Paths**: Supports both full stack and proxy-only deployments
- **Docker & Binary Options**: Choose between Docker or manual binary deployment
- **Bitcoin Core Integration**: Guides users through Bitcoin Core node setup
- **Configuration Generation**: Generates deployment configurations automatically
- **Modular Architecture**: Well-organized, maintainable codebase with clear separation of concerns
- **Design Alignment**: CSS variables and theme (light/dark) match stratumprotocol.org for a consistent look when embedded

## Installation

```bash
npm install sv2-wizard
```

## Usage

### Pool Connection Wizard (for miners connecting to pools)

```tsx
import { PoolConnectionWizard } from "sv2-wizard";

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <PoolConnectionWizard 
        onComplete={(finalStepId) => {
          console.log("Wizard completed at step:", finalStepId);
        }}
      />
    </div>
  );
}
```

### Full Stack Wizard (for deploying entire SRI stack)

```tsx
import { FullStackWizard } from "sv2-wizard";

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <FullStackWizard 
        onComplete={(finalStepId) => {
          console.log("Wizard completed at step:", finalStepId);
        }}
      />
    </div>
  );
}
```

## Props

### PoolConnectionWizard / FullStackWizard

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string?` | Additional CSS classes for the wizard container |
| `onComplete` | `(finalStepId: string) => void?` | Callback fired when the wizard completes |

## Styling

The wizard uses Tailwind CSS and design tokens aligned with [stratumprotocol.org](https://stratumprotocol.org). Define the following CSS variables (e.g. in `:root` and `.dark`) so the component renders correctly:

**Core theme:**

- `--background` – Page background
- `--foreground` – Default text color
- `--card` – Card background
- `--card-foreground` – Card text color
- `--primary` – Primary (e.g. cyan) for buttons and accents
- `--primary-foreground` – Text on primary surfaces
- `--muted` – Muted background
- `--muted-foreground` – Muted text
- `--accent` – Accent/hover background
- `--border` – Border color
- `--input` – Input border/background
- `--ring` – Focus ring (often same as primary)

**Semantic (optional, for status messages):**

- `--success` / `--success-foreground`
- `--info` / `--info-foreground`
- `--warning` / `--warning-foreground`

Use `class="dark"` on a parent (e.g. `<html>`) for dark mode. The demo app (`npm run demo`) shows a full setup with light/dark toggle and the same token values as stratumprotocol.org.

## Dependencies

- React 18+ or 19+
- Framer Motion (for animations)
- Lucide React (for icons)
- Radix UI components (Select, Slider, Label, Slot)
- Tailwind CSS

## Architecture Overview

### Wizard Types

The library provides two main wizards for different deployment scenarios:

#### 1. Full Stack Wizard (`FullStackWizard`)
Deploys the complete SRI stack locally for running your own mining pool:

- **SRI Pool** (always) - The mining pool server
- **Job Declarator Server (JDS)** (always) - Connects to Bitcoin Core via RPC
- **Job Declarator Client (JDC)** (optional) - Only if user enables JD mode
- **Translator Proxy** (always) - Connects miners to the pool

**Bitcoin Core Requirements:**
- Required for SRI Pool (to fetch block templates)
- Required for JDC if JD mode is enabled (to construct custom templates)

#### 2. Pool Connection Wizard (`PoolConnectionWizard`)
Connects miners to existing Stratum V2 pools using SRI proxy components:

- **Translator Proxy** (always) - Connects miners to the selected pool
- **Job Declarator Client (JDC)** (optional) - Only if user wants to construct custom templates

**Bitcoin Core Requirements:**
- Only required if JDC is used (to construct custom block templates)
- Not required if using pool's templates

### Available Pools

When connecting to existing pools, users can choose from:

- **SRI Community Pool**: Available on mainnet & testnet4, supports both JD and non-JD modes
- **Braiins Pool**: Available on mainnet only, non-JD mode only (uses pool's templates)
- **Demand Pool**: Available on mainnet only, supports both JD and non-JD modes

### Configuration System

- Each SRI application has its own TOML configuration file
- For Docker deployments, a `.env` file is generated that populates all app configurations
- For binary deployments, individual config files are generated and packaged in a zip

## Code Structure

The codebase is organized into a modular structure for better maintainability:

```
src/
├── wizard/                      # Wizard step components
│   ├── forms/                   # Form components (Pool, Client, Translator, User Identity)
│   ├── ui/                      # Reusable UI components (CodeBlock, InfoCard)
│   ├── bitcoin/                 # Bitcoin Core setup components
│   ├── deployment/              # Deployment result components (Docker/Binaries)
│   ├── utils/                   # Utility functions (file download, env generation)
│   ├── types.ts                 # TypeScript types
│   └── constants.ts             # Constants (network socket paths)
│
├── components/ui/wizard-framework/  # Core wizard framework
│   ├── types.ts                 # Framework types (WizardConfig, WizardStep, etc.)
│   ├── utils.ts                 # Framework utilities
│   ├── WizardStepCard.tsx       # Step card renderer
│   ├── Wizard.tsx               # Main wizard orchestrator
│   └── index.ts                 # Public API
│
├── config-templates/            # Configuration template system
│   ├── templates/               # Raw template strings
│   ├── config-builder.ts        # Template builders
│   ├── pools.ts                 # Pool configurations
│   ├── constants.ts             # Default values and utilities
│   └── types.ts                 # Configuration types
│
├── FullStackWizard.tsx          # Full stack wizard definition
└── PoolConnectionWizard.tsx     # Pool connection wizard definition
```

### Key Design Principles

- **Separation of Concerns**: Each module has a single, clear responsibility
- **Reusability**: Components can be imported and used independently
- **Type Safety**: Full TypeScript support with exported types
- **Maintainability**: Easy to find, update, and test individual components

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run the demo playground
npm run demo
```

You can also build/preview the demo as a static site:

```bash
npm run demo:build
npm run demo:preview
```

## Project Structure

### Wizard Framework (`components/ui/wizard-framework/`)

The core framework that orchestrates wizard flows:
- **Wizard.tsx**: Main component managing state, navigation, and step transitions
- **WizardStepCard.tsx**: Renders different step types (question, instruction, custom, result)
- **types.ts**: TypeScript interfaces for wizard configuration
- **utils.ts**: Helper functions for icons and styling

### Wizard Components (`wizard/`)

Reusable components for wizard steps:
- **forms/**: Configuration forms (Pool, Client, Translator Proxy, User Identity)
- **ui/**: Shared UI components (CodeBlock, InfoCard)
- **bitcoin/**: Bitcoin Core setup instructions and socket path configuration
- **deployment/**: Deployment result displays (Docker and Binaries for both JD and Pool flows)
- **utils/**: File download and environment file generation utilities

### Configuration Templates (`config-templates/`)

Modular system for generating configuration files:
- **templates/**: Raw TOML template strings
- **config-builder.ts**: Functions to build complete configs from templates
- **pools.ts**: Predefined pool configurations
- **constants.ts**: Default values, authority keys, and utility functions

## License
This software is licensed under Apache 2.0 or MIT, at your option.
