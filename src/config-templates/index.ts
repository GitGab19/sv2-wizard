// Main entry point for config templates module
// Re-exports everything for backward compatibility and easy imports

// Types
export type { PoolConfig, ConfigTemplateData, ConfigType } from './types';

// Constants
export {
  DEFAULT_AUTHORITY_PUBLIC_KEY,
  DEFAULT_AUTHORITY_SECRET_KEY,
  DEFAULT_CONFIG_VALUES,
  getRpcPort,
  getAddressPlaceholder
} from './constants';

// Templates (backward compatibility)
export {
  JD_CLIENT_CONFIG_TEMPLATE,
  TRANSLATOR_CONFIG_TEMPLATE,
  POOL_SERVER_CONFIG_TEMPLATE,
  JDS_CONFIG_TEMPLATE
} from './templates';

// Utilities
export { processConfigTemplate } from './utils';

// Config builders
export {
  buildJdClientConfig,
  buildTranslatorConfig,
  buildPoolServerConfig,
  buildJdsConfig,
  buildConfig
} from './config-builder';

// Pools
export { POOLS, getPoolConfig } from './pools';
export type { PoolConfig as PoolConfigType } from './pools';
