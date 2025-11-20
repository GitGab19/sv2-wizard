// Constants for wizard components

import type { BitcoinNetwork, NetworkSocketPath } from './types';

export const NETWORK_SOCKET_PATHS: Record<BitcoinNetwork, NetworkSocketPath> = {
  mainnet: {
    label: "Mainnet",
    path: "~/.bitcoin/node.sock",
    macPath: "~/Library/Application Support/Bitcoin/node.sock",
  },
  testnet4: {
    label: "Testnet4",
    path: "~/.bitcoin/testnet4/node.sock",
    macPath: "~/Library/Application Support/Bitcoin/testnet4/node.sock",
  },
  signet: {
    label: "Signet",
    path: "~/.bitcoin/signet/node.sock",
    macPath: "~/Library/Application Support/Bitcoin/signet/node.sock",
  }
};

