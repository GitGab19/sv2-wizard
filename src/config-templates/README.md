# Config Templates Module

This directory contains a modular structure for managing configuration templates, pool data, and config generation logic for the SRI deployment wizard.

## Structure

```
config-templates/
├── index.ts              # Main entry point - exports everything
├── types.ts              # Shared TypeScript types and interfaces
├── constants.ts          # Default values, ports, addresses, etc.
├── utils.ts              # Utility functions (template processing)
├── config-builder.ts     # Centralized config generation logic
├── pools.ts              # Pool configuration data
├── templates/            # Individual config template files
│   ├── index.ts
│   ├── jd-client.template.ts
│   ├── translator.template.ts
│   ├── pool-server.template.ts
│   └── jds.template.ts
└── README.md
```

## Key Features

### 1. **Modular Templates** (`templates/`)
Each configuration type has its own template file:
- `jd-client.template.ts` - Job Declarator Client config
- `translator.template.ts` - Translator Proxy config
- `pool-server.template.ts` - Pool Server config
- `jds.template.ts` - Job Declarator Server config

**To update a template:** Simply edit the corresponding file in `templates/`.

### 2. **Centralized Constants** (`constants.ts`)
All default values, ports, addresses, and placeholders are defined here:
- Default authority keys
- Network-specific RPC ports
- Default configuration values (shares, fees, intervals)
- Address placeholders by network

**To change defaults:** Edit `constants.ts`.

### 3. **Config Builder** (`config-builder.ts`)
Centralized functions for generating configs from templates:
- `buildJdClientConfig(data)` - Builds JD Client config
- `buildTranslatorConfig(data, options)` - Builds Translator config
- `buildPoolServerConfig(data)` - Builds Pool Server config
- `buildJdsConfig(data)` - Builds JDS config
- `buildConfig(type, data, options)` - Generic builder

**To add new config types:** Add a new template file and a builder function.

### 4. **Pool Configuration** (`pools.ts`)
Easy-to-maintain pool data:
```typescript
export const POOLS: Record<string, PoolConfig> = {
  braiins: { ... },
  community_sri: { ... },
  demand: { ... }
};
```

**To add/update pools:** Edit `pools.ts` and add/update entries.

### 5. **Type Safety** (`types.ts`)
Shared TypeScript interfaces:
- `PoolConfig` - Pool configuration structure
- `ConfigTemplateData` - Data structure for config generation
- `ConfigType` - Union type for config types

## Usage Examples

### Basic Usage (Backward Compatible)
```typescript
import { 
  JD_CLIENT_CONFIG_TEMPLATE,
  processConfigTemplate 
} from './config-templates';

const config = processConfigTemplate(JD_CLIENT_CONFIG_TEMPLATE, {
  USER_IDENTITY: "my_username",
  // ... other values
});
```

### Using Config Builders (Recommended)
```typescript
import { buildJdClientConfig } from './config-templates';

const config = buildJdClientConfig({
  userIdentity: "my_username",
  socketPath: "/path/to/node.sock",
  network: "mainnet",
  // ... other values
});
```

### Adding a New Pool
```typescript
// In pools.ts
export const POOLS: Record<string, PoolConfig> = {
  // ... existing pools
  new_pool: {
    name: "New Pool",
    address: "1.2.3.4",
    port: 34254,
    authorityPubkey: "9auqWEzQDVyd2oe1JVGFLMLHZtCo2FFqZwtKA5gd9xbuEu7PH72",
    aggregateChannels: true
  }
};
```

### Updating Default Values
```typescript
// In constants.ts
export const DEFAULT_CONFIG_VALUES = {
  sharesPerMinute: 6.0,  // Change this
  feeThreshold: 100,     // Or this
  // ...
} as const;
```

## Benefits

1. **Easy Maintenance**: Each template is in its own file
2. **Type Safety**: TypeScript interfaces ensure correct data structures
3. **Centralized Logic**: All config generation in one place
4. **Default Management**: All defaults in constants.ts
5. **Pool Management**: Simple pool data structure
6. **Backward Compatible**: Existing code continues to work

## Template Placeholders

Templates use `{{PLACEHOLDER_NAME}}` syntax. See individual template files for available placeholders.

## Future Enhancements

- Network-specific pool configurations
- Template validation
- Config schema validation
- Template versioning
