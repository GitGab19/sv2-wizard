// Shared types for wizard components

export type BitcoinNetwork = 'mainnet' | 'testnet4';

export interface NetworkSocketPath {
  label: string;
  path: string; // Linux/Unix path
  macPath: string; // macOS path
}

export type OperatingSystem = 'linux' | 'macos' | 'windows';

